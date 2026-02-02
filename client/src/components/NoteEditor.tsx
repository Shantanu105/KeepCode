import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { all, createLowlight } from 'lowlight';
import { FaImage, FaCode, FaBold, FaItalic, FaUnderline, FaThumbtack } from 'react-icons/fa';
import axios from 'axios';

// Initialize lowlight with all languages
const lowlight = createLowlight(all);

interface NoteEditorProps {
    onSave: (note: any) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ onSave }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    
    // Tiptap Editor Setup
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Disable default codeBlock to use Lowlight
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Underline,
            Image,
            Placeholder.configure({
                placeholder: 'Take a note...',
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: '',
        onFocus: () => setIsExpanded(true),
    });

    const handleSave = () => {
        if (!editor) return;
        const content = editor.getJSON();
        // Only save if title or content is not empty
        const hasContent = !editor.isEmpty || title.trim() !== '';
        
        if (hasContent) {
            onSave({
                title,
                content,
                isPinned,
                images: [], // Images are embedded in content for now or handled separately
            });
        }
        
        // Reset
        setTitle('');
        editor.commands.clearContent();
        setIsPinned(false);
        setIsExpanded(false);
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

    if (!isExpanded) {
        return (
            <div className="max-w-2xl mx-auto my-8">
                <div 
                    onClick={() => setIsExpanded(true)}
                    className="bg-keep-card shadow-md rounded-lg p-3 text-keep-textSecondary font-medium cursor-text border border-keep-border"
                >
                    Take a note...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto my-8 relative">
             <div className="bg-keep-card shadow-lg rounded-lg border border-keep-border p-4">
                {/* Title & Pin */}
                <div className="flex justify-between items-start mb-2">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent text-keep-text text-lg font-bold placeholder-keep-textSecondary outline-none"
                    />
                    <button 
                        onClick={() => setIsPinned(!isPinned)}
                        className={`p-2 rounded-full hover:bg-keep-hover ${isPinned ? 'text-keep-text' : 'text-keep-textSecondary'}`}
                    >
                        <FaThumbtack />
                    </button>
                </div>

                {/* Editor Content */}
                <EditorContent editor={editor} className="min-h-[100px] text-keep-text text-sm" />

                {/* Toolbar */}
                <div className="flex justify-between items-center mt-4 pt-2">
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
                            <FaBold size={12} />
                        </button>
                        <button 
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('italic') ? 'text-keep-text bg-keep-hover' : ''}`}
                        >
                            <FaItalic size={12} />
                        </button>
                         <button 
                            onClick={() => editor?.chain().focus().toggleUnderline().run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('underline') ? 'text-keep-text bg-keep-hover' : ''}`}
                        >
                            <FaUnderline size={12} />
                        </button>
                        <button 
                            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                            className={`p-2 rounded hover:bg-keep-hover ${editor?.isActive('codeBlock') ? 'text-keep-text bg-keep-hover' : ''}`}
                            title="Code Block"
                        >
                            <FaCode size={14} /> {/* The </> Logo */}
                        </button>

                         <div className="w-px h-4 bg-gray-600 mx-1"></div>
                         
                         <label className="p-2 rounded hover:bg-keep-hover cursor-pointer">
                            <FaImage size={14} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                         </label>
                    </div>

                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 rounded text-keep-text font-medium hover:bg-keep-hover"
                    >
                        Close
                    </button>
                </div>
             </div>
        </div>
    );
};

export default NoteEditor;
