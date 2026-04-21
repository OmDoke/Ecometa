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
import { WebSocketProvider } from './context/WebSocketContext';
import { Suspense, lazy } from 'react';

const RecyclerMap = lazy(() => import('./components/RecyclerMap'));

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
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const getHomeRedirect = () => {
    if (userRole?.toUpperCase() === 'RECYCLER') return "/recycler-home";
    return "/user-home";
  };

  return (
    <WebSocketProvider>
      <div>
        <CustomNavbar />
        <Suspense fallback={<div className="text-center mt-5 text-white">Loading Ecometa...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to={getHomeRedirect()} /> : <Login />}
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to={getHomeRedirect()} /> : <Register />}
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
              element={<ProtectedRoute element={<RecyclerDetails />} allowedRoles={['RECYCLER']} />}
            />
            <Route
              path="/ewaste/submit"
              element={<ProtectedRoute element={<EwasteForm />} allowedRoles={['USER']} />}
            />
            <Route
              path="/map"
              element={<ProtectedRoute element={<RecyclerMap />} allowedRoles={['USER', 'RECYCLER']} />}
            />
            
            {/* Custom redirect for legacy dashboard route */}
            <Route path="/dashboard" element={<Navigate to={getHomeRedirect()} />} />
            
            {/* Standard catch-all for missing routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </WebSocketProvider>
  );
}

export default App;
