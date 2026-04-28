# Hermes Agent Setup for Pima Tax Lien Webapp

This project includes an AI assistant powered by [Hermes Agent](https://github.com/NousResearch/hermes-agent) from Nous Research.

## What is Hermes Agent?

Hermes Agent is an autonomous AI agent with built-in tools:
- Terminal access
- File operations  
- Web search
- Memory
- Extensible skills

It exposes an OpenAI-compatible API server that can be used with Open WebUI for a chat interface.

## Quick Start

### 1. Install Hermes Agent

Follow the [official quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart).

Verify installation:
```bash
hermes --version
```

### 2. Configure Hermes Agent

Create or edit `~/.hermes/.env`:

```bash
API_SERVER_ENABLED=true
API_SERVER_KEY=your-secret-key-here
API_SERVER_PORT=8642
```

Replace `your-secret-key-here` with a strong random string.

### 3. Start Hermes Agent Gateway

```bash
hermes gateway
```

You should see:
```
[API Server] API server listening on http://127.0.0.1:8642
```

### 4. Start Open WebUI (Optional - for chat interface)

Using Docker Compose:

```bash
docker compose up -d
```

Then open http://localhost:3000 and create your admin account.

### 5. Connect Open WebUI to Hermes Agent

1. Go to ⚙️ **Admin Settings** → **Connections** → **OpenAI**
2. Click ➕ **Add Connection**
3. Enter:
   - **URL**: `http://host.docker.internal:8642/v1`
   - **API Key**: The `API_SERVER_KEY` from Step 2
4. Click ✅ to verify, then **Save**

The `hermes-agent` model will appear in the model dropdown.

## Using Hermes Agent with Tax Lien Data

Once connected, you can ask the agent to:

- "Search for tax lien properties with face amount under $3000"
- "Analyze the property at parcel 109-31-1140"
- "What are the zoning restrictions for commercial properties?"
- "Export a list of all active properties to CSV"

The agent has access to:
- Web search (to find additional property info)
- File operations (to save reports)
- Terminal access (to run scripts)

## Environment Variables

Create a `.env` file in the project root:

```bash
HERMES_API_KEY=your-secret-key-here
```

## Troubleshooting

### No models appear in dropdown
- Verify URL includes `/v1`: `http://localhost:8642/v1`
- Check gateway is running: `curl http://localhost:8642/health`
- Check models: `curl http://localhost:8642/v1/models`

### Connection test passes but no models load
- Ensure `/v1` suffix is in the URL
- Open WebUI's test checks connectivity, not model discovery

### Linux Docker (no Docker Desktop)
```bash
# Option 1: Add host mapping
docker run --add-host=host.docker.internal:host-gateway ...

# Option 2: Use host networking
docker run --network=host -e OPENAI_API_BASE_URL=http://localhost:8642/v1 ...
```

## Learn More

- [Hermes Agent Documentation](https://hermes-agent.nousresearch.com/docs/)
- [Open WebUI Docs](https://docs.openwebui.com/)
- [Nous Research Discord](https://discord.gg/NousResearch)
