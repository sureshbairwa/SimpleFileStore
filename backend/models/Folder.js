import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }, // Parent folder (null if root)
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }] ,
    subFolders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }], 
}, { timestamps: true });



export const Folder = mongoose.model("Folder", folderSchema);