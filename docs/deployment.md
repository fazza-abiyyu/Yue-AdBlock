# Deployment Guide

## Vercel (Recommended)

Vercel is the recommended platform for hosting Yue AdBlock due to its Bun runtime support and global CDN.

### Setup

1. Push your Yue-AdBlock repository to GitHub
2. Go to [vercel.com](https://vercel.com) and create a new project
3. Import the Yue-AdBlock repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

### Configuration

The `vercel.json` is pre-configured:
```json
{
  "buildCommand": "bun install",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": null,
  "functions": {
    "api/index.ts": {
      "runtime": "bun"
    }
  }
}
```

### Custom Domain

1. In Vercel dashboard, go to Project → Settings → Domains
2. Add your domain (e.g., `yue-adblock.abiyyu.xyz`)
3. Configure DNS records at your domain provider
4. Vercel will provide the required DNS records

## Docker

### Dockerfile

Create a `Dockerfile`:

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["bun", "run", "start"]
```

### Build & Run

```bash
docker build -t yue-adblock .
docker run -p 3000:3000 -e PORT=3000 yue-adblock
```

## Self-Hosted (Bun)

```bash
# Clone
git clone https://github.com/fazza-abiyyu/Yue-AdBlock.git
cd Yue-AdBlock

# Install & run
bun install
PORT=3000 bun run start
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yue-adblock.abiyyu.xyz;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Process Manager (PM2)

```bash
bun install -g pm2
pm2 start "bun run start" --name yue-adblock
pm2 save
pm2 startup
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port to listen on |
| `NODE_ENV` | `development` | Environment mode |

No database is required — all data is served from static files.
