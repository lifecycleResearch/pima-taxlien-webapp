import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
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
      
      if (data.isDemo !== undefined) {
        setIsDemo(data.isDemo);
      }
      
      if (propertiesList.length === 0) {
        setHasMore(false);
      } else if (page === 1) {
        setProperties(propertiesList);
      } else {
        setProperties(prev => [...prev, ...propertiesList]);
      }
      
      if (data.hasMore !== undefined) {
        setHasMore(data.hasMore);
      }
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
    setStatusFilter(status);
    fetchProperties(1, status);
  }, [showActiveOnly]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProperties(nextPage, statusFilter);
    }
  };

  const exportCSV = () => {
    const headers = ['Item Num', 'Tax Year', 'Cert Year', 'Parcel ID', 'Face Amount', 'Status'];
    const rows = properties.map(p => [
      p.itemNum,
      p.taxYear,
      p.certYear,
      p.parcelId,
      p.faceAmount,
      p.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-lien-properties-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {isDemo && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
          Showing demo data - The 2026 tax lien auction has concluded. Check back in 2027 for the next auction.
        </div>
      )}
      
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Available Tax Lien Properties</h2>
          <p className="text-sm text-gray-500">
            Showing {properties.length} properties
          </p>
        </div>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Active Only</span>
          </label>
          <button
            onClick={exportCSV}
            disabled={properties.length === 0}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {loading && !properties.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(prop => (
              <div key={prop.itemNum} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <Link to={`/property/${prop.parcelId}`} className="block p-4">
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Parcel ID:</span>
                    <span className="ml-2 text-gray-600">{prop.parcelId}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Face Amount:</span>
                    <span className="ml-2 text-gray-600">{prop.faceAmount}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded ${
                      prop.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {prop.status}
                    </span>
                  </div>
                  {prop.parcelLink && (
                    <div className="mt-2 text-sm text-blue-600 hover:underline">
                      View on GIS Map
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center py-6 flex justify-center gap-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading more...' : 'Load More Properties'}
              </button>
              <div className="px-4 py-2 text-gray-500">
                Page {currentPage}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}