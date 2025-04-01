
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import StartupIndex from "./pages/StartupIndex";
import StartupDetails from "./pages/StartupDetails";
import RadarIA from "./pages/RadarIA";
import AIEcosystem from "./pages/AIEcosystem";
import CoFounder from "./pages/CoFounder";
import Community from "./pages/Community";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/startups" element={<StartupIndex />} />
            <Route path="/startup/:id" element={<StartupDetails />} />
            <Route path="/radar" element={<RadarIA />} />
            <Route path="/ecosystem" element={<AIEcosystem />} />
            <Route path="/cofounder" element={<CoFounder />} />
            <Route path="/community" element={<Community />} />
            <Route path="/products" element={<Navigate to="/ecosystem" replace />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
