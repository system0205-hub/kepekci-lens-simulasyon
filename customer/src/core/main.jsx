import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import WelcomePage from './components/pages/WelcomePage';
import CalculatorPage from './components/pages/CalculatorPage';
import ResultsPage from './components/pages/ResultsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [formData, setFormData] = useState(null);

  const handleWelcomeNext = () => {
    setCurrentPage('calculator');
  };

  const handleCalculatorNext = (data) => {
    setFormData(data);
    setCurrentPage('results');
  };

  const handleCalculatorBack = () => {
    setCurrentPage('welcome');
  };

  const handleResultsBack = () => {
    setCurrentPage('calculator');
  };

  const handleResultsStartOver = () => {
    setFormData(null);
    setCurrentPage('welcome');
  };

  return (
    <div className="App">
      {currentPage === 'welcome' && (
        <WelcomePage onNext={handleWelcomeNext} />
      )}
      {currentPage === 'calculator' && (
        <CalculatorPage
          onBack={handleCalculatorBack}
          onNext={handleCalculatorNext}
        />
      )}
      {currentPage === 'results' && formData && (
        <ResultsPage
          formData={formData}
          onBack={handleResultsBack}
          onStartOver={handleResultsStartOver}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
