
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SchedulePage from "./pages/SchedulePage";
import MaterialsPage from "./pages/MaterialsPage";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthState = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      console.log("Auth state checked:", !!data.session);
    };
    
    checkAuthState();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, !!session);
      setIsLoggedIn(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    console.log("Login successful, setting isLoggedIn to true");
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    console.log("Logout successful, setting isLoggedIn to false");
    setIsLoggedIn(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />} />
            <Route path="/schedule" element={<SchedulePage isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />} />
            <Route path="/materials" element={<MaterialsPage isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
