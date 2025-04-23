import { File } from '../models/File.js';
import { ShareToken } from '../models/ShareToken.js';
import { protectRoute } from './protectRoute.js';
import mongoose from 'mongoose';
import { Folder } from '../models/Folder.js';

export const validateShareToken = async (req, res, next) => {
  const { fileId } = req.params;
  const { token } = req.query;

  if (!fileId || !token) {
    return res.status(400).json({ success: false, message: 'File ID and token are required' });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ success: false, message: 'Invalid File ID' });
    }
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    const shareToken = await ShareToken.findOne({ token, resourceId: file._id });
    if (!shareToken) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    req.shareToken = shareToken;
    req.file=file

    if (shareToken.expiresAt < Date.now()) {
      return res.status(403).json({ success: false, message: 'Token has expired' });
    }

    if (shareToken.accessType === 'private') {
      return protectRoute(req, res, next);
    }

    next(); 

  } catch (err) {
    console.error('Error in conditionalAuth:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const validateShareTokenFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const { token } = req.query;

  if (!folderId || !token) {
    return res.status(400).json({ success: false, message: 'Folder ID and token are required' });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ success: false, message: 'Invalid Folder ID' });
    }
    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });

    const shareToken = await ShareToken.findOne({ token,  resourceType: 'Folder' });
    if (!shareToken) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    if(shareToken.resourceId.toString() !== folder._id.toString() && !shareToken.subFolders.includes(folder._id) ){
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }


    req.shareToken = shareToken;
    req.folder=folder

    if (shareToken.expiresAt < Date.now()) {
      return res.status(403).json({ success: false, message: 'Token has expired' });
    }

    if (shareToken.accessType === 'private') {
      return protectRoute(req, res, next);
    }

    next(); 

  } catch (err) {
    console.error('Error in conditionalAuth:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

