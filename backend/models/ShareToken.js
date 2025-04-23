// models/ShareToken.js
import mongoose from 'mongoose';

const shareTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, refPath: 'resourceType' ,required: true },
  resourceType: { type: String, enum: ['Folder', 'File'], required: true }, //  added File support
  accessType: { type: String, enum: ['public', 'private'], required: true },
  allowedEmails: [{ type: String }],
  permissions: { type: String, enum: ['viewer', 'editor'], default: 'viewer' },
  subFolders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }], 
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, //  30 days from now
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const ShareToken = mongoose.model('ShareToken', shareTokenSchema);
