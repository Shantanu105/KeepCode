import React from 'react';
import { FaRegLightbulb, FaArchive, FaTrash } from 'react-icons/fa';

interface SidebarProps {
  activeTab: 'notes' | 'archive' | 'trash';
  setActiveTab: (tab: 'notes' | 'archive' | 'trash') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'notes', icon: FaRegLightbulb, label: 'Notes' },
    { id: 'archive', icon: FaArchive, label: 'Archive' },
    { id: 'trash', icon: FaTrash, label: 'Trash' },
  ] as const;

  return (
    <aside className="w-20 md:w-72 h-screen fixed left-0 top-16 pt-2 flex flex-col bg-keep-bg">
      {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center pl-6 py-3 rounded-r-full transition-colors mr-2 mb-1 ${
                isActive
                ? 'bg-[#41331c] text-[#e8eaed]' // Active: Dark yellow tint text
                : 'text-keep-textSecondary hover:bg-keep-hover hover:text-keep-text'
            }`}
            >
            <item.icon className={`text-xl ${isActive ? 'text-[#e8eaed]' : ''}`} />
            <span className={`ml-5 text-sm font-medium hidden md:block tracking-wide ${isActive ? 'font-bold' : ''}`}>
                {item.label}
            </span>
            </button>
          )
      })}
    </aside>
  );
};

export default Sidebar;