import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { all, createLowlight } from 'lowlight';
import { FaThumbtack, FaTrash, FaArchive, FaTrashRestore } from 'react-icons/fa';

const lowlight = createLowlight(all);

interface NoteCardProps {
    note: any;
    onUpdate: (id: string, updates: any) => void;
    onDelete: (id: string) => void;
    onEdit: (note: any) => void; // Function to open modal for editing
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onUpdate, onDelete, onEdit }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            CodeBlockLowlight.configure({ lowlight }),
            Underline,
            Image,
        ],
        content: note.content,
        editable: false, // Read-only
        editorProps: {
             attributes: {
                class: 'max-h-[300px] overflow-hidden mask-linear-gradient', // Clamp height for preview
             }
        }
    });
    
    // Update content if note changes (e.g. after edit)
    useEffect(() => {
        if (editor && note.content) {
            editor.commands.setContent(note.content);
        }
    }, [note.content, editor]);


    return (
        <div className="group relative bg-keep-card border border-keep-border rounded-lg hover:shadow-md transition-shadow mb-4 break-inside-avoid overflow-hidden flex flex-col">
            <div 
                className="p-4 cursor-default" 
                onClick={() => onEdit(note)} // Click card to edit
            >
                {note.title && (
                    <div className="text-keep-text font-bold text-lg mb-2 flex justify-between">
                        <span>{note.title}</span>
                         {note.isPinned && <FaThumbtack className="text-keep-text text-sm" />}
                    </div>
                )}
                
                <EditorContent editor={editor} className="text-keep-text text-sm pointer-events-none" />
            </div>

            {/* Hover Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center px-2 pb-2 mt-auto">
                <div className="flex gap-2">
                     {!note.isTrashed && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isArchived: !note.isArchived }); }}
                            className="p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary"
                            title={note.isArchived ? "Unarchive" : "Archive"}
                        >
                            <FaArchive size={14} />
                        </button>
                    )}
                    
                    {note.isTrashed ? (
                         <button 
                            onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isTrashed: false }); }}
                            className="p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary"
                            title="Restore"
                        >
                            <FaTrashRestore size={14} />
                        </button>
                    ) : (
                         <button 
                            onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isTrashed: true }); }}
                            className="p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary"
                            title="Delete"
                        >
                            <FaTrash size={14} />
                        </button>
                    )}

                    {note.isTrashed && (
                        <button 
                             onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
                             className="p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary hover:text-red-500"
                             title="Delete Permanently"
                        >
                            <FaTrash size={14} />
                        </button>
                    )}
                </div>
            </div>
             {/* Pin Button (Hover only for unpinned, always visible if pinned handled in title but let's add hover action too) */}
            {!note.isPinned && !note.isTrashed && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isPinned: true }); }}
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary opacity-0 group-hover:opacity-100 transition-opacity bg-keep-card"
                >
                    <FaThumbtack />
                </button>
            )}
             {note.isPinned && !note.isTrashed && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isPinned: false }); }}
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-keep-hover text-keep-text bg-keep-card"
                >
                     <FaThumbtack />
                </button>
            )}
        </div>
    );
};

export default NoteCard;
