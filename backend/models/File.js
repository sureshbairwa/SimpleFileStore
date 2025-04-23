import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }, 
    size: { type: Number, required: true }, 
    mimetype: { type: String, required: true }, 
    url: { type: String, required: true }, 
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    extension:{type:String,required:false},
    bucketInfo:{type:Object,required:true}
},{timestamps: true});


export const File = mongoose.model("File", fileSchema);

 