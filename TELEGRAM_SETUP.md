# Telegram Bot + Open WebUI + Hermes Agent Setup

## What This Does

- **Open WebUI**: Web interface for chatting with AI
- **Hermes Agent**: Autonomous AI agent with tools (terminal, files, web search)
- **Telegram Bot**: Control Open WebUI via Telegram messages
- **Tax Lien Webapp**: Pima County property data (already deployed)

## Quick Start

### 1. Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Choose a name: `Pima Tax Lien Bot`
4. Choose a username: `pima_tax_lien_bot` (must end in `bot`)
5. Copy the token: `8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE`

### 2. Get Your Chat ID

1. Search for `@userinfobot` in Telegram
2. Send any message
3. It will reply with your Chat ID (e.g., `123456789`)

### 3. Configure Environment

Edit `.env` file:

```bash
TELEGRAM_BOT_TOKEN=8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE
TELEGRAM_CHAT_ID=your-chat-id-here
OPENWEBUI_USERNAME=admin@example.com
OPENWEBUI_PASSWORD=your-password
```

### 4. Start Everything

```bash
cd /Users/richardkamolvathin/pima-taxlien-webapp
docker compose up -d
```

This starts:
- Open WebUI at http://localhost:3000
- Hermes Agent at http://localhost:8642
- Telegram Bot (connected to Open WebUI)

### 5. Connect Telegram Bot

1. Open Telegram and find your bot (`@pima_tax_lien_bot`)
2. Send `/start`
3. Now you can chat with Hermes Agent via Telegram!

## Usage

### Via Telegram:
```
/ask What properties are available under $3000?
/ask Analyze parcel 109-31-1140
/ask Export all active properties to CSV
```

### Via Web:
Open http://localhost:3000 and chat in the browser

## Architecture

```
[Telegram] → [Telegram Bot] → [Open WebUI] → [Hermes Agent] → [Tax Lien APIs]
```

## Deploy to fly.io (Public URL)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Set secrets
fly secrets set TELEGRAM_BOT_TOKEN=8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE
fly secrets set TELEGRAM_CHAT_ID=your-chat-id

# Deploy
fly deploy
```

You'll get: `https://pima-taxlien-webapp.fly.dev`

## Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local development stack |
| `.env.example` | Environment template |
| `server.js` | Express server (proxy) |
| `fly.toml` | fly.io configuration |

## Troubleshooting

### Bot not responding
```bash
docker compose logs telegram-bot
```

### Open WebUI can't connect to Hermes
```bash
docker compose logs hermes-agent
curl http://localhost:8642/v1/models
```

### Telegram webhook error
```bash
curl "https://api.telegram.org/bot8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE/getWebhookInfo"
```

## Next Steps

1. Customize the bot's personality in Open WebUI
2. Add more tools to Hermes Agent
3. Connect to Pima Tax Lien APIs for real-time data
4. Set up notifications for new properties
