import React from 'react';
import { FaBars, FaSearch, FaRedo } from 'react-icons/fa';

interface HeaderProps {
  onSearch: (query: string) => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, toggleSidebar }) => {
  return (
    <header className="h-16 fixed top-0 left-0 right-0 bg-keep-bg border-b border-[#5f6368] flex items-center px-4 z-50">
      <div className="flex items-center w-64">
        <button onClick={toggleSidebar} className="p-3 rounded-full hover:bg-keep-hover text-keep-textSecondary mr-2">
          <FaBars />
        </button>
        <div className="flex items-center">
            {/* Simple Logo Placeholder */}
            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center font-bold text-keep-bg mr-2">
                K
            </div>
            <span className="text-xl text-keep-text font-medium">KeepCode</span>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto">
        <div className="bg-[#525355] rounded-lg flex items-center px-4 py-2 focus-within:bg-white focus-within:text-black transition-colors group">
            <button className="text-keep-textSecondary group-focus-within:text-black mr-4">
                <FaSearch />
            </button>
            <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none w-full text-keep-text placeholder-keep-textSecondary group-focus-within:text-black"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="w-64 flex justify-end items-center">
          <button className="p-3 rounded-full hover:bg-keep-hover text-keep-textSecondary" onClick={() => window.location.reload()}>
            <FaRedo />
          </button>
          <div className="ml-4 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
             G
          </div>
      </div>
    </header>
  );
};

export default Header;
