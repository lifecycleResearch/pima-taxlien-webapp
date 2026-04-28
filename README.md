# Pima Tax Lien Webapp

A Zillow-like web application for browsing Pima County tax lien properties with real-time data from county systems.

## Live Demo

**https://pima-taxlien-webapp.vercel.app**

## Features

- Browse tax lien properties with pagination
- Filter by Active status
- Export to CSV
- View detailed property information (mailing address, legal description, parcel area, coordinates)
- Zoning information overlays
- Demo mode (when auction is not active)

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express (Vercel Serverless)
- **Scraping**: Axios + Cheerio
- **Deployment**: Vercel

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/preview-items.js` | List tax lien properties (supports `page` and `status` params) |
| `/api/property-details.js` | Get detailed property info by parcel ID |
| `/api/zoning.js` | Get zoning overlays for a parcel |

## Local Development

```bash
# Install dependencies
cd client && npm install

# Run frontend
npm run dev

# Build for production
npm run build
```

## Deployment

```bash
# Deploy to Vercel
npx vercel --prod
```

## AI Agent Integration (Hermes Agent)

This project includes integration with [Hermes Agent](https://github.com/NousResearch/hermes-agent) from Nous Research.

See [HERMES_SETUP.md](./HERMES_SETUP.md) for setup instructions.

Quick start:
```bash
# 1. Install Hermes Agent (follow https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
# 2. Configure ~/.hermes/.env with API_SERVER_ENABLED=true
# 3. Start gateway
hermes gateway

# 4. Start Open WebUI with Docker
docker compose up -d

# 5. Open http://localhost:3000 and connect to Hermes Agent
```

## Data Source

This app scrapes data from:
- Pima County Tax Lien Sale (pima.arizontataxsale.com) - *Currently offline, using demo data*
- Pima County GIS (gis.pima.gov)

## Notes

The 2026 tax lien auction has concluded. The app currently displays demo data with a banner indicating when the auction is not active. Check back in 2027 for the next auction.

## License

MIT
