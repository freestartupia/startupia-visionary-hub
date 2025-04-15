
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import CoFounder from './pages/CoFounder';
import Community from './pages/Community';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Legal from './pages/Legal';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { SecurityProvider } from './contexts/SecurityContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <SecurityProvider>
            <Toaster />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cofounder" element={<CoFounder />} />
                <Route path="/community" element={<Community />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/legal/:page" element={<Legal />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                
                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SecurityProvider>
        </AuthProvider>
      </HelmetProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default App;
