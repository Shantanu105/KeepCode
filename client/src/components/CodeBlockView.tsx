import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

const CodeBlockView: React.FC<NodeViewProps> = ({ node }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(node.textContent).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <NodeViewWrapper className="relative group code-block-wrapper">
      <button 
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-[#2d2e30] border border-[#5f6368] text-white opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-[#41331c] shadow-sm flex items-center justify-center h-8 w-8"
          title="Copy code"
          type="button"
          contentEditable={false} 
      >
          {copied ? <FaCheck size={12} className="text-green-400" /> : <FaCopy size={12} className="text-gray-300" />}
      </button>
      
      <pre>
        {/* @ts-ignore */}
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlockView;