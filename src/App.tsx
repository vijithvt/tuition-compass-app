
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import SinglePageLayout from "./pages/SinglePageLayout";
import { supabase } from "@/integrations/supabase/client";

// Create the query client outside the component
const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SinglePageLayout 
          isLoggedIn={isLoggedIn} 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
