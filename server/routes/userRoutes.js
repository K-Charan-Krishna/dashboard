import express from "express";
import { getAllUsers, updateProfileImage } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();


router.get(
    "/",
    authMiddleware,
    getAllUsers
);
router.put(
    "/profile-image",
    // authMiddleware,
    upload.single("image"),
    updateProfileImage
);

export default router;