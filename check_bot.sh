#!/bin/bash
# Check if bot is running
echo "Checking bot process..."
docker exec pima-taxlien-webapp-telegram-bot-1 ps aux 2>&1 | grep -i python

# Check recent activity
echo -e "\nChecking bot logs..."
docker logs pima-taxlien-webapp-telegram-bot-1 2>&1 | tail -20

# Check if bot received any updates
echo -e "\nChecking Telegram API..."
curl -s "https://api.telegram.org/bot8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE/getUpdates" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'Updates: {len(d.get(\"result\", []))}')"
