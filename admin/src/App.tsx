import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '../../shared/src/contexts/LocalizationContext';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LensSettingsPage } from './pages/LensSettingsPage';
import { PricingSettingsPage } from './pages/PricingSettingsPage';
import { CoatingSettingsPage } from './pages/CoatingSettingsPage';
import { RuleEnginePage } from './pages/RuleEnginePage';
import { UsageKeywordsPage } from './pages/UsageKeywordsPage';
import { ChangeLogPage } from './pages/ChangeLogPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LocalizationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lens-settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <LensSettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pricing"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PricingSettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coatings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CoatingSettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rules"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <RuleEnginePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usage-keywords"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UsageKeywordsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-log"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ChangeLogPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  );
};

export default App;