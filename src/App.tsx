import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Schedule from "./pages/Schedule";
import StationOverview from "./pages/StationOverview";
import Quiz from "./pages/Quiz";
import InfectionControl from "./pages/modules/InfectionControl";
import AcuteManagement from "./pages/modules/AcuteManagement";
import AcuteCondition from "./pages/modules/AcuteCondition";
import ModulePlaceholder from "./pages/modules/ModulePlaceholder";
import ImportData from "./pages/admin/ImportData";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RootGate = () => {
  const { user, loading } = useAuthStore();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return <Splash />;
  return <DashboardLayout />;
};

const App = () => {
  const init = useAuthStore((s) => s.init);
  useEffect(() => init(), [init]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/" element={<RootGate />}>
              <Route index element={<Home />} />
              <Route path="progress" element={<Progress />} />
              <Route path="schedule" element={<Schedule />} />
            </Route>

            <Route path="/station/:topicId" element={<ProtectedRoute><StationOverview /></ProtectedRoute>} />
            <Route path="/quiz/mock" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/quiz/:topicId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />

            <Route path="/screens/infection-control" element={<ProtectedRoute><InfectionControl /></ProtectedRoute>} />
            <Route path="/screens/acuteManagement" element={<ProtectedRoute><AcuteManagement /></ProtectedRoute>} />
            <Route path="/screens/acuteManagement/:conditionId" element={<ProtectedRoute><AcuteCondition /></ProtectedRoute>} />
            <Route path="/screens/practical/:topicId" element={<ProtectedRoute><ModulePlaceholder /></ProtectedRoute>} />
            <Route path="/screens/fon" element={<ProtectedRoute><ModulePlaceholder /></ProtectedRoute>} />
            <Route path="/screens/isbar" element={<ProtectedRoute><ModulePlaceholder /></ProtectedRoute>} />

            <Route path="/admin/import" element={<ProtectedRoute><ImportData /></ProtectedRoute>} />

            {/* Supabase PKCE OAuth internal route — let the client handle it */}
            <Route path="/~oauth/*" element={<div className="min-h-screen grid place-items-center"><div className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" /></div>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
