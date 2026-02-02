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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Responsive sidebar toggle
  const [editingNote, setEditingNote] = useState<any>(null);

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      // Fetch all notes first, then filter in frontend for simplicity in switching tabs instantly
      // Or fetch by status. Let's fetch all active for "notes", and specific for others to keep it clean.
      // Actually the backend endpoint I wrote filters by query params.
      
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
      fetchNotes(); // Refresh
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Update Note
  const handleUpdateNote = async (id: string, updates: any) => {
      try {
          await axios.put(`http://localhost:5000/api/notes/${id}`, updates);
          
          // Optimistic update
          setNotes(prev => prev.map(n => n._id === id ? { ...n, ...updates } : n).filter(() => {
              // If we are in "Notes" tab and we archived/trashed it, remove it from view
              if (activeTab === 'notes' && (updates.isArchived === true || updates.isTrashed === true)) return false;
               if (activeTab === 'archive' && (updates.isArchived === false || updates.isTrashed === true)) return false;
               if (activeTab === 'trash' && (updates.isTrashed === false)) return false;
              return true;
          }));
          
          // If we are moving things around, maybe just refetch to be safe if logic gets complex
          if(updates.isPinned !== undefined) fetchNotes(); 

      } catch (error) {
           console.error('Error updating note:', error);
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

  // Search Filter
  const filteredNotes = notes.filter(note => {
      if (!searchQuery) return true;
      const titleMatch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
      // Simple content search by stringifying the rich text JSON
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
    <div className="min-h-screen bg-keep-bg text-keep-text font-sans">
      <Header 
        onSearch={setSearchQuery} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="pt-16 flex">
        {isSidebarOpen && (
             <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'mx-auto max-w-7xl'}`}>
          
          {/* Editor only visible in 'Notes' tab */}
          {activeTab === 'notes' && (
             <div className="mb-8">
                 <NoteEditor onSave={handleCreateNote} />
             </div>
          )}

          {/* Pinned Section */}
          {activeTab === 'notes' && pinnedNotes.length > 0 && (
             <div className="mb-8">
                <h6 className="text-xs font-bold text-keep-textSecondary uppercase mb-2 ml-2 tracking-wider">Pinned</h6>
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

           {/* Others Section */}
           {activeTab === 'notes' && pinnedNotes.length > 0 && otherNotes.length > 0 && (
               <h6 className="text-xs font-bold text-keep-textSecondary uppercase mb-2 ml-2 tracking-wider">Others</h6>
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
                <div className="flex flex-col items-center justify-center mt-20 opacity-50">
                    <div className="text-6xl mb-4 text-keep-textSecondary">
                        {activeTab === 'archive' ? <FaArchive /> : activeTab === 'trash' ? <FaTrash /> : <FaRegLightbulb />}
                    </div>
                    <p className="text-xl">
                        {activeTab === 'archive' ? 'Your archive is empty' : activeTab === 'trash' ? 'Trash is empty' : 'No notes yet'}
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
                // Also update local state for immediate feedback
                setNotes(prev => prev.map(n => n._id === id ? { ...n, ...data } : n));
            }} 
          />
      )}
    </div>
  );
}

export default App;