"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
  
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axiosInstance from "@/lib/axios"

import { useState } from "react";
import useFolderStore from "@/store/Folder"




export function UploadFileDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);


  const {currFolder,fetchFolders}=useFolderStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFiles(Array.from(files));
    }
    // console.log(files);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });


   try {

    const res = await axiosInstance.post(`/api/file/upload?folderId=${currFolder}`,  formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    if(res.data.success){
      toast.success(res.data.message, { duration: 4000 });
      fetchFolders(currFolder);
    }else{
      toast.error(res.data.message, { duration: 4000 });
    }
    
   } catch (err:any) {

    // console.log("Error in uploadFile controller", err);
    toast.error(err.response.data.message, { duration: 4000 });
    
   }



    // console.log("upload file");

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer text-blue-500"
          onClick={() => setIsOpen(true)}
        >
          Upload file
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a file and click upload
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input type="file" placeholder="file" required onChange={handleFileChange} multiple  />
          <DialogFooter>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
