'use client';

import { useState, useEffect } from 'react';
import { Code, Type } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter your content...",
  height = "300px"
}: RichTextEditorProps) {
  const [isRichMode, setIsRichMode] = useState(false);
  const [ReactQuill, setReactQuill] = useState<any>(null);

  useEffect(() => {
    // Dynamically import ReactQuill to avoid SSR issues
    import('react-quill-new').then((mod) => {
      setReactQuill(() => mod.default);
    });
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image'
  ];

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRichMode(false)}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${
              !isRichMode 
                ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Code className="h-3 w-3" />
            HTML
          </button>
          <button
            type="button"
            onClick={() => setIsRichMode(true)}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${
              isRichMode 
                ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Type className="h-3 w-3" />
            Rich Editor
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        {isRichMode && ReactQuill ? (
          <div className="rich-text-editor">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              modules={modules}
              formats={formats}
              style={{ height }}
            />
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border-0 focus:ring-0 focus:outline-none dark:bg-gray-700 dark:text-white resize-none"
            style={{ height, minHeight: height }}
          />
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {isRichMode 
          ? 'Use the rich text editor to format your content with bold, italic, lists, and more.'
          : 'Write HTML directly or switch to Rich Editor for visual formatting.'
        }
      </p>

      {/* Custom Styles for Quill */}
      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 12px;
        }

        .dark .rich-text-editor .ql-toolbar {
          background: #374151;
          border-bottom-color: #4b5563;
        }

        .rich-text-editor .ql-container {
          border: none;
          font-family: inherit;
        }

        .rich-text-editor .ql-editor {
          padding: 16px;
          min-height: ${height};
          font-size: 14px;
          line-height: 1.5;
          background: white;
        }

        .dark .rich-text-editor .ql-editor {
          background: #374151;
          color: #f9fafb;
        }

        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #6b7280;
        }

        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #6b7280;
        }

        .dark .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #d1d5db;
        }

        .dark .rich-text-editor .ql-toolbar .ql-fill {
          fill: #d1d5db;
        }

        .rich-text-editor .ql-toolbar button:hover .ql-stroke {
          stroke: #8b5cf6;
        }

        .rich-text-editor .ql-toolbar button:hover .ql-fill {
          fill: #8b5cf6;
        }

        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #8b5cf6;
        }

        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #8b5cf6;
        }

        .rich-text-editor .ql-toolbar button.ql-active {
          background: #f3f4f6;
        }

        .dark .rich-text-editor .ql-toolbar button.ql-active {
          background: #4b5563;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }

        .dark .rich-text-editor .ql-editor.ql-blank::before {
          color: #6b7280;
        }

        /* Ensure toolbar buttons are visible */
        .rich-text-editor .ql-toolbar button {
          padding: 5px;
          margin: 2px;
          border-radius: 4px;
        }

        .rich-text-editor .ql-toolbar .ql-picker {
          color: #6b7280;
        }

        .dark .rich-text-editor .ql-toolbar .ql-picker {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
