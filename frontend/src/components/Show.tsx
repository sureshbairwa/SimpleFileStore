"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileVideo,
  FileAudio,
  FileText,
  FileSpreadsheet,
  FileCode2,
  File,
} from "lucide-react";
import { FaShareAlt, FaTrash, FaEdit } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import useFileStore from "@/store/File";
import { PiFilePptFill } from "react-icons/pi";

import { FaRegFilePdf } from "react-icons/fa6";
import { SiGoogledocs } from "react-icons/si";
import { FaFileArchive } from "react-icons/fa";
import ShareFileModal from "./ShareFileModal";
import OpenFile from "./OpenFile";



export const getFileIcon = (ext) => {
  switch (ext.toLowerCase()) {
    case ".pdf":
      return <FaRegFilePdf size={100} className="text-red-500" />;
    case ".doc":
    case ".docx":
      return <SiGoogledocs size={100} className="text-blue-600" />;
    case ".xls":
    case ".xlsx":
      return <FileSpreadsheet size={100} className="text-green-600" />;
    case ".ppt":
    case ".pptx":
      return <PiFilePptFill size={100} className="text-orange-500" />;
    case ".zip":
    case ".rar":
    case ".7z":
      return <FaFileArchive size={100} className="text-yellow-500" />;
    case ".mp3":
    case ".wav":
      return <FileAudio size={100} className="text-purple-500" />;
    case ".mp4":
    case ".mov":
    case ".avi":
      return <FileVideo size={100} className="text-slate-500" />;
    case ".txt":
      return <FileText size={100} className="text-gray-500" />;
    case ".js":
    case ".ts":
    case ".jsx":
    case ".py":
    case ".java":
    case ".html":
    case ".css":
      return <FileCode2 size={100} className="text-emerald-500" />;
    default:
      return <File size={100} className="text-slate-400" />;
  }
};

const Show = () => {
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  
  const [shareFileId, setShareFileId] = useState<string | null>(null);
  const [currFile, setCurrFile] = useState<any>(null);
   

  const handleShare = (fileId: string) => {
    setShareFileId(fileId); // Open the modal for the selected file
  };


  const {
    files,
    handleDownloadFile,
    handleFileDelete,
    handleFileRename,
    handleOpenFile,
  } = useFileStore();

  useEffect(() => {
    files.forEach((file: any) => {
      if (file.mimetype?.startsWith("image/") && !previewUrls[file._id]) {
        axiosInstance
          .get(`/api/file/${file._id}`)
          .then((res) => {
            if (res.data.success) {
              setPreviewUrls((prev) => ({
                ...prev,
                [file._id]: res.data.url,
              }));
            }
          })
          .catch((err) => {
            console.error("Error fetching preview:", err);
          });
      }
    });
  }, [files]);


  const handleOpenFile2 = (file:any) => {
    setCurrFile(file);
  }

  if (files.length === 0) {
    return <div className="p-4 text-gray-500">No files found</div>;
  }

  

  return (
    <div>
      <div className="text-lg px-4 py-2 text-gray-500 mt-5 ">Files</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 pb-8 font-semibold ">
        {files.map((file) => (
          <div
            key={file._id}
            className="relative  border-2  border-gray-500 rounded-lg shadow-sm  hover:shadow-md transition flex flex-col items-center justify-between p-3"
          >
            <div
              // onClick={() => handleOpenFile(file._id)}
              onClick={() => handleOpenFile2(file)}
              
              className="w-full cursor-pointer flex flex-col items-center"
            >
              <div className="w-full h-32 flex items-center justify-center overflow-hidden rounded-md  mb-2">
                {file.mimetype?.startsWith("image/") &&
                previewUrls[file._id] ? (
                  <img
                    src={previewUrls[file._id]}
                    alt={file.name.slice(0, 10)}
                    className="object-contain max-h-full"
                  />
                ) : (
                  getFileIcon(file.extension)
                )}
              </div>

              <div className="w-3/4 text-center truncate text-sm hover:text-blue-500">
                {file.name}
              </div>
            </div>

            <div className="absolute top-0 right-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:border-gray-500  border-2 rounded-full cursor-pointer">
                    <FiMoreVertical size={20} className="" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 shadow-md border rounded-md "
                >
                  <DropdownMenuItem
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-600"
                    onClick={() => handleFileRename(file)}
                  >
                    <FaEdit size={14} /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-600"
                    onClick={() => handleShare(file._id)}
                  >
                    <FaShareAlt size={14} /> Share 
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-600"
                    onClick={() => handleDownloadFile(file._id)}
                  >
                    <FaShareAlt size={14} /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 p-2  cursor-pointer  hover:font-bold transition-all duration-300"
                    onClick={() => handleFileDelete(file)}
                  >
                    <FaTrash size={14} className="text-red-500" />{" "}
                    <span className="text-red-500">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
           
          </div>
        ))}
      </div>

      {shareFileId && (
  <ShareFileModal shareFileId={shareFileId} setShareFileId={setShareFileId} />
)}

      {currFile && (
        <OpenFile
          fileId={currFile._id}
          url={previewUrls[currFile._id]}
          mimeType={currFile.mimetype}
          onClose={() => setCurrFile(null)}
        />
      )}
      
      
    </div>
  );
};

export default Show;