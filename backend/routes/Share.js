import express from "express";
import { ShareFile,GetSharedFile,ShareFolder,GetSharedFolder } from "../controllers/Share.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { validateShareToken, validateShareTokenFolder } from "../middleware/validateShareToken.js";


const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Share route" });
});

router.post("/file/:fileId",protectRoute, ShareFile);
router.get("/file/:fileId",validateShareToken,GetSharedFile);
router.post("/folder/:folderId", protectRoute ,ShareFolder);
router.get("/folder/:folderId",validateShareTokenFolder,GetSharedFolder);



export default router;