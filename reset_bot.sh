#!/bin/bash
echo "Resetting Telegram bot..."
docker stop pima-taxlien-webapp-telegram-bot-1 2>/dev/null
docker rm pima-taxlien-webapp-telegram-bot-1 2>/dev/null
docker stop pima-taxlien-webapp-telegram-bot-1 2>/dev/null  
docker rm pima-taxlien-webapp-telegram-bot-1 2>/dev/null

echo "Cleaning up..."
docker compose up -d --force-recreate telegram-bot 2>&1 | tail -10

echo "Waiting for bot to start..."
sleep 30

echo "Checking status..."
docker ps | grep telegram

echo "Done!"
