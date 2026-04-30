import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PropertyDetail() {
  const { parcelId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [zoning, setZoning] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [detailsRes, zoningRes] = await Promise.all([
          fetch(`/api/property-details.js?parcelId=${parcelId}`),
          fetch(`/api/zoning.js?parcelId=${parcelId}`)
        ]);
        
        if (!detailsRes.ok || !zoningRes.ok) throw new Error('Failed to fetch');
        
        const [details, zoningData] = await Promise.all([
          detailsRes.json(),
          zoningRes.json()
        ]);
        
        setProperty(details);
        setZoning(zoningData.zoning || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [parcelId]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f2f2f7] p-4">
        <div className="bg-red-50 text-red-600 rounded-2xl p-4">
          <p>Error: {error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-full text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007aff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f7] safe-area-top safe-area-bottom">
      {/* iOS-style Navigation Bar */}
      <div className="sticky top-0 z-10 bg-[#f2f2f7]/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="flex items-center px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-[#007aff] font-medium"
          >
            ← Back
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">
            Property Details
          </h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {!property ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
            No property data available
          </div>
        ) : (
          <>
            {/* Property Info Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Parcel {parcelId}</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                <div className="flex justify-between px-4 py-3">
                  <span className="text-gray-600">Mail Name & Address</span>
                  <span className="text-gray-900 font-medium text-right max-w-[60%]">
                    {property.mailNameAddress || 'N/A'}
                  </span>
                </div>
                
                <div className="px-4 py-3">
                  <span className="text-gray-600 text-sm">Legal Description</span>
                  <p className="text-gray-900 mt-1 text-sm">{property.legalDescription || 'N/A'}</p>
                </div>
                
                <div className="flex justify-between px-4 py-3">
                  <span className="text-gray-600">Parcel Area</span>
                  <span className="text-gray-900 font-medium">{property.parcelArea || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between px-4 py-3">
                  <span className="text-gray-600">Coordinates</span>
                  <span className="text-gray-900 font-medium text-sm">{property.centroidCoords || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Zoning Info Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Zoning Information</h2>
              </div>
              
              {zoning && zoning.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {zoning.map((zone, index) => (
                    <div key={index} className="flex justify-between items-center px-4 py-3">
                      <span className="text-gray-800">{zone.type}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        zone.active 
                          ? 'bg-[#34c759]/10 text-[#34c759]' 
                          : 'bg-[#ff3b30]/10 text-[#ff3b30]'
                      }`}>
                        {zone.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-gray-500 text-sm">No zoning information available</div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Information</h3>
              <p className="text-sm text-gray-600">
                Property history, comparable sales (comps), and other details would appear here.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
