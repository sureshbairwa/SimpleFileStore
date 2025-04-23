"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { FaFileAlt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";
import FilePreview from "@/components/FilePreview";

const ShareFilePage = () => {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const params = useParams();
  const searchParams = useSearchParams();

  const router = useRouter();

  const fileId = params.fileId as string;
  const token = searchParams.get("token");

  useEffect(() => {
    const fetchFile = async () => {
      if (!fileId || !token) {
        toast.error("File ID or token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/api/share/file/${fileId}?token=${token}`
        );
        if (response.data.success) {
          setFile(response.data.file);
        } else {
          toast.error(response.data.message || "Failed to fetch file");
        }
      } catch (error: any) {
        console.error("Error fetching file:", error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while fetching the file"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileId, token]);

  const getSmartFilename = (fullName:string, maxLength = 20) => {
    if (fullName.length <= maxLength) return fullName;
  
    const lastDotIndex = fullName.lastIndexOf('.');
    if (lastDotIndex === -1) return fullName; // no extension found
  
    const namePart = fullName.slice(0, lastDotIndex);
    const extension = fullName.slice(lastDotIndex); // includes the dot
  
    const visibleChars = maxLength - extension.length - 3; // 3 for "..."
    const startChars = Math.ceil(visibleChars / 2);
    const endChars = Math.floor(visibleChars / 2);
  
    return `${namePart.slice(0, startChars)}...${namePart.slice(-endChars)}${extension}`;
  };


  const formatFileSize = (bytes:number) => {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const formattedSize = bytes / Math.pow(1024, i);
    return `${formattedSize.toFixed(1)} ${sizes[i]}`;
  };
  
  
  


  const handleDownload = async () => {
    if (file?.url) {
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
  
        const blobUrl = window.URL.createObjectURL(blob);
  
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file.name || 'downloaded_file'; 
        document.body.appendChild(link);
        link.click();
  
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };
  
  

  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl mb-2" />
        <p>Loading file...</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <FaFileAlt className="text-5xl mb-2" />
        <p>Unable to load file</p>
      </div>
    );
  }

  return (


      <div
        
        className=" h-screen w-full   rounded-lg shadow-md p-2  hover:shadow-lg transition duration-300 "
      >

        <div className=" flex border-2 rounded-lg border-gray-500 px-2  items-center justify-between  py-2">
        <p className="max-w-[50%] overflow-hidden text-ellipsis whitespace-nowrap">
  {getSmartFilename(file.name)}
</p>
          <p className="max-w-1/4 overflow-hidden text-ellipsis whitespace-nowrap">{file.mimetype}</p>
          
          <p>{formatFileSize(file.size)}</p>
          <button onClick={handleDownload} className=" cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Download</button>

        </div>
        

        {
          file.url && (
            FilePreview({
              url: file.url,
              mimeType: file.mimetype,
            })
          )
        }

      </div>


      
     

      
      
      
    
  );
};

export default ShareFilePage;
