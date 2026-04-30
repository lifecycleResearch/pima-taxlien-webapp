# Pima County Tax Lien Webapp - Quick Start

## Webapp
- **URL**: https://pima-taxlien-webapp.vercel.app
- **GitHub**: https://github.com/lifecycleResearch/pima-taxlien-webapp

## Telegram Bot
- **Bot**: @Pimataxbot
- **Token**: 8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE
- **Chat ID**: 7728729497

### Running the Bot

#### Option 1: Docker (Recommended)
```bash
cd pima-taxlien-webapp
docker compose up -d telegram-bot
docker logs -f pima-taxlien-webapp-telegram-bot-1
```

#### Option 2: Local Python
```bash
pip install python-telegram-bot requests
python bot_ptb.py
```

### Test the Bot
1. Open Telegram
2. Search for @Pimataxbot
3. Send: `/ask What is the capital of France?`
4. Bot should reply with AI-generated answer

### Troubleshooting
- **Bot not responding?** Make sure no other instances are running (only one poller at a time)
- **Open WebUI not responding?** Check: `docker compose ps`
- **Check Open WebUI**: http://localhost:3000
