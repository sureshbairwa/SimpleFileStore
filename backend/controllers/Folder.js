import { Folder } from "../models/Folder.js";
import mongoose from "mongoose";

const checkDuplicate = (name, subFolders) => {
    let duplicateCount = 0;
    let newName = name;

    while (subFolders.some(folder => folder.name === newName)) {
        duplicateCount++;
        newName = `${name}(${duplicateCount})`;
    }

    return newName;
};

export const createFolder = async (req, res) => {
    try {
        let {name, parentFolder_id} = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Folder name is required" });
        }
        if (!parentFolder_id) {
            return res.status(400).json({ success: false, message: "Parent folder ID is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(parentFolder_id)) {
            return res.status(400).json({ success: false, message: "Invalid parent folder ID" });
        }

        // console.log("parentFolder_id",parentFolder_id);
        const parentFolder=await Folder.findById(parentFolder_id).populate("subFolders");

        if (!parentFolder) {
            return res.status(404).json({ success: false, message: "Parent folder not found" });
        }

        // console.log("parentFolder",parentFolder);
        


        name = checkDuplicate(name, parentFolder.subFolders);


        const folder = await Folder.create({ name, owner: req.user._id, parentFolder:parentFolder_id });

        if(folder){
            parentFolder.subFolders.push(folder._id);
            await parentFolder.save();
        }


        

        res.status(200).json({ success: true, message: "Folder created successfully" ,folder:folder});
    } catch (error) {
        console.log("Error in createFolder controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getFolder = async (req, res) => {
    try {
        const folderId = req.params.folderId;
        if (!folderId) {
            return res.status(400).json({ success: false, message: "Folder ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ success: false, message: "Invalid folder ID" });
        }
        
        console.log("foder id",folderId);
        const folder = await Folder.findById(folderId).populate("subFolders").populate("files");

        if (!folder) {
            return res.status(404).json({ success: false, message: "Folder not found" });
        }

        if(folder.owner.toString() !== req.user._id.toString()){
            return res.status(404).json({ success: false, message: "Folder not found" });
        }


        res.status(200).json({ success: true, folder, message: "Folder fetched successfully" });
    } catch (error) {
        console.log("Error in getFolder controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getRootFolder = async (req, res) => {
    try {
        const rootFolder = await Folder.findById(req.user.rootFolder)
            .populate("subFolders").populate("files");
        if (!rootFolder) {
            return res.status(404).json({ success: false, message: "Root folder not found" });
        }

        // console.log("rootFolder",rootFolder);
        
        res.status(200).json({ success: true, data:rootFolder, message: "Root folder fetched successfully" });
    } catch (error) {
        console.log("Error in getRootFolder controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const deleteFolder = async (req, res) => {
    try {
        const folderId = req.params.folderId;

        if (!folderId) {
            return res.status(400).json({ success: false, message: "Folder ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ success: false, message: "Invalid folder ID" });
        }

        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ success: false, message: "Folder not found" });
        }
        if(folder.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if(folder.parentFolder){
            const parentFolder = await Folder.findById(folder.parentFolder);
            const index = parentFolder.subFolders.indexOf(folderId);
            if (index !== -1) {
                parentFolder.subFolders.splice(index, 1);
                await parentFolder.save();
                let deletedFolder = await Folder.deleteOne({ _id: folderId });
                res.status(200).json({ success: true, message: "Folder deleted successfully" });

        }else{
            res.status(200).json({ success: true, message: "Folder not found" });
        }

        }else{
            res.status(200).json({ success: true, message: "Root Folder cannot be deleted" });
        }

       
    } catch (error) {
        console.log("Error in deleteFolder controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const renameFolder = async (req, res) => {
    try {
        const folderId = req.params.folderId;

        if (!folderId) {
            return res.status(400).json({ success: false, message: "Folder ID is required" });
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Folder name is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ success: false, message: "Invalid folder ID" });
        }
        const folder = await Folder.findOne({ _id: folderId, owner: req.user._id });
        if (!folder) {
            return res.status(404).json({ success: false, message: "Folder not found" });
        }
        folder.name = name;
        await folder.save();
        res.status(200).json({ success: true, message: "Folder renamed successfully" });
    } catch (error) {
        console.log("Error in renameFolder controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};