import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomNavbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RecyclerDashboard from './components/RecyclerDashboard';
import Register from './components/Register';
import EwasteForm from './components/EwasteForm';
import RecyclerDetails from './components/RecyclerDetails'; // Updated import
import 'bootstrap/dist/css/bootstrap.min.css';

// Protected Route Component with Role-Based Access
const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return element;
};

function App() {
  const isLoggedIn = localStorage.getItem('token'); // Check if token exists

  return (
    <div>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/user-home" /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/user-home" /> : <Register />}
        />
        
        {/* Protected Routes */}
        <Route
          path="/user-home"
          element={<ProtectedRoute element={<Dashboard />} allowedRoles={['USER']} />}
        />
        <Route
          path="/recycler-home"
          element={<ProtectedRoute element={<RecyclerDashboard />} allowedRoles={['RECYCLER']} />}
        />
        <Route
          path="/recycler/profile"
          element={<ProtectedRoute element={<RecyclerDetails />} allowedRoles={['RECYCLER']} />} // Updated
        />
        <Route
          path="/ewaste/submit"
          element={<ProtectedRoute element={<EwasteForm />} allowedRoles={['USER']} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
