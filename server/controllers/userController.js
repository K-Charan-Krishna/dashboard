import User from "../models/User.js";
import s3 from "../config/s3.js";
import fs from "fs/promises";
import {
    PutObjectCommand
} from "@aws-sdk/client-s3";
// import crypto from "crypto";
import path from "path";

export const getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password"); // exclude password hash


        res.status(200).json({
            success: true,
            count: users.length,
            users
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const updateProfileImage = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an image"
            });
        }

        // Logged in user
        // const userId = req.user.id;

        // Generate unique filename
        // const fileName =
        //     `profiles/${userId}-${crypto.randomUUID()}`;

        // // Upload to S3
        // const command = new PutObjectCommand({

        //     Bucket: process.env.AWS_BUCKET_NAME,

        //     Key: fileName,

        //     Body: req.file.buffer,

        //     ContentType: req.file.mimetype

        // });

        // await s3.send(command);

        // // Build public URL
        // const imageUrl =
        //     `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        const userId = "charan"; // later: req.user.id

        const uploadDir = path.join(
            process.cwd(),
            process.env.ROOT_DIR,
            userId
        );

        await fs.mkdir(uploadDir, { recursive: true });

        const extension = path.extname(req.file.originalname);

        const fileName = `${crypto.randomUUID()}${extension}`;

        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, req.file.buffer);

        const imagePath = `/var/profile/${userId}/${fileName}`;

        // Update user
        // const user = await User.findByIdAndUpdate(

        //     userId,

        //     {
        //         profileImage: imagePath
        //     },

        //     {
        //         new: true
        //     }

        // );

        return res.status(200).json({

            message: "Profile image uploaded",

            profileImage: imagePath
            // profileImage: user.profileImage

        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};