import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import AuthForm from "./components/auth/AuthForm";
import DonorDashboard from "./components/donor/DonorDashboard";
import NGODashboard from "./components/ngo/NGODashboard";

const queryClient = new QueryClient();

interface User {
  name: string;
  role: 'Donor' | 'NGO';
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState<'Donor' | 'NGO'>('Donor');

  const handleGetStarted = (role: 'Donor' | 'NGO') => {
    setAuthRole(role);
    setShowAuth(true);
  };

  const handleAuthenticate = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowAuth(false);
  };

  const handleBackToHome = () => {
    setShowAuth(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {showAuth ? (
            <AuthForm
              onBack={handleBackToHome}
              onAuthenticate={handleAuthenticate}
              initialRole={authRole}
            />
          ) : (
            <Layout user={user} onLogout={handleLogout}>
              {user ? (
                user.role === 'Donor' ? (
                  <DonorDashboard user={user} />
                ) : (
                  <NGODashboard user={user} />
                )
              ) : (
                <HomePage onGetStarted={handleGetStarted} />
              )}
            </Layout>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
