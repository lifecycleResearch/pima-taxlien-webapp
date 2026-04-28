const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
  try {
    const { parcelId } = req.query;
    if (!parcelId) {
      return res.status(400).json({ error: 'Parcel ID is required' });
    }
    
    const url = `https://gis.pima.gov/maps/detail.cfm?p=${parcelId}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    
    let mailNameAddress = 'Not available';
    let legalDescription = 'Not available';
    let parcelArea = 'Not available';
    let centroidCoords = 'Not available';
    
    const mailMatch = html.match(/Mail name and address[\s\S]*?<p>([\s\S]*?)<\/td>/);
    if (mailMatch && mailMatch[1]) {
      let addr = mailMatch[1]
        .replace(/<br\s*>/g, ', ')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .replace(/^,\s*/, '')
        .trim();
      if (addr && addr.length > 5) {
        mailNameAddress = addr.replace(new RegExp(`${parcelId},?`), '').replace(/&nbsp;/g, ' ').replace(/^,\s*/, '').trim();
      }
    }
    
    const legalMatch = html.match(/Legal description[\s\S]*?<p>([\s\S]*?)<\/td>/);
    if (legalMatch && legalMatch[1]) {
      let legal = legalMatch[1]
        .replace(/<br\s*>/g, ', ')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (legal && legal.length > 3) {
        legalDescription = legal;
      }
    }
    
    const fullText = $('body').text();
    
    const coordsMatch = fullText.match(/32\.(\d+)\s+degrees?\s+latitude[^0-9]*110\.(\d+)/);
    if (coordsMatch) {
      centroidCoords = `32.${coordsMatch[1]} degrees latitude, -110.${coordsMatch[2]} degrees longitude`;
    }
    
    const acreageMatch = fullText.match(/(\d+\.?\d*)\s*acres?\s*(?:or)?\s*([\d,]+)\s*square feet/);
    if (acreageMatch) {
      parcelArea = `${acreageMatch[1]} acres or ${acreageMatch[2]} square feet`;
    }
    
    res.status(200).json({
      mailNameAddress,
      legalDescription,
      parcelArea,
      centroidCoords
    });
  } catch (error) {
    console.error('Error fetching property details:', error.message);
    res.status(500).json({ error: 'Failed to fetch property details', details: error.message });
  }
}