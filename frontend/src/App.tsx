import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { CreateChallengePage } from './pages/CreateChallengePage';
import { MatchResultsPage } from './pages/MatchResultsPage';
import { PilotDetailsPage } from './pages/PilotDetailsPage';
import { EvidencePassportPage } from './pages/EvidencePassportPage';
import { ScaleProcurementPage } from './pages/ScaleProcurementPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-govbg flex items-center justify-center text-xs font-bold text-navy">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-govbg flex flex-col font-sans">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/challenges" element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
              <Route path="/challenges/new" element={<ProtectedRoute><CreateChallengePage /></ProtectedRoute>} />
              <Route path="/challenges/:id/matches" element={<ProtectedRoute><MatchResultsPage /></ProtectedRoute>} />
              <Route path="/pilots/:id" element={<ProtectedRoute><PilotDetailsPage /></ProtectedRoute>} />
              <Route path="/passport/:pilotId" element={<ProtectedRoute><EvidencePassportPage /></ProtectedRoute>} />
              <Route path="/scale/:pilotId" element={<ProtectedRoute><ScaleProcurementPage /></ProtectedRoute>} />
              <Route path="/audit" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
