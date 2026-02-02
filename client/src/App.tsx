import { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { FaRegLightbulb, FaArchive, FaTrash } from 'react-icons/fa';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import NoteCard from './components/NoteCard';
import EditModal from './components/EditModal';

function App() {
  const [notes, setNotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'notes' | 'archive' | 'trash'>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingNote, setEditingNote] = useState<any>(null);
  
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  // Apply Theme
  useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      let params = {};
      if (activeTab === 'notes') {
          params = { isArchived: false, isTrashed: false };
      } else if (activeTab === 'archive') {
          params = { isArchived: true, isTrashed: false };
      } else if (activeTab === 'trash') {
          params = { isTrashed: true };
      }

      const res = await axios.get('http://localhost:5000/api/notes', { params });
      setNotes(res.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [activeTab]);

  // Create Note
  const handleCreateNote = async (noteData: any) => {
    try {
      await axios.post('http://localhost:5000/api/notes', noteData);
      fetchNotes(); 
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Update Note
  const handleUpdateNote = async (id: string, updates: any) => {
      try {
          await axios.put(`http://localhost:5000/api/notes/${id}`, updates);
          
          setNotes(prev => {
              const updatedNotes = prev.map(n => n._id === id ? { ...n, ...updates } : n);
              return updatedNotes.filter(n => {
                  if (activeTab === 'notes') {
                      return !n.isArchived && !n.isTrashed;
                  }
                  if (activeTab === 'archive') {
                      return n.isArchived && !n.isTrashed;
                  }
                  if (activeTab === 'trash') {
                      return n.isTrashed;
                  }
                  return true;
              });
          });

      } catch (error) {
           console.error('Error updating note:', error);
           fetchNotes(); 
      }
  };
  
  // Delete Permanently
  const handleDeletePermanent = async (id: string) => {
      try {
          await axios.delete(`http://localhost:5000/api/notes/${id}`);
          setNotes(prev => prev.filter(n => n._id !== id));
      } catch (error) {
          console.error('Error deleting note:', error);
      }
  }

  const filteredNotes = notes.filter(note => {
      if (!searchQuery) return true;
      const titleMatch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
      const contentMatch = JSON.stringify(note.content).toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch || contentMatch;
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="min-h-screen bg-keep-bg text-keep-text font-sans transition-colors duration-300">
      <Header 
        onSearch={setSearchQuery} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <div className="pt-20 flex"> 
        {isSidebarOpen && (
             <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-20 md:ml-72' : 'mx-auto max-w-7xl'}`}>
          
          {activeTab === 'notes' && (
             <div className="mb-8">
                 <NoteEditor onSave={handleCreateNote} />
             </div>
          )}

          {activeTab === 'notes' && pinnedNotes.length > 0 && (
             <div className="mb-12">
                <h6 className="text-[0.6875rem] font-bold text-keep-textSecondary uppercase mb-3 ml-2 tracking-widest">Pinned</h6>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto -ml-4"
                    columnClassName="pl-4 bg-clip-padding"
                >
                    {pinnedNotes.map(note => (
                        <NoteCard 
                            key={note._id} 
                            note={note} 
                            onUpdate={handleUpdateNote} 
                            onDelete={handleDeletePermanent}
                            onEdit={setEditingNote}
                        />
                    ))}
                </Masonry>
             </div>
          )}

           {activeTab === 'notes' && pinnedNotes.length > 0 && otherNotes.length > 0 && (
               <h6 className="text-[0.6875rem] font-bold text-keep-textSecondary uppercase mb-3 ml-2 tracking-widest">Others</h6>
           )}
           
           {(activeTab !== 'notes' || otherNotes.length > 0) && (
             <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-4"
                columnClassName="pl-4 bg-clip-padding"
            >
                {(activeTab === 'notes' ? otherNotes : filteredNotes).map(note => (
                    <NoteCard 
                        key={note._id} 
                        note={note} 
                        onUpdate={handleUpdateNote} 
                         onDelete={handleDeletePermanent}
                         onEdit={setEditingNote}
                    />
                ))}
            </Masonry>
           )}

            {filteredNotes.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-32 opacity-80">
                    <div className="text-9xl mb-6 text-keep-textSecondary opacity-20">
                        {activeTab === 'archive' ? <FaArchive /> : activeTab === 'trash' ? <FaTrash /> : <FaRegLightbulb />}
                    </div>
                    <p className="text-2xl text-keep-textSecondary">
                        {activeTab === 'archive' ? 'Your archive is empty' : activeTab === 'trash' ? 'Trash is empty' : 'Notes you add appear here'}
                    </p>
                </div>
            )}

        </main>
      </div>
      
      {editingNote && (
          <EditModal 
            note={editingNote} 
            onClose={() => setEditingNote(null)} 
            onSave={(id, data) => {
                handleUpdateNote(id, data);
                setNotes(prev => prev.map(n => n._id === id ? { ...n, ...data } : n));
            }} 
          />
      )}
    </div>
  );
}

export default App;