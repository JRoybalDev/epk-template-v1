# Example EPK JSON

The full EPK JSON reference and example payload documentation now live in one place:

```txt
../packages/schema/README.md
```

Main example file:

```txt
demo-epk.example.json
```

Validate from the repo root:

```bash
bun run validate:epk examples/demo-epk.example.json
```

Import a validated file into the running API:

```bash
bun run import:epk examples/demo-epk.example.json --admin-key "$ADMIN_API_KEY" --confirm
```

For a real artist, copy `demo-epk.example.json` to a new JSON file outside the committed demo payload, replace the content, validate it, and import with `--confirm` when ready.
