
import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute';
import { GameProvider } from '@/contexts/GameContext.jsx';
import Footer from '@/components/Footer.jsx';
import PreloadResources from '@/components/PreloadResources.jsx';

// Lazy load components for better performance
const GameScreen = React.lazy(() => import('@/components/GameScreen.jsx'));
const HomeScreen = React.lazy(() => import('@/screens/HomeScreen.jsx'));
const AuthScreen = React.lazy(() => import('@/screens/AuthScreen'));
const LobbyScreen = React.lazy(() => import('@/screens/LobbyScreen'));
const ManageTeamScreen = React.lazy(() => import('@/screens/ManageTeamScreen'));
const AccountScreen = React.lazy(() => import('@/screens/AccountScreen.jsx'));
const PrivacyPolicy = React.lazy(() => import('@/pages/PrivacyPolicy.jsx'));
const TermsOfService = React.lazy(() => import('@/pages/TermsOfService.jsx'));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-white">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      <div>Carregando...</div>
    </div>
  </div>
);

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PreloadResources />
      <Helmet>
        <title>Gateball Timer - Gerenciador de Partidas</title>
        <meta name="description" content="Aplicativo profissional para gerenciamento de partidas de Gateball com cronômetro inteligente e sistema de pontuação." />
      </Helmet>
      <Router>
        <GameProvider>
          <Suspense fallback={<LoadingSpinner />}>
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </GameProvider>
        <Footer />
      </Router>
    </>
  );
}

export default App;
