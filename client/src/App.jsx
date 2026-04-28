import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Pima County Tax Lien Properties</h1>
            <p className="mt-1 text-sm text-gray-500">Browse available tax lien properties with detailed reports</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<PropertyList />} />
            <Route path="/property/:parcelId" element={<PropertyDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
