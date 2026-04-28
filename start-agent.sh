#!/bin/bash

# Start Hermes Agent Gateway
echo "Starting Hermes Agent Gateway..."
hermes gateway &

# Wait for gateway to start
sleep 3

# Start Open WebUI with Docker
echo "Starting Open WebUI..."
docker compose up -d

echo ""
echo "✅ Services started!"
echo ""
echo "Hermes Agent Gateway: http://localhost:8642"
echo "Open WebUI: http://localhost:3000"
echo ""
echo "Don't forget to:"
echo "1. Configure ~/.hermes/.env with API_SERVER_ENABLED=true"
echo "2. Connect Open WebUI to Hermes Agent (Admin Settings → Connections → OpenAI)"
echo "   - URL: http://host.docker.internal:8642/v1"
echo "   - API Key: (your API_SERVER_KEY from .env)"
