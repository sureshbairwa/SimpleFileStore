import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadFile,deleteFile,renameFile,getFile,downloadFile,getImages,getDocs,getVideos } from "../controllers/File.js";




const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!req.user || !req.user.email) {
            return cb(new Error("User email is required"), null);
        }

        const sanitizedEmail = req.user.email.replace(/[^a-zA-Z0-9]/g, "_"); // Replacing special characters
        const userUploadPath = path.join(__dirname, 'uploads', sanitizedEmail);

        // Create the folder if it doesn't exist
        if (!fs.existsSync(userUploadPath)) {
            fs.mkdirSync(userUploadPath, { recursive: true });
        }

        cb(null, userUploadPath);
    },
    filename: (req, file, cb) => {
    //   console.log(file)
      cb(null,   file.originalname);
    },
  });


  


const router = express.Router();

router.use(protectRoute);

const upload = multer({ storage });




router.get("/", (req, res) => {
    res.send("File Route");
}); 

router.post("/upload",upload.array("files"), uploadFile);


router.get("/all/images",getImages);
router.get("/all/docs",getDocs);
router.get("/all/videos",getVideos);

router.get("/:fileId",getFile);

router.get("/download/:fileId", downloadFile);

router.delete("/:fileId", deleteFile);

router.put("/rename/:fileId", renameFile);

router.put("/share/:fileId", (req, res) => {
    res.send("File shared");
});





export default router;
