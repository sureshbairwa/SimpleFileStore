"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import axiosInstance from "@/lib/axios"

import { useState } from "react";
import useFolderStore from "@/store/Folder"



export function CreateFolderDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const {currFolder,fetchFolders} = useFolderStore();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

    try {
      console.log("current folder",currFolder)

      const res = await axiosInstance.post("/api/folder/create", {
        name: folderName,parentFolder_id:currFolder});
      if (res.data.success) {
        toast.success(res.data.message, { duration: 4000 });
        fetchFolders(currFolder);
      } else {
        toast.error(res.data.message, { duration: 4000 });
      }
    } catch (err: any) {
      // console.log("Error in createFolder controller", err);
      toast.error(err.response.data.message, { duration: 4000 });
    }

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
          Create Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a folder</DialogTitle>
          <DialogDescription>
            Name a folder and click create
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input type="text" name="name" onChange={(e) => setFolderName(e.target.value)}  placeholder="folder name"></Input>
          <DialogFooter>
            <Button type="submit" className="w-full mt-2 cursor-pointer">create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
