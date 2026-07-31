import User from "../models/User.js";
import s3 from "../config/s3.js";
import fs from "fs/promises";
import {
    PutObjectCommand, DeleteObjectCommand
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
        const userId = req.user.id;

        // Generate unique filename
        const fileName =
            `profiles/${userId}`;

        console.log({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            accessKeyType: typeof process.env.AWS_ACCESS_KEY_ID,
            secretLength: process.env.AWS_SECRET_ACCESS_KEY?.length,
            secretType: typeof process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });

        // Upload to S3
        const command = new PutObjectCommand({

            Bucket: process.env.AWS_BUCKET_NAME,

            Key: fileName,

            Body: req.file.buffer,

            ContentType: req.file.mimetype

        });

        await s3.send(command);

        // Build public URL
        const imageUrl = `profiles/${userId}-${req.file.originalname}`

        // Update user
        const user = await User.findByIdAndUpdate(

            userId,

            {
                profileImage: imageUrl
            },

            {
                new: true
            }

        );

        return res.status(200).json({
            message: "Profile image uploaded",
            profileImage: user.profileImage
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        });

    }
};

export const deleteProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user || !user.profileImage) {
            return res.status(404).json({
                message: "Profile image not found"
            });
        }

        const imageKey = user.profileImage

        console.log("Deleting:", imageKey);

        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
        });

        await s3.send(command);

        user.profileImage = null;
        await user.save();

        return res.status(200).json({
            message: "Profile image deleted successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};