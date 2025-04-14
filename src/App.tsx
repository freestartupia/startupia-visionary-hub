
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import StartupIndex from "./pages/StartupIndex";
import StartupDetails from "./pages/StartupDetails";
import RadarIA from "./pages/RadarIA";
import AIEcosystem from "./pages/AIEcosystem";
import CoFounder from "./pages/CoFounder";
import Community from "./pages/Community";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Rankings from "./pages/Rankings";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Tools from "./pages/Tools";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/UserProfile";
import CofounderProfileEdit from "./pages/CofounderProfileEdit";
import CommunityAIChatbot from "./components/chatbot/CommunityAIChatbot";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <TooltipProvider>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <div className="min-h-screen pt-16 w-full">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/startups" element={<StartupIndex />} />
                <Route path="/startup/:id" element={<StartupDetails />} />
                <Route path="/radar" element={<RadarIA />} />
                <Route path="/ecosystem" element={<AIEcosystem />} />
                <Route path="/cofounder" element={<CoFounder />} />
                <Route path="/cofounder/create" element={<CofounderProfileEdit />} />
                <Route path="/cofounder/edit/:id" element={<CofounderProfileEdit />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/post/:postId" element={<Community />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/rankings" element={<Rankings />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/products" element={<Navigate to="/ecosystem" replace />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CommunityAIChatbot />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
