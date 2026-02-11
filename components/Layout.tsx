import React, { ReactNode } from 'react';

interface LayoutProps {
  header: ReactNode;
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, leftPanel, centerPanel, rightPanel }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 shrink-0 border-b border-slate-200 bg-white z-10 relative shadow-sm">
        {header}
      </header>
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Input - Hidden on mobile if needed, or stacked. For now responsive logic handled by Tailwind classes */}
        <div className="w-full md:w-1/4 min-w-[300px] h-full hidden md:block z-0">
          {leftPanel}
        </div>
        
        {/* Center: Report - Main Content */}
        <div className="flex-1 h-full bg-slate-50/50 relative overflow-hidden">
          {centerPanel}
        </div>

        {/* Right: Chat - Collapsible on smaller screens ideally, but standard 3-col for desktop */}
        <div className="w-full md:w-1/4 min-w-[320px] h-full border-l border-slate-200 hidden lg:block bg-white z-0">
          {rightPanel}
        </div>
      </main>
    </div>
  );
};