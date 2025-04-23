import { create } from "zustand";
import axiosInstance from "@/lib/axios";

type FolderStore = {
  currFolder: string | null;
  setCurrFolder: (folder: string | null) => void;
  RootFolder: string | null;
  setRootFolder: (folder: string | null) => void;
  folders: any[];
  setFolders: (folders: any[]) => void;
  files: any[];
  totalFiles: number;
  hasMoreFiles: boolean;
  isLoadingFiles: boolean;
  filePage: number;
  pageSize: number;
  setFiles: (files: any[]) => void;
  fetchFolders: (folderId: string) => Promise<void>;
  loadMoreFiles: (folderId: string) => Promise<void>;
  handleFolderDownload: (folderId: string, folderName: string) => Promise<void>;
};

const useFolderStore = create<FolderStore>((set, get) => ({
  currFolder: null,
  setCurrFolder: (folder) => set({ currFolder: folder }),
  RootFolder: null,
  setRootFolder: (folder) => set({ RootFolder: folder }),
  folders: [],
  setFolders: (folders) => set({ folders }),
  files: [],
  totalFiles: 0,
  hasMoreFiles: true,
  isLoadingFiles: false,
  filePage: 0,
  pageSize: 20,
  setFiles: (files) => set({ files }),
  fetchFolders: async (folderId: string) => {
    try {
        const response = await axiosInstance.get(`/api/folder/${folderId}`);
        set({ folders: response.data?.folder?.subFolders || [] });
        set({ files: response.data?.folder?.files || [] });
        
    } catch (error) {
        console.error(error);
    }
},
  loadMoreFiles: async (folderId) => {
    const { filePage, pageSize, files, hasMoreFiles, isLoadingFiles } = get();
    if (!hasMoreFiles || isLoadingFiles) return;

    set({ isLoadingFiles: true });

    try {
      const skip = filePage * pageSize;
      const response = await axiosInstance.get(`/api/folder/${folderId}?skip=${skip}&limit=${pageSize}`);
      const newFiles = response.data?.folder?.files || [];

      set({
        files: [...files, ...newFiles],
        filePage: filePage + 1,
        hasMoreFiles: newFiles.length >= pageSize,
        isLoadingFiles: false,
      });
    } catch (error) {
      console.error("Failed to load more files:", error);
      set({ isLoadingFiles: false });
    }
  },
  handleFolderDownload: async (folderId, folderName) => {
    try {
      if (!folderId) {
        console.error("Folder ID is required");
        return;
      }

      const response = await axiosInstance.get(`/api/folder/download/${folderId}`, {
        responseType: "blob",
      });

      const disposition = response.headers["content-disposition"];
      let filename = `${folderName}.zip`;
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading folder zip:", error);
      alert("Failed to download folder.");
    }
  },
}));

export default useFolderStore;