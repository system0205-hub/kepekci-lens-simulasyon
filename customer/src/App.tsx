import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '../../shared/src/contexts/LocalizationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { WelcomePage } from './pages/WelcomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ResultsPage } from './pages/ResultsPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LocalizationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </Layout>
        </Router>
      </LocalizationProvider>
    </ErrorBoundary>
  );
};

export default App;