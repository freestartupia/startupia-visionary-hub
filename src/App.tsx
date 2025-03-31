
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StartupIndex from "./pages/StartupIndex";
import StartupDetails from "./pages/StartupDetails";
import RadarIA from "./pages/RadarIA";
import AIEcosystem from "./pages/AIEcosystem";
import CoFounder from "./pages/CoFounder";
import Community from "./pages/Community";
import ProductLaunchPage from "./pages/ProductLaunch";
import ProductDetails from "./pages/ProductDetails";
import ProductForm from "./pages/ProductForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
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
          <Route path="/products" element={<ProductLaunchPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/product/new" element={<ProductForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
