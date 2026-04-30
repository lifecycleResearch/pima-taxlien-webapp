import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PropertyList />} />
        <Route path="/property/:parcelId" element={<PropertyDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
