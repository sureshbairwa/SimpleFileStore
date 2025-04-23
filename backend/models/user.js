import mongoose from "mongoose";

const userSchema = mongoose.Schema({

	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		
	},
	
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: "",
	},
	rootFolder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }, 
	
	
},{timestamps: true});

export const User = mongoose.model("User", userSchema);
