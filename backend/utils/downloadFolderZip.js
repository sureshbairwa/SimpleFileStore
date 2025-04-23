import mongoose from 'mongoose';
import {Folder} from '../models/Folder.js'; 
import {File} from '../models/File.js'; 
import archiver from 'archiver';
import axios from 'axios';
import path from 'path';
import  generatePresignedUrl  from './generatePresignedUrl.js'; 

// Recursive function to collect files with their relative paths
async function collectFilesWithPaths(folderId, currentPath = '') {
    const folder = await Folder.findById(folderId)
        .populate('files')
        .populate('subFolders');

    let fileList = [];

    for (const file of folder.files) {
        fileList.push({
            file,
            pathInZip: path.join(currentPath, file.name),
        });
    }

    for (const sub of folder.subFolders) {
        const subFolderPath = path.join(currentPath, sub.name);
        const subFiles = await collectFilesWithPaths(sub._id, subFolderPath);
        fileList = fileList.concat(subFiles);
    }

    return fileList;
}

// Main controller function to handle the download request
export const downloadFolderZip = async (req, res) => {
    try {
        const folderId = req.params.folderId;

        if (!folderId || !mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ success: false, message: "Invalid folder ID" });
        }

        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ success: false, message: "Folder not found" });
        }

        
        if (folder.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const filesWithPaths = await collectFilesWithPaths(folderId, folder.name);

        if (!filesWithPaths.length) {
            return res.status(404).json({ success: false, message: "No files to download" });
        }

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${folder.name}.zip`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        for (const { file, pathInZip } of filesWithPaths) {
            const url = await generatePresignedUrl(file.bucketInfo, file.mimetype, 'attachment');
            const response = await axios.get(url, { responseType: 'stream' });
            archive.append(response.data, { name: pathInZip });
        }

        await archive.finalize();
    } catch (error) {
        console.error('Error in downloadFolderZip:', error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
