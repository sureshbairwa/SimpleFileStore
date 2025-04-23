import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

interface FilePreviewProps {
  fileId: string;  
  previewUrl: string;
  mimeType: string;
  onClose: () => void;
}

const OpenFile = ({ fileId,previewUrl ,mimeType, onClose }: FilePreviewProps) => {

    const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {

    const fetchFile = async () => {
        console.log('Fetching file with ID:', fileId);
        if(previewUrl){
          setUrl(previewUrl);
          return;
        }
      if (!fileId) return;
      try {
        const response = await axiosInstance.get(`/api/file/${fileId}`);
        if (response.data.success) {
            setUrl(response.data.url);
           
        } else {
        
          toast.error(response.data.message || 'Failed to fetch file');
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            'An error occurred while fetching the file'
        );
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();


  }, [fileId]);

  const renderPreview = () => {

    if (!url) {
      return <p className="text-white">Loading...</p>;
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

    if (mimeType.startsWith('image/')) {
      return <img src={url} className="max-w-full max-h-full object-contain" />;
    }

    if (mimeType === 'application/pdf') {
      return (
        <div className="w-full h-full">
          <iframe
            src={url}
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        </div>
      );
    }

    if (mimeType.startsWith('video/')) {
      return (
        <video
          controls
          src={url}
          className="w-full max-w-4xl max-h-full"
        />
      );
    }

    if (mimeType.startsWith('audio/')) {
      return (
        <div className="w-full text-center">
          <audio controls src={url} className="w-full max-w-xl mx-auto" />
        </div>
      );
    }

    return <p className="text-white">Unsupported file type for preview.</p>;
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 bg-opacity-90 flex flex-col">
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="cursor-pointer text-white text-xl font-bold hover:text-red-500"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 overflow-auto">
        {renderPreview()}
      </div>
    </div>
  );
};

export default OpenFile;
