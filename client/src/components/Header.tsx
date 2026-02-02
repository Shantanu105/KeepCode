import React from 'react';
import { FaBars, FaSearch, FaRedo, FaMoon, FaSun } from 'react-icons/fa';

interface HeaderProps {
  onSearch: (query: string) => void;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, toggleSidebar, theme, toggleTheme }) => {
  return (
    <header className="h-16 fixed top-0 left-0 right-0 bg-keep-bg border-b border-keep-border flex items-center px-4 z-50 shadow-sm transition-colors duration-300">
      <div className="flex items-center w-72">
        <button onClick={toggleSidebar} className="p-3 rounded-full hover:bg-keep-hover text-keep-textSecondary mr-2 transition-colors">
          <FaBars size={20} />
        </button>
        <div className="flex items-center cursor-pointer">
            {/* Logo */}
            <div className="w-10 h-10 bg-keep-yellow rounded-lg flex items-center justify-center font-bold text-[#202124] mr-2 shadow-sm text-xl">
                K
            </div>
            <span className="text-xl text-keep-text font-medium tracking-tight">KeepCode</span>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto">
        <div className={`rounded-lg flex items-center px-4 py-3 transition-all duration-200 group ${
          theme === 'dark' 
            ? 'bg-[#525355]/40 focus-within:bg-white focus-within:shadow-md' 
            : 'bg-[#f1f3f4] focus-within:bg-white focus-within:shadow-md'
        }`}>
            <button className={`mr-4 transition-colors ${
              theme === 'dark' 
                ? 'text-keep-textSecondary group-focus-within:text-gray-600' 
                : 'text-gray-500 group-focus-within:text-gray-600'
            }`}>
                <FaSearch size={18} />
            </button>
            <input 
                type="text" 
                placeholder="Search" 
                className={`bg-transparent border-none outline-none w-full font-medium text-base placeholder-gray-500 ${
                  theme === 'dark'
                    ? 'text-keep-text focus:text-gray-900'
                    : 'text-gray-700 focus:text-gray-900'
                }`}
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="w-72 flex justify-end items-center pr-2 gap-2">
          {/* Theme Toggle */}
          <button 
             onClick={toggleTheme}
             className="p-3 rounded-full hover:bg-keep-hover text-keep-textSecondary transition-colors"
             title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
              {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          <button 
            className="p-3 rounded-full hover:bg-keep-hover text-keep-textSecondary mr-2 transition-colors" 
            onClick={() => window.location.reload()}
            title="Refresh"
          >
            <FaRedo size={16} />
          </button>
          
          <div className="ml-2 w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-2 ring-keep-bg cursor-pointer hover:ring-gray-500">
             G
          </div>
      </div>
    </header>
  );
};

export default Header;
