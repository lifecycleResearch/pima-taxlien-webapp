# Quick Start Guide

## ✅ What's Working

- **Live Site**: https://pima-taxlien-webapp.vercel.app
- **GitHub**: https://github.com/lifecycleResearch/pima-taxlien-webapp

## Features

- Browse tax lien properties
- Filter by Active status
- Export to CSV
- View property details
- Zoning information
- Demo mode (when auction not active)

## Local Development

```bash
# Install dependencies
cd client && npm install

# Run frontend
npm run dev

# Build for production
npm run build
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/richardkamolvathin/pima-taxlien-webapp
vercel --prod
```

## Optional: Run Open WebUI Locally

```bash
# Start Open WebUI
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e OPENAI_API_KEY=your-key \
  ghcr.io/open-webui/open-webui:main

# Open in browser
open http://localhost:3000
```

## Optional: Add Telegram Bot

1. Create bot with @BotFather (get token)
2. Get chat ID with @userinfobot
3. Configure environment variables
4. Use a Telegram-OpenWebUI bridge

See TELEGRAM_SETUP.md for details.

## Project Structure

```
pima-taxlien-webapp/
├── api/              # Serverless API endpoints
│   ├── preview-items.js
│   ├── property-details.js
│   └── zoning.js
├── client/           # React frontend
│   └── src/pages/
├── docker-compose.yml
├── vercel.json
└── README.md
```

## Notes

- The 2026 tax lien auction has concluded
- App displays demo data when auction is not active
- Check back in 2027 for next auction
- APIs gracefully degrade when external sources are unavailable
