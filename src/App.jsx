
import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import GameScreen from '@/components/GameScreen.jsx';
import HomeScreen from '@/screens/HomeScreen.jsx';
import AuthScreen from '@/screens/AuthScreen';
import LobbyScreen from '@/screens/LobbyScreen';
import ManageTeamScreen from '@/screens/ManageTeamScreen';
import AccountScreen from '@/screens/AccountScreen.jsx';
import PrivacyPolicy from '@/pages/PrivacyPolicy.jsx';
import TermsOfService from '@/pages/TermsOfService.jsx';
import ProtectedRoute from '@/components/ProtectedRoute';
import { GameProvider } from '@/contexts/GameContext.jsx';
import Footer from '@/components/Footer.jsx';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gateball Timer - Gerenciador de Partidas</title>
        <meta name="description" content="Aplicativo profissional para gerenciamento de partidas de Gateball com cronômetro inteligente e sistema de pontuação." />
      </Helmet>
      <Router>
        <GameProvider>
          <Routes>
            <Route path="/auth" element={!session ? <AuthScreen /> : <Navigate to="/lobby" />} />
            <Route
              path="/game/:gameId"
              element={
                <ProtectedRoute>
                  <GameScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/:teamId"
              element={
                <ProtectedRoute>
                  <ManageTeamScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountScreen />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route
              path="/lobby"
              element={
                <ProtectedRoute>
                  <LobbyScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={session ? <Navigate to="/lobby" /> : <HomeScreen />} 
            />
            <Route path="*" element={<Navigate to={session ? "/lobby" : "/auth"} />} />
          </Routes>
        </GameProvider>
        <Footer />
      </Router>
    </>
  );
}

export default App;
