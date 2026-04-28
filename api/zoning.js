const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
  try {
    const { parcelId, type = 'ZoningBase' } = req.query;
    if (!parcelId) {
      return res.status(400).json({ error: 'Parcel ID is required' });
    }
    
    const typeName = type === 'ZoningBase' ? 'Zoning' : type;
    const url = `https://gis.pima.gov/maps/detail.cfm?mode=overlayParcelResults&type=${type}&typename=${typeName}&parcel=${parcelId}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    
    const zoningInfo = [];
    let foundAny = false;
    
    $('table table').each((i, table) => {
      $(table).find('tr').each((j, tr) => {
        const rowText = $(tr).text();
        if (rowText.includes('Zoning') && !rowText.includes('Zoning -') && rowText.length > 2) {
          foundAny = true;
          const cleanText = rowText.replace(/\s+/g, ' ').trim();
          const isActive = !rowText.includes('Deleted') && !rowText.includes('Removed');
          zoningInfo.push({
            type: cleanText,
            active: isActive
          });
        }
      });
    });
    
    if (!foundAny) {
      const fullText = $('body').text();
      const lines = fullText.split('\n').filter(l => l.trim().length > 2);
      let inSection = false;
      for (const line of lines) {
        if (line.includes('Zoning')) {
          inSection = true;
        }
        if (inSection && line.includes('Zoning')) {
          const cleanLine = line.replace(/\s+/g, ' ').trim();
          if (cleanLine.length > 3 && cleanLine.length < 100) {
            zoningInfo.push({
              type: cleanLine,
              active: true
            });
          }
          inSection = false;
        }
      }
    }
    
    res.status(200).json({ zoning: zoningInfo });
  } catch (error) {
    console.error('Error fetching zoning info:', error);
    res.status(500).json({ error: 'Failed to fetch zoning information' });
  }
}