"use client";

import React, { use } from "react";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import useFolderStore from "@/store/Folder";
import Link from "next/link";
import { UploadFileDialog } from "@/components/UploadFile";
import { CreateFolderDialog } from "@/components/CreateFolder";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FaFolder,
  FaEdit,
  FaShareAlt,
  FaTrash,
  FaFile,
  FaDownload,
} from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { RenameFolderDialog } from "@/components/RenameFolder";

import useFileStore from "@/store/File";
import Show from "@/components/Show";
import ShareFolderModal from "@/components/ShareFolderModal";


const Folder = () => {
  const { folderId } = useParams();
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({}); // key: fileId, value: signedUrl
  const [shareFolderId, setShareFolderId] = useState<string | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);

  console.log(folderId);

  // const [folders, setFolders] = useState([]);
  // const [files, setFiles] = useState([]);

  const handleFolderShare = (folderId: string, folderName: string) => {
    setShareFolderId(folderId);
    setFolderName(folderName);
  };

  const { setCurrFolder, folders, files, fetchFolders,handleFolderDownload } = useFolderStore();
  const { setFiles } = useFileStore();




  useEffect(() => {
    setCurrFolder(folderId);
  }, [folderId]);

  useEffect(() => {
    fetchFolders(folderId);
  }, [folderId]);

  useEffect(() => {
    files.forEach((file: any) => {
      if (file.mimetype?.startsWith("image/") && !previewUrls[file._id]) {
        axiosInstance
          .get(`/api/file/${file._id}`)
          .then((res) => {
            // toast.success(res.data.message, { duration: 4000 });
            setPreviewUrls((prev) => ({ ...prev, [file._id]: res.data.url }));
          })
          .catch((err) => {
            console.error("Error fetching preview:", err);
          });
      }
    });
  }, [files]);

  useEffect(() => {
    setFiles(files);
  }, [files]);

  const handleFolderRename = (folder: any) => {
    const newName = prompt("Enter new folder name", folder.name);

    if (newName) {
      console.log("Renaming folder to:", newName);
      axiosInstance
        .put(`/api/folder/rename/${folder._id}`, { name: newName })
        .then((response) => {
          toast.success(response.data.message, { duration: 4000 });
          fetchFolders(folderId);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error renaming folder", { duration: 4000 });
        });
    } else {
      // console.log("folder rename abort");
    }
  };

  const handleFolderDelete = (folder: any) => {
    if (
      window.confirm(
        `Are you sure you want to delete the folder ${folder.name}?`
      )
    ) {
      axiosInstance
        .delete(`/api/folder/${folder._id}`)
        .then((response) => {
          toast.success(response.data.message, { duration: 4000 });
          fetchFolders(folderId);
        })

        .catch((error) => {
          // console.error(error);
          toast.error("Error deleting folder", { duration: 4000 });
        });
    }
  };


   
  return (
    <div>
      <div className=" sticky top-15 z-50 ">
        <div className="absolute inset-0  bg-opacity-70 backdrop-blur-md"></div>

        <div className="relative flex space-x-2 items-center justify-end p-2">
          <div>
            <CreateFolderDialog />
          </div>
          <div>
            <UploadFileDialog />
          </div>
        </div>
      </div>

      <section className="px-4 mt-6">
        <h1 className="text-lg  py-2 text-gray-500">Folders</h1>

        {folders.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No Folders Found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {folders.map((folder) => (
              <div
                key={folder._id}
                className="relative p-4  border rounded-lg shadow hover:shadow-md transition"
              >
                <Link
                  href={`/folder/${folder._id}`}
                  className="flex flex-col items-center text-center  "
                >
                  <FaFolder
                    className="text-slate-500 mb-2 hover:text-slate-400"
                    size={80}
                  />
                  <span className="text-base w-3/4   font-medium truncate hover:underline hover:text-blue-600 transition">
                    {folder.name}
                  </span>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-1 right-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 cursor-pointer border-2 hover:border-gray-500 rounded-full">
                        <FiMoreVertical size={20} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 border rounded shadow-lg"
                    >
                      <DropdownMenuItem
                        className="flex items-center gap-2 p-2 cursor-pointer"
                        onClick={() => handleFolderRename(folder)}
                      >
                        <FaEdit size={16} /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer"
                      onClick={() => handleFolderShare(folder._id,folder.name)}>
                      
                        <FaShareAlt size={16} /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer"
                      onClick={() => handleFolderDownload(folder._id,folder.name)}>
                      
                        <FaDownload size={16} /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 p-2 cursor-pointer text-red-600"
                        onClick={() => handleFolderDelete(folder)}
                      >
                        <FaTrash size={16} /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* <div className='text-lg  p-2 text-gray-500'>Files</div> */}

      {
        shareFolderId && (
          <ShareFolderModal
            ShareFolderId={shareFolderId}
            setShareFolderId={setShareFolderId}
            folderName={folderName}
          />
        )
      }

      <Show />
    </div>
  );
};

export default Folder;
