import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './App.css';
import AIEcosystem from './pages/AIEcosystem';
import StartupDetails from './pages/StartupDetails';
import { AuthProvider } from './contexts/AuthContext';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AIEcosystem />} />
            <Route path="/ecosystem" element={<AIEcosystem />} />
            <Route path="/startup/:id" element={<StartupDetails />} />
            {/* Autres routes... */}
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
