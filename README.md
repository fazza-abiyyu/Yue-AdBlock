# Yue AdBlock

Remote adblock policy & filter rule server for Yue Browser. Built with Bun + Elysia following the CP Center pattern.

## Structure

```
src/
├── app.ts              # Elysia app factory (match cp-center pattern)
├── index.ts            # Entry point — exports createApp() default
├── lib/
│   ├── endpoint/       # Route mounting, schema validation
│   ├── exception/      # ODataError, error handler
│   ├── http/           # CORS middleware
│   └── odata/          # OData response builders
├── infrastructure/
│   └── config/         # Environment config (Zod-validated)
├── modules/
│   ├── health/         # Health check (live, ready)
│   ├── metadata/       # Engine metadata & rule hashes
│   └── adblock/        # Policy profiles, rule files
├── endpoints/          # Route definitions (method + path + handler)
│   ├── health/
│   ├── metadata/
│   └── adblock/
└── modules/registry.ts # Module builder registry
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health/live` | Process alive check |
| GET | `/health/ready` | Service readiness check |
| GET | `/adblock/metadata` | Engine version, rule hashes, profiles list |
| GET | `/adblock/policy?profile={name}` | Get policy profile (balanced, aggressive, minimal, anti-judol) |
| GET | `/adblock/profiles` | List all available policy profiles |
| GET | `/adblock/rules/{ruleName}` | Download rule file (e.g., easylist.txt, ad_domains.txt) |

## Deployment (Vercel)

```bash
vercel --prod
```

`vercel.json` already configured with `bunVersion: "1.x"`.
