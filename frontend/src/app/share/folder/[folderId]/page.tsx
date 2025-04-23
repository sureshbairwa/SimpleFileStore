"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useParams, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FaFolder } from "react-icons/fa";
import Link from "next/link";
import { getFileIcon } from "@/components/Show";
import OpenFile from "@/components/OpenFile";
 

const page = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const folderId = params.folderId as string;
  const token = searchParams.get("token");
  const [ShareFolderId, setShareFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [currFile, setCurrFile] = useState<any>(null);


  console.log(folderId, token);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/share/folder/${folderId}?token=${token}`
        );
        if (response.data.success) {
          toast.success(response.data.message);
          console.log("res data", response.data);
          setFiles(response.data.files);
          setFolders(response.data.subFolders);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFiles();
  }, [folderId, token]);

  useEffect(() => {
    console.log("files", files);
    console.log("folders", folders);
  }, [files, folders]);


  const handleOpenFile2 = (file:any) => {
    setCurrFile(file);
  }

  return (
    <div>
      <div>
        {/* Folders */}
        <div>
          <p>Folders</p>

          {folders.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No Folders Found
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder._id}
                  className="relative p-4  border rounded-lg shadow hover:shadow-md transition"
                >
                  <Link
                    href={`/share/folder/${folder._id}?token=${token}`}
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files */}
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

              </div>
            ))}


{currFile && (
        <OpenFile
          fileId={currFile._id}
          url={previewUrls[currFile._id]}
          mimeType={currFile.mimetype}
          onClose={() => setCurrFile(null)}
        />
      )}
          </div>

         
         
        </div>
      </div>
    </div>
  );
};

export default page;
