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
    <aside className="w-20 md:w-64 h-screen fixed left-0 top-16 pt-4 flex flex-col bg-keep-bg">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center pl-6 py-3 w-full rounded-r-full transition-colors ${
            activeTab === item.id
              ? 'bg-[#41331c] text-[#e8eaed]' // Active state color (yellowish tint like Keep's dark mode)
              : 'text-keep-textSecondary hover:bg-keep-hover'
          }`}
        >
          <item.icon className="text-xl" />
          <span className="ml-4 font-medium hidden md:block">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
