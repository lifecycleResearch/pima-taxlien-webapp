const axios = require('axios');
const cheerio = require('cheerio');

const DEMO_PROPERTIES = [
  { itemNum: '1', taxYear: '2024', certYear: '2025', parcelId: '109-31-1140', faceAmount: '$3,456.00', status: 'Active' },
  { itemNum: '2', taxYear: '2024', certYear: '2025', parcelId: '109-32-220A', faceAmount: '$2,890.00', status: 'Active' },
  { itemNum: '3', taxYear: '2024', certYear: '2025', parcelId: '109-33-445B', faceAmount: '$4,521.00', status: 'Active' },
  { itemNum: '4', taxYear: '2024', certYear: '2025', parcelId: '110-22-1180', faceAmount: '$1,987.00', status: 'Active' },
  { itemNum: '5', taxYear: '2024', certYear: '2025', parcelId: '108-15-220C', faceAmount: '$5,234.00', status: 'Active' },
  { itemNum: '6', taxYear: '2024', certYear: '2025', parcelId: '111-44-330D', faceAmount: '$3,102.00', status: 'Active' },
  { itemNum: '7', taxYear: '2024', certYear: '2025', parcelId: '109-28-215A', faceAmount: '$2,456.00', status: 'Active' },
  { itemNum: '8', taxYear: '2024', certYear: '2025', parcelId: '112-11-445B', faceAmount: '$4,876.00', status: 'Inactive' },
  { itemNum: '9', taxYear: '2024', certYear: '2025', parcelId: '107-33-112C', faceAmount: '$3,678.00', status: 'Active' },
  { itemNum: '10', taxYear: '2024', certYear: '2025', parcelId: '110-28-227A', faceAmount: '$2,134.00', status: 'Active' },
  { itemNum: '11', taxYear: '2024', certYear: '2025', parcelId: '109-41-118D', faceAmount: '$4,012.00', status: 'Active' },
  { itemNum: '12', taxYear: '2024', certYear: '2025', parcelId: '111-22-335B', faceAmount: '$2,789.00', status: 'Active' },
];

module.exports = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const statusFilter = req.query.status || '';
    const demo = req.query.demo !== undefined;
    
    let items = [];
    let isDemo = false;
    
    if (demo) {
      isDemo = true;
    } else {
      try {
        const url = `https://pima.arizontataxsale.com/index.cfm?folder=previewitems&page=${page}`;
        
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 5000,
        });
        
        const $ = cheerio.load(response.data);
        
        $('table tr').each((index, element) => {
          if (index === 0) return;
          const cells = $(element).find('td');
          if (cells.length >= 6) {
            const item = {
              itemNum: $(cells[0]).text().trim(),
              taxYear: $(cells[1]).text().trim(),
              certYear: $(cells[2]).text().trim(),
              parcelId: $(cells[3]).text().trim(),
              faceAmount: $(cells[4]).text().trim(),
              status: $(cells[5]).text().trim(),
              parcelLink: $(cells[3]).find('a').attr('href') || null,
            };
            
            if (!statusFilter || item.status === statusFilter) {
              items.push(item);
            }
          }
        });
      } catch (sourceError) {
        console.log('External source unavailable, using demo data:', sourceError.message);
        isDemo = true;
      }
    }
    
    if (isDemo) {
      const startIdx = (page - 1) * 12;
      items = DEMO_PROPERTIES.slice(startIdx, startIdx + 12).map((p, i) => ({
        ...p,
        itemNum: String(startIdx + i + 1),
      }));
      
      if (statusFilter) {
        items = items.filter(p => p.status === statusFilter);
      }
    }
    
    res.status(200).json({
      items,
      isDemo,
      message: isDemo ? 'Using demo data - auction has concluded' : null,
      page,
      hasMore: !isDemo || page < 3,
    });
  } catch (error) {
    console.error('Error fetching preview items:', error.message);
    res.status(500).json({ error: 'Failed to fetch preview items', details: error.message });
  }
};