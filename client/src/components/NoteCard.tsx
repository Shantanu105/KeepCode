import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { all, createLowlight } from 'lowlight';
import { FaTrash, FaArchive, FaTrashRestore } from 'react-icons/fa';
import { MdPushPin, MdOutlinePushPin } from 'react-icons/md';

const lowlight = createLowlight(all);

interface NoteCardProps {
    note: any;
    onUpdate: (id: string, updates: any) => void;
    onDelete: (id: string) => void;
    onEdit: (note: any) => void;
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
        editable: false, 
        editorProps: {
             attributes: {
                class: 'max-h-[300px] overflow-hidden mask-linear-gradient', 
             }
        }
    });
    
    useEffect(() => {
        if (editor && note.content) {
            editor.commands.setContent(note.content);
        }
    }, [note.content, editor]);


    return (
        <div className="note-card group relative mb-4 break-inside-avoid overflow-hidden flex flex-col">
            <div 
                className="p-4 cursor-default" 
                onClick={() => onEdit(note)} 
            >
                {note.title && (
                    <div className="text-keep-text font-medium text-lg mb-3 flex justify-between leading-snug">
                        <span className="font-semibold tracking-tight">{note.title}</span>
                    </div>
                )}
                
                <EditorContent editor={editor} className="text-keep-text text-[0.9375rem] leading-relaxed pointer-events-none" />
            </div>

            {/* Hover Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center px-2 pb-2 mt-auto">
                <div className="flex gap-1">
                     {!note.isTrashed && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isArchived: !note.isArchived }); }}
                            className="p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary hover:text-keep-text transition-colors"
                            title={note.isArchived ? "Unarchive" : "Archive"}
                        >
                            <FaArchive size={16} />
                        </button>
                    )}
                    
                    {note.isTrashed ? (
                         <button 
                            onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isTrashed: false }); }}
                            className="p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary hover:text-keep-text transition-colors"
                            title="Restore"
                        >
                            <FaTrashRestore size={16} />
                        </button>
                    ) : (
                         <button 
                            onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isTrashed: true }); }}
                            className="p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary hover:text-keep-text transition-colors"
                            title="Delete"
                        >
                            <FaTrash size={16} />
                        </button>
                    )}

                    {note.isTrashed && (
                        <button 
                             onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
                             className="p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary hover:text-red-500 transition-colors"
                             title="Delete Permanently"
                        >
                            <FaTrash size={16} />
                        </button>
                    )}
                </div>
            </div>

             {/* Pin Button Logic */}
             {note.isPinned && !note.isTrashed && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isPinned: false }); }}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-keep-hover text-keep-text transition-colors"
                    title="Unpin note"
                >
                     <MdPushPin size={22} />
                </button>
            )}

            {!note.isPinned && !note.isTrashed && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onUpdate(note._id, { isPinned: true }); }}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-keep-hover text-keep-textSecondary opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Pin note"
                >
                    <MdOutlinePushPin size={22} />
                </button>
            )}
        </div>
    );
};

export default NoteCard;
