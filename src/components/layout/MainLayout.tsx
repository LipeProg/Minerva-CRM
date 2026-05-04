import React from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:ml-64 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
