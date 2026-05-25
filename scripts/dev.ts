const bun = process.execPath

const commands = [
  {
    name: 'server',
    cwd: 'apps/server',
    cmd: [bun, 'run', 'index.ts'],
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://postgres:password@localhost:5432/epk_db',
      EPK_SLUG: process.env.EPK_SLUG ?? 'site',
      ADMIN_API_KEY: process.env.ADMIN_API_KEY ?? 'dev-admin-key-change-me',
    },
  },
  {
    name: 'web',
    cwd: 'apps/web',
    cmd: [bun, 'run', 'dev', '--host', '0.0.0.0'],
    env: {},
  },
] as const

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
    env: {
      ...process.env,
      ...command.env,
    },
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
