# Example EPK JSON

The full EPK JSON reference and example payload documentation now live in one place:

```txt
../packages/schema/README.md
```

Main example file:

```txt
demo-epk.example.json
```

Additional test artist file:

```txt
madisonbeer-epk.json
```

Validate from the repo root:

```bash
bun run validate:epk examples/demo-epk.example.json
```

Import a validated file into the running API:

```bash
bun run import:epk examples/madisonbeer-epk.json --admin-key "$ADMIN_API_KEY" --confirm
```
