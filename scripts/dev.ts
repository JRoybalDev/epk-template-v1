const bun = process.execPath

type DevCommand = {
  name: string
  cwd: string
  cmd: string[]
}

// Runs the API and web app together. Use `bun run dev:web` or `bun run dev:api`
// to run either one on its own.
const commands: DevCommand[] = [
  {
    name: 'api',
    cwd: 'apps/api',
    cmd: [bun, 'run', 'dev'],
  },
  {
    name: 'web',
    cwd: 'apps/web',
    cmd: [bun, 'run', 'dev', '--host', '0.0.0.0'],
  },
]

const children: Bun.Subprocess[] = []

const prefixOutput = async (
  name: string,
  stream: ReadableStream<Uint8Array> | null,
) => {
  if (!stream) return

  const decoder = new TextDecoder()
  let pending = ''

  for await (const chunk of stream) {
    pending += decoder.decode(chunk, { stream: true })
    const lines = pending.split(/\r?\n/)
    pending = lines.pop() ?? ''

    for (const line of lines) {
      if (line.length > 0) console.log(`[${name}] ${line}`)
    }
  }

  if (pending.length > 0) console.log(`[${name}] ${pending}`)
}

const stopAll = () => {
  for (const child of children) {
    child.kill()
  }
}

process.on('SIGINT', () => {
  stopAll()
  process.exit(0)
})

process.on('SIGTERM', () => {
  stopAll()
  process.exit(0)
})

for (const command of commands) {
  const child = Bun.spawn(command.cmd, {
    cwd: command.cwd,
    stdout: 'pipe',
    stderr: 'pipe',
  })

  children.push(child)
  void prefixOutput(command.name, child.stdout)
  void prefixOutput(command.name, child.stderr)

  void child.exited.then((code) => {
    if (code !== 0) {
      console.error(`[${command.name}] exited with code ${code}`)
      stopAll()
      process.exit(code)
    }
  })
}

await Promise.all(children.map((child) => child.exited))
