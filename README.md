# Yue AdBlock

Remote adblock policy & filter rule server for Yue Browser.

Yue AdBlock is the backend service that provides adblock policies, filter rules, and metadata to the Yue Browser Android client. It enables over-the-air updates so that adblock strategies and rule files can be updated without requiring an app rebuild.

## Features

- **Policy Profiles**: Balanced, Aggressive, Minimal, and Anti-Judol presets
- **Filter Rule Distribution**: Host blocklists (easylist, abpindo, ad_domains), cosmetic selectors, and dangerous element lists
- **OData v4 API**: RESTful endpoints with OData-style responses
- **File-Based Storage**: No database required — policies and rules served from static JSON/text files
- **Vercel Ready**: Deployable to Vercel with Bun runtime
- **Intelligent Sync**: Client-side hash-based rule caching to minimize bandwidth

## Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia (TypeScript)
- **Language**: TypeScript (strict mode)
- **Validation**: Zod

## Architecture

```
Android Client (Yue Browser)
        |
        | HTTPS
        v
  Yue AdBlock (this service)
        |
        |-- /api/health          → Health check
        |-- /api/metadata        → Policy version, rule hashes, profiles
        |-- /api/policy         → Full adblock configuration
        |-- /api/profiles        → List available profiles
        |-- /api/rules/:name     → Filter rule file download
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check with uptime |
| GET | `/api/metadata` | Full metadata: policy version, rule hashes, available profiles |
| GET | `/api/policy?profile={name}` | Get adblock policy for a specific profile |
| GET | `/api/profiles` | List available policy profiles |
| GET | `/api/rules/{name}` | Download a filter rule file (plain text) |

### Policy Profiles

| Profile | Description |
|---------|-------------|
| `balanced` | Recommended: blocks trackers and ads while maintaining site functionality |
| `aggressive` | Maximum blocking: includes stricter rules and broader cosmetic filtering |
| `minimal` | Lightweight: only blocks known malicious domains |
| `anti-judol` | Specialized: blocks gambling-related content aggressively |

### Sync Flow

```
App Opens → Check last sync timestamp (>6h?)
  ├─ Yes → Fetch /metadata → Compare rule hashes → Download changed rules → Save new policy
  └─ No  → Skip sync, use cached policy
```

## Development

### Prerequisites

- [Bun](https://bun.sh) runtime >= 1.0

### Setup

```bash
# Install dependencies
bun install

# Start development server with hot reload
bun run dev

# Production start
bun run start
```

Server runs at `http://localhost:3000`.

### Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start with hot reload |
| `bun run start` | Start production server |
| `bun run typecheck` | TypeScript type checking |
| `bun run lint` | ESLint with auto-fix |
| `bun run format` | Prettier formatting |

### Project Structure

```
yue-adblock/
├── api/                          # Vercel adapter
│   └── index.ts                  # Vercel entry point
├── public/
│   └── adblock/
│       ├── metadata.json         # Service metadata & rule hashes
│       ├── policies/             # Policy profile definitions
│       │   ├── balanced.json
│       │   ├── aggressive.json
│       │   ├── minimal.json
│       │   └── anti-judol.json
│       └── rules/                # Filter rule files
│           ├── ad_domains.txt
│           ├── easylist.txt
│           ├── abpindo.txt
│           ├── cosmetic_selectors.txt
│           └── ...
├── src/
│   ├── infrastructure/
│   │   └── config/index.ts       # Zod-based config validation
│   ├── lib/
│   │   ├── endpoint/             # Base endpoint class
│   │   ├── exception/            # Error handling
│   │   └── odata/                # OData v4 helpers
│   ├── modules/
│   │   ├── adblock/              # Core adblock module
│   │   ├── health/               # Health check
│   │   └── metadata/             # Service metadata
│   ├── app.ts                    # Elysia app setup
│   └── index.ts                  # Entry point
├── vercel.json                   # Vercel deployment config
└── package.json
```

## Deployment

### Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Set runtime to Bun
4. Deploy

The `vercel.json` and `api/index.ts` handle the adapter.

### Docker / Self-Hosted

```bash
# Clone and install
git clone https://github.com/fazza-abiyyu/Yue-AdBlock.git
cd Yue-AdBlock
bun install

# Run
PORT=3000 bun run start
```

## Updating Rules

Filter rules are stored as plain text files in `public/adblock/rules/`. To update:

1. Add/update the rule file in `public/adblock/rules/`
2. Update the hash in `public/adblock/metadata.json`
3. Restart the server (or push to deploy)

The Android client will detect hash changes and download updated rules automatically on next sync.

## License

Apache-2.0 © Yue Browser
