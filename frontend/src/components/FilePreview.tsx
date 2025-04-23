import { useState, useEffect } from 'react';

interface FilePreviewProps {
  url: string;
  mimeType: string;
}

const FilePreview = ({ url, mimeType }: FilePreviewProps) => {
  if (mimeType.startsWith('image/')) {
    return <img src={url} style={{ maxWidth: '100%', maxHeight: '80vh' }} />;
  }

  if (mimeType === 'application/pdf') {
    return (
      <iframe
        src={url}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    );
  }

  if (mimeType.startsWith('video/')) {
    return <video controls src={url} style={{ maxWidth: '100%' }} />;
  }

  if (mimeType.startsWith('audio/')) {
    return <audio controls src={url} />;
  }

  if (mimeType.startsWith('text/') || mimeType === 'application/json') {
    return (
      <div className="w-full h-full overflow-auto">
        <iframe
          src={url}
          className="w-full h-full"
          style={{ border: 'none' }}
        />
      </div>
    );
  }

 

  return <p>Unsupported file type for preview.</p>;
};


export default FilePreview;