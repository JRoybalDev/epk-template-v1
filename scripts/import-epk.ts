import { readFileSync } from 'fs'
import { resolve } from 'path'
import { validateEPK } from '../packages/schema'

type ImportArgs = {
  adminKey?: string
  apiUrl: string
  confirm: boolean
  filePath?: string
}

const usage = `
Usage:
  bun run import:epk <path-to-json> [--admin-key <key>] [--api-url <url>] [--confirm]

Examples:
  bun run import:epk examples/demo-epk.example.json
  bun run import:epk examples/demo-epk.example.json --admin-key "$ADMIN_API_KEY" --confirm

By default this is a dry run. It validates the JSON but does not write anything.
Add --confirm to POST the validated EPK to the local API.
`.trim()

const readArgs = (): ImportArgs => {
  const args = Bun.argv.slice(2)
  const result: ImportArgs = {
    apiUrl: process.env.EPK_API_URL ?? 'http://localhost:3001',
    adminKey: process.env.ADMIN_API_KEY,
    confirm: false,
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (!arg) continue

    if (arg === '--help' || arg === '-h') {
      console.log(usage)
      process.exit(0)
    }

    if (arg === '--confirm') {
      result.confirm = true
      continue
    }

    if (arg === '--admin-key') {
      result.adminKey = args[index + 1]
      index += 1
      continue
    }

    if (arg === '--api-url') {
      result.apiUrl = args[index + 1] ?? result.apiUrl
      index += 1
      continue
    }

    if (!arg.startsWith('--') && !result.filePath) {
      result.filePath = arg
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return result
}

const readJsonFile = (filePath: string) => {
  const absolutePath = resolve(filePath)
  const raw = readFileSync(absolutePath, 'utf8')

  return {
    absolutePath,
    data: JSON.parse(raw),
  }
}

const postEPK = async (apiUrl: string, adminKey: string, data: unknown) => {
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/epk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': adminKey,
    },
    body: JSON.stringify(data),
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(
      `Import failed with status ${response.status}: ${responseText}`,
    )
  }

  return responseText
}

try {
  const args = readArgs()

  if (!args.filePath) {
    console.error(usage)
    process.exit(1)
  }

  const { absolutePath, data } = readJsonFile(args.filePath)
  const validation = validateEPK(data)
  if (!validation.success) {
    const issues = validation.issues
      .map((issue) => `${issue.path || 'root'}: ${issue.message}`)
      .join('\n')

    throw new Error(`EPK validation failed:\n${issues}`)
  }

  const epk = validation.data

  console.log(`Validated EPK JSON: ${absolutePath}`)
  console.log(`Artist: ${epk.artistName}`)
  console.log(`Slug in file: ${epk.slug}`)

  if (!args.confirm) {
    console.log('Dry run complete. No data was imported.')
    console.log('Run again with --confirm to POST this EPK to the API.')
    process.exit(0)
  }

  if (!args.adminKey) {
    throw new Error(
      'ADMIN_API_KEY is required. Set it in the environment or pass --admin-key.',
    )
  }

  const responseText = await postEPK(args.apiUrl, args.adminKey, epk)
  console.log(`Imported EPK to ${args.apiUrl}/api/epk`)
  console.log(responseText)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
}
