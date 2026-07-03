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
import StationOverview from "./pages/station/StationOverview";
import StationSteps from "./pages/station/StationSteps";
import StationCards from "./pages/station/StationCards";
import StationQuiz from "./pages/station/StationQuiz";
import StationCompare from "./pages/station/StationCompare";
import PracticalOverview from "./pages/practical/PracticalOverview";
import PracticalSteps from "./pages/practical/PracticalSteps";
import PracticalCards from "./pages/practical/PracticalCards";
import PracticalQuiz from "./pages/practical/PracticalQuiz";
import PracticalCompare from "./pages/practical/PracticalCompare";
import Quiz from "./pages/Quiz";
import QuestionBank from "./pages/QuestionBank";
import InfectionControl from "./pages/modules/InfectionControl";
import AcuteManagement from "./pages/modules/AcuteManagement";
import AcuteCondition from "./pages/modules/AcuteCondition";
import FundamentalsOfNursing from "./pages/modules/FundamentalsOfNursing";
import ISBARCommunication from "./pages/modules/ISBARCommunication";
import ImportData from "./pages/admin/ImportData";
import ExamResults from "./pages/exam/ExamResults";
import ExamScoreBreakdown from "./pages/exam/ExamScoreBreakdown";
import ExamAllQuestions from "./pages/exam/ExamAllQuestions";
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
            <Route path="/dashboard" element={<RootGate />}>
              <Route index element={<Home />} />
              <Route path="progress" element={<Progress />} />
              <Route path="schedule" element={<Schedule />} />
            </Route>

            <Route path="/station/:topicId/overview" element={<ProtectedRoute><StationOverview /></ProtectedRoute>} />
            <Route path="/station/:topicId/steps" element={<ProtectedRoute><StationSteps /></ProtectedRoute>} />
            <Route path="/station/:topicId/cards" element={<ProtectedRoute><StationCards /></ProtectedRoute>} />
            <Route path="/station/:topicId/quiz" element={<ProtectedRoute><StationQuiz /></ProtectedRoute>} />
            <Route path="/station/:topicId/compare" element={<ProtectedRoute><StationCompare /></ProtectedRoute>} />
            <Route path="/station/:topicId" element={<ProtectedRoute><StationOverview /></ProtectedRoute>} />
            <Route path="/question-bank" element={<ProtectedRoute><QuestionBank /></ProtectedRoute>} />
            <Route path="/quiz/mock" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/quiz/:topicId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />

            <Route path="/screens/infection-control" element={<ProtectedRoute><InfectionControl /></ProtectedRoute>} />
            <Route path="/screens/acuteManagement" element={<ProtectedRoute><AcuteManagement /></ProtectedRoute>} />
            <Route path="/screens/acuteManagement/:conditionId" element={<ProtectedRoute><AcuteCondition /></ProtectedRoute>} />
            <Route path="/screens/practical/:topicId/overview" element={<ProtectedRoute><PracticalOverview /></ProtectedRoute>} />
            <Route path="/screens/practical/:topicId/steps" element={<ProtectedRoute><PracticalSteps /></ProtectedRoute>} />
            <Route path="/screens/practical/:topicId/cards" element={<ProtectedRoute><PracticalCards /></ProtectedRoute>} />
            <Route path="/screens/practical/:topicId/quiz" element={<ProtectedRoute><PracticalQuiz /></ProtectedRoute>} />
            <Route path="/screens/practical/:topicId/compare" element={<ProtectedRoute><PracticalCompare /></ProtectedRoute>} />
            <Route path="/screens/practical/:topicId" element={<ProtectedRoute><PracticalOverview /></ProtectedRoute>} />
            <Route path="/screens/fon" element={<ProtectedRoute><FundamentalsOfNursing /></ProtectedRoute>} />
            <Route path="/screens/isbar" element={<ProtectedRoute><ISBARCommunication /></ProtectedRoute>} />

            <Route path="/admin/import" element={<ProtectedRoute><ImportData /></ProtectedRoute>} />

            <Route path="/exam-results" element={<ProtectedRoute><ExamResults /></ProtectedRoute>} />
            <Route path="/exam-results/breakdown" element={<ProtectedRoute><ExamScoreBreakdown /></ProtectedRoute>} />
            <Route path="/exam-results/questions" element={<ProtectedRoute><ExamAllQuestions /></ProtectedRoute>} />

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
