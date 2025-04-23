import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';


const useFileStore = create((set) => ({
  files: [],
  setFiles: (files: any) => set({ files }),
  

   handleFileRename: (file: any) => {
    const newName = prompt("Enter new File name", file.name);
  
    if (newName) {
      console.log("Renaming file to:", newName);
      axiosInstance
        .put(`/api/file/rename/${file._id}`, { name: newName })
        .then((response) => {
          
          if(response.data.success) {
            toast.success(response.data.message, { duration: 4000 });
              set((state:any) => ({
                  files: state.files.map((f: any) => (f._id === file._id ? { ...f, name: newName } : f)),
                }));
          }
          else {
            toast.error(response.data.message, { duration: 4000 });
          }
         
        //   fetchFolders(folderId); // make sure folderId is in scope
        })
        .catch((error) => {
          // console.error(error);
          toast.error("Error renaming file", { duration: 4000 });
        });
    } else {
      console.log("Prompt cancelled or empty input");
    }
  },

   handleFileDelete : (file: any) => {
    if (window.confirm(`Are you sure you want to delete the file ${file.name}?`)) {
      axiosInstance
        .delete(`/api/file/${file._id}`)
        .then((response) => {
          toast.success(response.data.message, { duration: 4000 });
            set((state:any) => ({
                files: state.files.filter((f: any) => f._id !== file._id),
            }));
        //   fetchFolders(folderId); // make sure folderId is in scope
        })

        .catch((error) => {
          // console.error(error);
          toast.error("Error deleting file", { duration: 4000 });
        });
    }
  },


   handleDownloadFile : (fileId: string) => {

    try {

      axiosInstance.get(`/api/file/download/${fileId}`)
      .then((res)=>{
        toast.success(res.data.message,{duration:4000})
        console.log(res.data)
        window.open(res.data.url)
      }).catch((err)=>{
        toast.error(err.res.data.message)
      })
      
    } catch (error) {
      // console.error("Error downloading file:", error);
      toast.error("Error deleting file",{duration:4000})
      
    }
  },
   handleOpenFile : async(fileId:string)=>{

    try {

      axiosInstance.get(`/api/file/${fileId}`)
      .then((res)=>{
        // toast.success(res.data.message,{duration:4000})
        
        window.open(res.data.url)
      }).catch((err)=>{
        toast.error(err.res.data.message)
      })
      
    } catch (error) {
      console.log("Error in opening file",error)
    }

  }


}));

export default useFileStore