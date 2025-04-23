import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {createFolder, getFolder, getRootFolder, deleteFolder, renameFolder} from "../controllers/Folder.js"
import { downloadFolderZip } from "../utils/downloadFolderZip.js";


const router = express.Router();

router.use(protectRoute);



router.get("/", (req, res) => {
    res.send("Folder Route");
}); 


router.post("/create", createFolder);

router.get("/root", getRootFolder);

router.get("/:folderId", getFolder);



router.delete("/:folderId", deleteFolder);

router.put("/rename/:folderId", renameFolder);

router.get("/download/:folderId", downloadFolderZip);




export default router;
