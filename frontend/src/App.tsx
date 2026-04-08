import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateItem from './pages/CreateItem';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-item" element={<CreateItem />} />
              <Route path="/profile" element={
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <h1>Profile Page</h1>
                  <p>Settings and personal info coming soon.</p>
                </Box>
              } />
            </Route>

            {/* Item Scan Route (Public) */}
            <Route path="/scan/:itemId" element={
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <h1>Item Scan Proof of Concept</h1>
                <p>Retrieving item details...</p>
              </Box>
            } />

            {/* Redirects */}
            <Route path="/create" element={<Navigate to="/create-item" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
