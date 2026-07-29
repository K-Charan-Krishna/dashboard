import express from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";


const router = express.Router();


// Authentication routes
router.use("/auth", authRoutes);


// User routes
router.use("/users", userRoutes);



export default router;