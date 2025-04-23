import { uploadToS3 } from "../utils/uploadToS3.js";
import { File } from "../models/File.js";
import { Folder } from "../models/Folder.js";
import { readAllFiles } from "../utils/uploadToS3.js";
import path from "path";
import { deleteFolder } from "../utils/deleteFolder.js";
import generatePresignedUrl from "../utils/generatePresignedUrl.js";
import mongoose from "mongoose";


const __dirname = path.resolve();

export const uploadFile = async (req, res) => {
  try {
    const user = req?.user;
    const folderName = user.email.replace(/[^a-zA-Z0-9]/g, "_");

    const file = req.file; 
    const  folderId = req.query.folderId; 

    if (!folderId) {
        return res.status(400).json({ 
          success: false, 
          message: "Folder ID is required" 
        });
      }

      if(!mongoose.Types.ObjectId.isValid(folderId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid folder ID" 
        });
      }



    

    const folder = await Folder.findById(folderId); 
  
    if (!folder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }

    if (folder.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const files = await readAllFiles(
      path.join(__dirname, "/uploads/", folderName)
    );
    console.log("files", files);

    if (files.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No files found" });
    }

    let fileMetadata = null; 

    for (const file of files) {
      fileMetadata = await uploadToS3(file, folderName);


      if (!fileMetadata) {
        
            const localFolderPath = path.join(__dirname, "/uploads/", folderName);
            await deleteFolder(localFolderPath);
        return res
          .status(500)
          .json({ success: false, message: "Error uploading file" });
      }

      const { name, size, mimetype, url,extension,data  } = fileMetadata; 
      console.log(fileMetadata)
      const newFile = new File({
        name,
        owner: user._id,
        folder: folderId,
        size,
        mimetype,
        url,
        extension,
        bucketInfo: data, 
        
      });

      await newFile.save();
      folder.files.push(newFile._id); 
      await folder.save();
      console.log("File uploaded successfully", newFile);
    }


    const localFolderPath = path.join(__dirname, "/uploads/", folderName);
    await deleteFolder(localFolderPath);

    res
      .status(200)
      .json({ success: true, message: "File uploaded successfully" });
  } catch (error) {
    console.log("Error in uploadFile controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
          return res.status(400).json({ success: false, message: "Invalid file ID" });
      }

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }
        if(file.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const bucketInfo = file.bucketInfo;
        const mimetype = file.mimetype; 

        const url = await generatePresignedUrl(
            bucketInfo,
            mimetype,

          
        );






        res.status(200).json({ success: true, message: "File fetched successfully", url });
    } catch (error) {
        console.log("Error in getFile controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" }); 
        }

      }

export const deleteFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        if (!fileId) {
            return res.status(400).json({ success: false, message: "File ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, message: "Invalid file ID" });
        }

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }
        if(file.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        await File.findByIdAndDelete(fileId)

        res.status(200).json({success:true,message:"File deleted successfully",fileId})



       
    } catch (error) {
        console.log("Error in deleteFile controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const renameFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;

        if (!fileId) {
            return res.status(400).json({ success: false, message: "File ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, message: "Invalid file ID" });
        }
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, message: "file name is required" });
        }

        const file = await File.findOne({ _id: fileId, owner: req.user._id });
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }
        file.name = name;
        await file.save();
        res.status(200).json({ success: true, message: "File renamed successfully", fileId });
    } catch (error) {
        console.log("Error in renameFile controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const downloadFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;

        if (!fileId) {
            return res.status(400).json({ success: false, message: "File ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, message: "Invalid file ID" });
        }

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }
        if(file.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const bucketInfo = file.bucketInfo;
        const mimetype = file.mimetype; 

        const url = await generatePresignedUrl(
            bucketInfo,
            mimetype,
            'attachment'
        );

        res.status(200).json({ success: true, message: "File fetched successfully", url });
    } catch (error) {
        console.log("Error in downloadFile controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getImages = async (req, res) => {
    try {
        const files = await File.find({ owner: req.user._id,  mimetype: { $regex: /^image\// } });
        res.status(200).json({ success: true, files: files });
    } catch (error) {
        console.log("Error in getFiles controllessssssssssr", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getVideos = async (req, res) => {
    try {
        const files = await File.find({ owner: req.user._id, mimetype: { $regex: /^video\// } });
        res.status(200).json({ success: true, files });
    } catch (error) {
        console.log("Error in getFiles controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getDocs = async (req, res) => {
    try {
        const files = await File.find({ owner: req.user._id, mimetype: { $regex: /^application\// } });
        res.status(200).json({ success: true, files });
    } catch (error) {
        console.log("Error in getFiles controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};