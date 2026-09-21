import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CalculatorPage from './pages/CalculatorPage';
import DashboardPage from './pages/DashboardPage';
import WalletPage from './pages/WalletPage';
import ShipmentsPage from './pages/ShipmentsPage';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/calcular" element={<CalculatorPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/carteira" element={<WalletPage />} />
            <Route path="/envios" element={<ShipmentsPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
    </div>
  );
}

export default App;
