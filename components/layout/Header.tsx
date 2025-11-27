import React from 'react';
import { Menu, User } from 'lucide-react';
import { PortfolioItem } from '../../types';

interface HeaderProps {
  toggleSidebar: () => void;
  currentView: 'chat' | 'profile';
  setCurrentView: (view: 'chat' | 'profile') => void;
  userProfile: {
    walletAddress: string | null;
  };
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, currentView, setCurrentView, userProfile }) => {
  return (
    <div className="flex items-center justify-between p-4 md:p-6 sticky top-0 z-10 bg-[#131314]/80 backdrop-blur-md border-b border-white/5 md:border-none">
      <div className="flex items-center gap-3">
         {/* Mobile Toggle Button */}
         <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors md:hidden"
            title="Open Menu"
         >
           <Menu className="w-5 h-5" />
         </button>
         <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-gray-200">Gemini Crypto</span>
            <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded-md border border-blue-800/50 hidden sm:inline-block">2.5 Flash</span>
         </div>
      </div>
      
      {/* User Profile Button */}
      <div 
         className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${currentView === 'profile' ? 'ring-2 ring-blue-500' : ''}`}
         onClick={() => setCurrentView('profile')}
         title="View Profile"
      >
         <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center relative">
            <User className="w-5 h-5 text-white" />
            {userProfile.walletAddress && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#131314]"></div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Header;