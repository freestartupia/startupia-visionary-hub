
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/navbar/Navbar";
import Index from "./pages/Index";
import StartupDetails from "./pages/StartupDetails";
import StartupView from "./pages/StartupView";
import Startup from "./pages/Startup";
import RadarIA from "./pages/RadarIA";
import CoFounder from "./pages/CoFounder";
import Community from "./pages/Community";
import Blog from "./pages/Blog";
import BlogPostEdit from "./pages/BlogPostEdit";
import BlogPostView from "./pages/BlogPostView";
import Tools from "./pages/Tools";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/UserProfile";
import CofounderProfileEdit from "./pages/CofounderProfileEdit";
import CommunityAIChatbot from "./components/chatbot/CommunityAIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <TooltipProvider>
            <ScrollToTop />
            <Navbar /> {/* Navbar is now outside the routes */}
            <Toaster />
            <Sonner />
            <div className="min-h-screen pt-16 w-full">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/startup" element={<Startup />} />
                <Route path="/startup/:id" element={<StartupView />} />
                <Route path="/radar" element={<RadarIA />} />
                <Route path="/ecosystem" element={<NotFound />} />
                <Route path="/startups" element={<Navigate to="/startup" replace />} />
                <Route path="/cofounder" element={<CoFounder />} />
                <Route path="/cofounder/create" element={<CofounderProfileEdit />} />
                <Route path="/cofounder/edit/:id" element={<CofounderProfileEdit />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/post/:postId" element={<Community />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/post/:slug" element={<BlogPostView />} />
                <Route path="/blog/new" element={<ProtectedRoute><BlogPostEdit /></ProtectedRoute>} />
                <Route path="/blog/edit/:slug" element={<ProtectedRoute><BlogPostEdit /></ProtectedRoute>} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/rankings" element={<Navigate to="/tools" replace />} />
                <Route path="/products" element={<NotFound />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<UserProfile />} />
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
