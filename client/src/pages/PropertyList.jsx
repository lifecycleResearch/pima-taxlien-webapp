import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const fetchProperties = async (page, status = '') => {
    setLoading(true);
    try {
      const url = `/api/preview-items.js?page=${page}${status ? `&status=${status}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      const propertiesList = data.items || data;
      
      if (data.isDemo !== undefined) setIsDemo(data.isDemo);
      
      if (propertiesList.length === 0) {
        setHasMore(false);
      } else if (page === 1) {
        setProperties(propertiesList);
      } else {
        setProperties(prev => [...prev, ...propertiesList]);
      }
      
      if (data.hasMore !== undefined) setHasMore(data.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProperties([]);
    setCurrentPage(1);
    setHasMore(true);
    const status = showActiveOnly ? 'Active' : '';
    fetchProperties(1, status);
  }, [showActiveOnly]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProperties(nextPage, showActiveOnly ? 'Active' : '');
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] safe-area-top safe-area-bottom">
      {/* iOS-style Navigation Bar */}
      <div className="sticky top-0 z-10 bg-[#f2f2f7]/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-900">Tax Liens</h1>
          <p className="text-sm text-gray-500 mt-1">
            {properties.length} properties found
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {isDemo && (
          <div className="mb-4 p-3 bg-[#fff3cd] border border-[#ffd60a]/30 rounded-2xl text-[#856404] text-sm">
            Demo data shown - 2026 auction concluded
          </div>
        )}

        {/* iOS-style Filter */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setShowActiveOnly(!showActiveOnly)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              showActiveOnly 
                ? 'bg-[#007aff] text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Active Only
          </button>
          
          <button
            onClick={() => {
              const csv = [
                'Item Num,Tax Year,Parce ID,Face Amount,Status',
                ...properties.map(p => `${p.itemNum},${p.taxYear},${p.parcelId},${p.faceAmount},${p.status}`)
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `properties-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            disabled={properties.length === 0}
            className="px-4 py-2 rounded-full text-sm font-medium bg-[#34c759] text-white disabled:opacity-50"
          >
            Export
          </button>
        </div>

        {loading && properties.length === 0 ? (
          // iOS-style Skeleton
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {properties.map(prop => (
                <Link 
                  key={prop.itemNum} 
                  to={`/property/${prop.parcelId}`}
                  className="block bg-white rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-900">#{prop.itemNum}</div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      prop.status === 'Active' 
                        ? 'bg-[#34c759]/10 text-[#34c759]' 
                        : 'bg-[#ff3b30]/10 text-[#ff3b30]'
                    }`}>
                      {prop.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Parce ID</span>
                      <span className="font-medium text-gray-900">{prop.parcelId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Year</span>
                      <span className="font-medium text-gray-900">{prop.taxYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Face Amount</span>
                      <span className="font-medium text-[#007aff]">{prop.faceAmount}</span>
                    </div>
                  </div>
                  
                  {prop.parcelLink && (
                    <div className="mt-3 text-xs text-[#007aff]">
                      View on GIS Map →
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="py-6 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-[#007aff] text-white rounded-full font-medium disabled:opacity-50 active:scale-95 transition-all"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
                <div className="mt-2 text-sm text-gray-500">Page {currentPage}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
