'use client';

import { useState } from 'react';
import { Eye, Download, Trash2, FileText, Image, File, X } from 'lucide-react';
import Modal from './Modal';

interface Attachment {
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

interface AttachmentViewerProps {
  attachments: Attachment[];
  onDelete?: (index: number) => void;
  canDelete?: boolean;
  title?: string;
}

export default function AttachmentViewer({ 
  attachments, 
  onDelete, 
  canDelete = false,
  title = "Attachments"
}: AttachmentViewerProps) {
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-primary" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handlePreview = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setShowPreview(true);
  };

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-center py-8">
        <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No attachments found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getFileIcon(attachment.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {attachment.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatFileSize(attachment.size)} • {formatDate(attachment.uploaded_at)}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handlePreview(attachment)}
                      className="p-1 text-primary hover:text-primary/90 transition-colors"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="p-1 text-green-600 hover:text-green-700 transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    
                    {canDelete && onDelete && (
                      <button
                        onClick={() => onDelete(index)}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={selectedAttachment?.name || 'File Preview'}
        size="xl"
      >
        <div className="p-6">
          {selectedAttachment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedAttachment.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(selectedAttachment.size)} • {selectedAttachment.type}
                  </p>
                </div>
                
                <button
                  onClick={() => handleDownload(selectedAttachment)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-700 hover:to-fuchsia-700 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {selectedAttachment.type.startsWith('image/') ? (
                  <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <img
                      src={selectedAttachment.url}
                      alt={selectedAttachment.name}
                      className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                      onError={(e) => {
                        console.error('Image failed to load:', selectedAttachment.url);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-center">
                      <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Failed to load image
                      </p>
                      <button
                        onClick={() => handleDownload(selectedAttachment)}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Download to view
                      </button>
                    </div>
                  </div>
                ) : selectedAttachment.type.includes('pdf') ? (
                  <iframe
                    src={selectedAttachment.url}
                    className="w-full h-[60vh] rounded-lg"
                    title={selectedAttachment.name}
                    onError={() => console.error('PDF failed to load:', selectedAttachment.url)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Preview not available for this file type
                      </p>
                      <button
                        onClick={() => handleDownload(selectedAttachment)}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Download to view
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

// File Upload Preview Component
interface FileUploadPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function FileUploadPreview({ files, onRemove }: FileUploadPreviewProps) {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4 text-primary" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 dark:text-gray-400">Selected files:</p>
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            {getFileIcon(file.type)}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            {file.type.startsWith('image/') && (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-12 h-12 object-cover rounded border"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
