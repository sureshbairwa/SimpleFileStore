"use client";

import React, { use } from "react";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useFolderStore from "@/store/Folder";
import Link from "next/link";
import { UploadFileDialog } from "@/components/UploadFile";
import { CreateFolderDialog } from "@/components/CreateFolder";
import useAuthStore from "@/store/Auth";
import Show from "@/components/Show";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaFolder, FaEdit, FaShareAlt, FaTrash, FaDownload } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import useFileStore from "@/store/File";
import GotoLogin from "@/components/GotoLogin";
const Folder = () => {
  const [folderId, setFolderId] = useState<string | null>(null);
  console.log(folderId);

  // const [folders, setFolders] = useState([]);
  // const [files, setFiles] = useState([]);

  const { setCurrFolder, folders, files, fetchFolders, handleFolderDownload } =
    useFolderStore();
  const { authCheck, user, isLoggedIn } = useAuthStore();
  const { setFiles } = useFileStore();

  useEffect(() => {
    const init = async () => {
      await authCheck();
      fetchFolders(folderId);
    };

    init();
  }, []);

  useEffect(() => {
    if (!user) return;
    setFolderId(user?.rootFolder);
    console.log("user", user);
  }, [user]);

  useEffect(() => {
    setCurrFolder(folderId);
  }, [folderId]);

  useEffect(() => {
    fetchFolders(folderId);
  }, [folderId]);

  useEffect(() => {
    // console.log("files check",files)
    // console.log("folders check",folders)
    setFiles(files);
  }, [files]);

  const handleFolderRename = (folder: any) => {
    const newName = prompt("Enter new folder name", folder.name);

    if (newName) {
      // console.log("Renaming folder to:", newName);
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
      // console.log("Prompt cancelled or empty input");
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

  if (!isLoggedIn) return <GotoLogin />;

  return (
    <div className="min-h-screen ">
      {/* Sticky Header */}
      <div className="ml-5  h-18 sticky top-14 z-50  backdrop-blur-md shadow-sm">
        <div className="flex justify-end items-center gap-2 p-4 ">
          <CreateFolderDialog />
          <UploadFileDialog />
        </div>
      </div>

      {/* Folders Section */}
      <section className="px-4 ">
        <h1 className="text-lg px-4 py-2 text-gray-500">Folders</h1>

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
                      <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer">
                        <FaShareAlt size={16} /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 p-2 cursor-pointer"
                        onClick={() =>
                          handleFolderDownload(folder._id, folder.name)
                        }
                      >
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

      {/* Files Section */}
      <section className="px-4 mt-10">
        {/* <h1 className="text-2xl font-semibold mb-4">Files</h1> */}
        <Show />
      </section>
    </div>
  );
};

export default Folder;
