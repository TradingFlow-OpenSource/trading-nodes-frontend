
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from '@/hooks/useWeb3';
import { Layout } from '@/components/layout/Layout';
import { Landing } from './pages/Landing';
import { Marketplace } from './pages/Marketplace';
import { NodeDetail } from './pages/NodeDetail';
import { AddNode } from './pages/AddNode';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AuthGuard } from './pages/AuthGuard';
import NotFound from "./pages/NotFound";
import './i18n';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Set default dark theme
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Web3Provider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/node/:id" element={<NodeDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth-required" element={<AuthGuard />} />
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } />
                <Route path="/add" element={
                  <AuthGuard>
                    <AddNode />
                  </AuthGuard>
                } />
                <Route path="/edit/:id" element={
                  <AuthGuard>
                    <AddNode />
                  </AuthGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </Web3Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
