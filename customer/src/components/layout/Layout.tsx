import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isWelcomePage && <Navigation />}
      <main>
        {children}
      </main>
    </div>
  );
};