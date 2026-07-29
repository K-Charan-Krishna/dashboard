import express from "express";
import { register, login, refreshToken, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout)
router.post("/refresh", refreshToken);


export default router;