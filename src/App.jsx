

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Footer ইমপোর্ট

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import CrushConfessions from './pages/CrushConfessions';
import TrollFun from './pages/TrollFun';
import CampusSriti from './pages/CampusSriti';
import LostFound from './pages/LostFound';
import AdminDashboard from './pages/AdminDashboard';
import ModeratorDashboard from './pages/ModeratorDashboard';

// ✅ নতুন পেজ ইমপোর্ট
import Rules from './pages/Rules'; 
import Developer from './pages/Developer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <div className="min-h-screen"> {/* কন্টেন্ট এরিয়া */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-post" element={<CreatePost />} />
          
          {/* Categories */}
          <Route path="/crush" element={<CrushConfessions />} />
          <Route path="/troll" element={<TrollFun />} />
          <Route path="/campus-sriti" element={<CampusSriti />} />
          <Route path="/lost-found" element={<LostFound />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/moderator-dashboard" element={<ModeratorDashboard />} />

          {/* ✅ নতুন রাউটস */}
          <Route path="/rules" element={<Rules />} />
          <Route path="/developer" element={<Developer />} />
        </Routes>
      </div>

      <Footer /> {/* ✅ ফুটার সব পেজের নিচে থাকবে */}
    </BrowserRouter>
  );
}

export default App;