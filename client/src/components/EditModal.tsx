import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { all, createLowlight } from 'lowlight';
import { FaImage, FaCode, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { MdPushPin, MdOutlinePushPin } from 'react-icons/md';
import axios from 'axios';

const lowlight = createLowlight(all);

interface EditModalProps {
    note: any;
    onClose: () => void;
    onSave: (id: string, updatedNote: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ note, onClose, onSave }) => {
    const [title, setTitle] = useState(note.title);
    const [isPinned, setIsPinned] = useState(note.isPinned);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            CodeBlockLowlight.configure({ lowlight }),
            Underline,
            Image,
        ],
        content: note.content,
        autofocus: true,
    });

    const handleSave = () => {
         if (!editor) return;
         onSave(note._id, {
             title,
             content: editor.getJSON(),
             isPinned
         });
         onClose();
    };
    
     const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (editor) {
                editor.chain().focus().setImage({ src: res.data.url }).run();
            }
        } catch (error) {
            console.error('Upload failed', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-keep-card w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col border border-keep-border"
                onClick={(e) => e.stopPropagation()}
            >
                 <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                     <div className="flex justify-between items-start mb-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-keep-text text-xl font-semibold placeholder-keep-textSecondary outline-none"
                        />
                        <button 
                            onClick={() => setIsPinned(!isPinned)}
                            className={`p-2 rounded-full hover:bg-keep-hover ${isPinned ? 'text-keep-text' : 'text-keep-textSecondary'}`}
                            title={isPinned ? "Unpin note" : "Pin note"}
                        >
                            {isPinned ? <MdPushPin size={24} /> : <MdOutlinePushPin size={24} />}
                        </button>
                    </div>
                     <EditorContent editor={editor} className="min-h-[200px] text-keep-text text-[0.9375rem] leading-relaxed" />
                 </div>

                 {/* Toolbar */}
                 <div className="bg-keep-card p-2 border-t border-keep-border flex justify-between items-center">
                      <div className="flex items-center gap-1 text-keep-textSecondary">
                         <button 
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('heading', { level: 1 }) ? 'text-keep-text bg-keep-hover' : ''}`}
                            title="H1"
                        >
                            <span className="font-bold text-xs">H1</span>
                        </button>
                         <button 
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('heading', { level: 2 }) ? 'text-keep-text bg-keep-hover' : ''}`}
                            title="H2"
                        >
                            <span className="font-bold text-xs">H2</span>
                        </button>
                        <button 
                            onClick={() => editor?.chain().focus().setParagraph().run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('paragraph') ? 'text-keep-text bg-keep-hover' : ''}`}
                            title="Text"
                        >
                            <span className="font-bold text-xs">Aa</span>
                        </button>
                        
                        <div className="w-px h-4 bg-gray-600 mx-1"></div>

                        <button 
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('bold') ? 'text-keep-text bg-keep-hover' : ''}`}
                        >
                            <FaBold size={14} />
                        </button>
                        <button 
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('italic') ? 'text-keep-text bg-keep-hover' : ''}`}
                        >
                            <FaItalic size={14} />
                        </button>
                         <button 
                            onClick={() => editor?.chain().focus().toggleUnderline().run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('underline') ? 'text-keep-text bg-keep-hover' : ''}`}
                        >
                            <FaUnderline size={14} />
                        </button>
                        <button 
                            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('codeBlock') ? 'text-keep-text bg-keep-hover' : ''}`}
                            title="Code Block"
                        >
                            <FaCode size={16} />
                        </button>

                         <div className="w-px h-4 bg-gray-600 mx-1"></div>
                         
                         <label className="p-2 rounded hover:bg-keep-hover cursor-pointer">
                            <FaImage size={16} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                         </label>
                    </div>

                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 rounded text-keep-text font-medium hover:bg-keep-hover transition-colors"
                    >
                        Close
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default EditModal;
