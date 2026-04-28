import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PropertyDetail() {
  const { parcelId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [zoning, setZoning] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    try {
      // Fetch property details
      const detailsResponse = await fetch(`/api/property-details.js?parcelId=${parcelId}`);
      if (!detailsResponse.ok) throw new Error('Failed to fetch property details');
      const detailsData = await detailsResponse.json();

      // Fetch zoning information
      const zoningResponse = await fetch(`/api/zoning.js?parcelId=${parcelId}`);
      if (!zoningResponse.ok) throw new Error('Failed to fetch zoning info');
      const zoningData = await zoningResponse.json();

      setProperty(detailsData);
      setZoning(zoningData.zoning || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [parcelId]);

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        <p>Error: {error}</p>
        <button onClick={() => navigate(-1)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go Back
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Property Details</h1>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Back to List
          </button>
        </div>

        {!property ? (
          <p>No property data available.</p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-600">Mail Name and Address</p>
                    <p className="text-gray-800">{property.mailNameAddress || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Legal Description</p>
                    <p className="text-gray-800">{property.legalDescription || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Parcel Area</p>
                    <p className="text-gray-800">{property.parcelArea || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Centroid Coordinates</p>
                    <p className="text-gray-800">{property.centroidCoords || 'Not available'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Zoning Information</h2>
                {zoning && zoning.length > 0 ? (
                  <div className="space-y-3">
                    {zoning.map((zone, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg shadow">
                        <p className="font-medium text-gray-700">{zone.type}</p>
                        <p className={`text-sm px-2 py-0.5 rounded-full ${
                          zone.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {zone.active ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No zoning information available.</p>
                )}
              </div>
            </div>

            {/* Placeholder for additional sections like history, comps, etc. */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
              <p className="text-gray-600">
                This section would include property history, comparable sales (comps), and other relevant details.
                For now, we are focusing on the core property and zoning data.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
