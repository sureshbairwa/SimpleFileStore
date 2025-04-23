import mongoose from "mongoose";
import { ShareToken } from '../models/ShareToken.js';
import { File } from '../models/File.js'; // Make sure this model exists
import crypto from 'crypto';
import generatePresignedUrl from '../utils/generatePresignedUrl.js'
import { Folder } from "../models/Folder.js";
import dotenv from 'dotenv';
dotenv.config();

export  const ShareFile = async (req, res) => {
    const { fileId } = req.params;
    const { accessType, emails = [] } = req.body;

    if (!fileId) return res.status(400).json({ success: false, message: 'File ID is required' });
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ success: false, message: 'Invalid File ID' });
    }

    if (!accessType) return res.status(400).json({ success: false, message: 'Access type is required' });
   
  
    if (!['public', 'private'].includes(accessType)) {
      return res.status(400).json({success: false, message: 'Invalid access type. Must be "public" or "private"' });
    }
  
    if (accessType === 'private' && (!emails || !emails.length)) {
      return res.status(400).json({ success: false, message: 'Emails are required for private sharing' });
    }
  
    try {
      const file = await File.findById(fileId);
      if (!file) return res.status(404).json({ success: false, message: 'File not found' });

      if (file.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const token = crypto.randomBytes(24).toString('hex');
  
      const newToken = await ShareToken.create({
        token,
        resourceId: file._id,
        resourceType: 'File',
        accessType,
        allowedEmails: accessType === 'private' ? emails : [],
        createdBy: req.user._id,
      });
  
      res.status(201).json({
        success: true,
        message: 'Share token created successfully',
        shareUrl: `${process.env.FRONTEND_URL}/share/file/${file._id}?token=${token}`,
        expiresAt: newToken.expiresAt
      });
  
    } catch (err) {
      console.error('Error creating share token:', err.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  export const GetSharedFile = async (req, res) => {
    const  shareToken  =   req.shareToken; 
    const file=req.file
    
    try {


     
      if (shareToken.accessType === 'private') {
        const userEmail = req.user.email; // Assuming req.user contains the authenticated user's info
        if (!shareToken.allowedEmails.includes(userEmail)) {
          return res.status(403).json({ success: false, message: 'You do not have permission to access this file' });
        }
      }



      // Generate a presigned URL for the file
      const url = await generatePresignedUrl(file.bucketInfo, file.mimetype);

      // Proceed to send the file
      res.status(200).json({
        success: true,
        file:{
          id:file._id,
          name:file.name,
          mimetype:file.mimetype,
          createdAt:file.createdAt,
          extension:file.extension,
          size:file.size,
          url:url
        },
        message: 'File retrieved successfully'
      });

    } catch (err) {
      console.error('Error retrieving shared file:', err.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }


export const ShareFolder = async (req, res) => {

  const { folderId } = req.params;
  const { accessType, emails = [],isSubFolders } = req.body;

  if (!folderId) return res.status(400).json({ success: false, message: 'Folder ID is required' });
  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    return res.status(400).json({ success: false, message: 'Invalid Folder ID' });
  }

  if (!accessType) return res.status(400).json({ success: false, message: 'Access type is required' });

  if (!['public', 'private'].includes(accessType)) {
    return res.status(400).json({success: false, message: 'Invalid access type. Must be "public" or "private"' });
  }

  if (accessType === 'private' && (!emails || !emails.length)) {
    return res.status(400).json({ success: false, message: 'Emails are required for private sharing' });
  }

 try {


  const folder = await Folder.findById(folderId);
  if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });

  if (folder.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  const subFolders = isSubFolders ? folder.subFolders : [];

  const newToken = await ShareToken.create({
    token,
    resourceId: folder._id,
    resourceType: 'Folder',
    accessType,
    allowedEmails: accessType === 'private' ? emails : [],
    subFolders,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Share token created successfully',
    shareUrl: `${process.env.FRONTEND_URL}/share/folder/${folder._id}?token=${token}`,
    expiresAt: newToken.expiresAt
  });

  

  
 } catch (error) {

  console.error('Error in share folder:', error.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
  
 }

}


export const GetSharedFolder = async (req, res) => {
  const  shareToken  =   req.shareToken; 
  const folder=req.folder

  try {

    if (shareToken.accessType === 'private') {
      const userEmail = req.user.email; // Assuming req.user contains the authenticated user's info
      if (!shareToken.allowedEmails.includes(userEmail)) {
        return res.status(403).json({ success: false, message: 'You do not have permission to access this folder' });
      }
    }

     await folder.populate('files');
    let subFolders=[]

    if(shareToken.resourceId.toString()===folder._id.toString() && shareToken.subFolders.length>0 ){
      await folder.populate('subFolders');
      subFolders=folder.subFolders
    }

    res.status(200).json({
      success: true,
     
      files: folder.files,
      subFolders,
      message: 'Folder retrieved successfully'
    });

  } catch (err) {
    console.error('Error retrieving shared folder:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
  }