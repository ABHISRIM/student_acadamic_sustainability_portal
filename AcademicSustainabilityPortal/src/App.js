import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Issues from './pages/Issues';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" />;
};

function AppContent() {
  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  return (
    <>
      {isLoggedIn && <nav className="navbar">
        <div className="navbar-brand">Academic Sustainability Portal</div>
        <div className="navbar-actions">
          <a href="/profile" className="nav-link">Profile</a>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Issues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/reports" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
