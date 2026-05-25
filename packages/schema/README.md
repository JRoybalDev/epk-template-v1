# EPK Schema

Shared Zod schema and TypeScript types for the EPK JSON payload.

Main file:

```txt
index.ts
```

Exports:

```ts
EPKSchema
BrandingSchema
HomeSchema
MusicSchema
ReleaseSchema
VideoSchema
TourSchema
TourDateSchema
VIPSchema
ShopSchema
AboutSchema
NewsletterSchema
FooterSchema
ContactSchema
```

Primary type:

```ts
type EPK
```

## Example Payload

See:

```txt
../../examples/demo-epk.example.json
```

Validate the example from the repo root:

```bash
bun run validate:epk examples/demo-epk.example.json
```

That command is a dry run by default and does not write to the database.
