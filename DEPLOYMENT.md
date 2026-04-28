# Deploy to GitHub + fly.io

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `pima-taxlien-webapp`
3. **Do NOT** initialize with README, .gitignore, or license

## Step 2: Push Code to GitHub

```bash
cd /Users/richardkamolvathin/pima-taxlien-webapp
git add .
git commit -m "Initial commit: Pima Tax Lien Webapp with Hermes Agent"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pima-taxlien-webapp.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to fly.io

### Install flyctl
```bash
curl -L https://fly.io/install.sh | sh
```

### Login to Fly
```bash
fly auth login
```

### Launch the app
```bash
cd /Users/richardkamolvathin/pima-taxlien-webapp
fly launch --no-deploy
```

When prompted:
- App name: `pima-taxlien-webapp` (or choose your own)
- Region: Choose closest to you (e.g., `sjc` for San Jose)
- Set up PostgreSQL: **No**
- Set up Upstash Redis: **No**
- Deploy now: **No**

### Set secrets
```bash
fly secrets set OPENAI_API_KEY=your-secret-key-here
```

Replace `your-secret-key-here` with a strong random string.

### Deploy
```bash
fly deploy
```

After deployment, you'll get a URL like: `https://pima-taxlien-webapp.fly.dev`

## Step 4: Verify Deployment

```bash
# Check app status
fly status

# View logs
fly logs

# Open in browser
fly open
```

## What You Get

| Component | URL |
|-----------|-----|
| **Tax Lien Webapp** | https://pima-taxlien-webapp.fly.dev |
| **Hermes Agent API** | https://pima-taxlien-webapp.fly.dev:8642 |
| **Open WebUI** | https://pima-taxlien-webapp.fly.dev:3000 (if configured) |

## Connect Open WebUI to Hermes Agent

1. Open https://pima-taxlien-webapp.fly.dev:3000
2. Go to Admin Settings → Connections → OpenAI
3. Add connection:
   - URL: `http://localhost:8642/v1` (or internal Docker network URL)
   - API Key: (your OPENAI_API_KEY)

## Alternative: Deploy to Vercel

If you prefer Vercel (serverless), the tax lien webapp is already deployed at:
**https://pima-taxlien-webapp.vercel.app**

To also host there:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/richardkamolvathin/pima-taxlien-webapp
vercel --prod
```

## Notes

- Hermes Agent needs terminal access, so it **cannot run on Vercel** (no shell access)
- Use **fly.io** or a VPS for Hermes Agent
- The tax lien webapp (frontend only) can run anywhere
- For production, consider using a VPS (DigitalOcean/Linode) for ~$5/month

## Troubleshooting

### App won't start
```bash
fly logs
fly status
```

### Port issues
Make sure `fly.toml` has:
```toml
[[services]]
  protocol = "tcp"
  internal_port = 3000
```

### Hermes Agent not accessible
Check if it's running:
```bash
fly ssh console
hermes --version
```
