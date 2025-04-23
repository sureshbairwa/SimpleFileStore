import React, { useState } from 'react';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface ShareFileModalProps {
  shareFileId: string | null;
  setShareFileId: (id: string | null) => void;
}

const ShareFileModal: React.FC<ShareFileModalProps> = ({ shareFileId, setShareFileId }) => {
  const [accessType, setAccessType] = useState<'public' | 'private'>('public');
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleAddEmail = () => {
    if (emailInput && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput]);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleSubmit = async () => {
    if (!shareFileId) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post(`/api/share/file/${shareFileId}`, {
        accessType,
        emails: accessType === 'private' ? emails : [],
      });

      if(res.data.success) {
        toast.success(res.data.message);
        setEmails([]); 
      setEmailInput(''); 
      setShareUrl(res.data.shareUrl);
      }else{
        toast.error(res.data.message);

      }

      
    } catch (err:any) {
      toast.error(err.response.data.message || 'Error sharing file');
      console.error('Error sharing file:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!shareFileId) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="border-2 bg-white dark:bg-black  border-cyan-600  p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl text-center font-semibold mb-4">Share File</h2>
        <p className="mb-2 text-sm  ">File ID: {shareFileId}</p>

        {/* Access Type Selection */}
        <div className="mb-4 ">
          <label className="font-medium mr-4 dark:text-gray-300">Access Type:</label>
          <select
            className="border-2 cursor-pointer  px-2 py-1   rounded bg-green-600 dark:bg-green-700"
            value={accessType}
            onChange={(e) => {
              setAccessType(e.target.value as 'public' | 'private') ;
              setEmails([]); // 
              setEmailInput(''); 
              setShareUrl(null); 
            }}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Email Input */}
        {accessType === 'private' && (
          <div className="mb-4">
            <label className="block font-medium mb-1 dark:text-gray-300">Allowed Emails</label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email"
                className="border-2 px-2 py-1 rounded w-full border-gray-500"
              />
              <button
                onClick={handleAddEmail}
                className="bg-blue-500 cursor-pointer   px-3 py-1 rounded "
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {emails.map((email) => (
                <div
                  key={email}
                  className="border-2 border-gray-500 text-sm px-2 py-1 rounded flex items-center"
                >
                  {email}
                  <button
                    className="ml-2 cursor-pointer text-md text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveEmail(email)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}

        {shareUrl && (
          <div className="mt-4 p-3 border-2 border-gray-600 overflow-hidden  rounded">
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {shareUrl}
            </a>
          </div>
        )}
        <div className="flex justify-between items-center mt-6">

          {
            !shareUrl && (

              <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600  px-4 cursor-pointer py-2 rounded hover:bg-green-700"
          >
            {loading ? 'Sharing...' : 'Generate Share Link'}
          </button>
              
            )
          }

          { 

            shareUrl && (

              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('Copied to clipboard');
                }}
                className="bg-green-600 text-white px-4 cursor-pointer py-2 rounded hover:bg-green-700"
              >
                Copy Link
              </button>

            )

          }


          
          <button
            onClick={() => {
              setShareFileId(null);
              setEmails([]);
              setShareUrl(null);
              setAccessType('public');
            }}
            className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>

        {/* Share URL */}
        
      </div>
    </div>
  );
};

export default ShareFileModal;
