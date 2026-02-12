import React, { ReactNode } from 'react';

interface LayoutProps {
  header: ReactNode;
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, leftPanel, centerPanel, rightPanel }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden p-4 gap-4">
      {/* Header Area */}
      <header className="h-16 shrink-0 glass-panel rounded-2xl flex items-center px-6 z-20 shadow-sm transition-all hover:shadow-md">
        {header}
      </header>
      
      {/* Main Content Grid */}
      <main className="flex-1 flex gap-4 overflow-hidden min-h-0">
        {/* Left: Input (Source) - Bento Card */}
        <div className="w-full md:w-[28%] min-w-[300px] h-full hidden md:flex flex-col glass-panel rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 z-10">
          {leftPanel}
        </div>
        
        {/* Center: Report (Workspace) - Bento Card */}
        <div className="flex-1 h-full glass-panel rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative z-10 flex flex-col">
          {centerPanel}
        </div>

        {/* Right: Chat (Copilot) - Bento Card */}
        <div className="w-full md:w-[26%] min-w-[300px] h-full border-0 hidden lg:flex flex-col glass-panel rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 z-10">
          {rightPanel}
        </div>
      </main>
    </div>
  );
};