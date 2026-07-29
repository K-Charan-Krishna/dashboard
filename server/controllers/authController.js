import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
    generateAccessToken,
    generateRefreshToken,
    hashToken
} from "../utils/token.js";


export const register = async (req, res) => {

    try {
        const {
            name,
            email,
            password
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400)
                .json({
                    message: "User already exists"
                });
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const user =
            await User.create({

                name,
                email,
                password: hashPassword

            });

        res.status(201).json({

            message: "Registration successful",
            userId: user._id

        });

    } catch (error) {
        res.status(500)
            .json({
                message: error.message
            });
    }

};

export const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(401)
                .json({
                    message: "Invalid credentials"
                });
        }

        const match =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!match) {

            return res.status(401)
                .json({
                    message: "Invalid credentials"
                });

        }

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

        await RefreshToken.create({

            userId: user._id,

            tokenHash: hashToken(refreshToken),

            userAgent: req.headers["user-agent"],

            ipAddress: req.ip,

            device: req.headers["device"] || "unknown",

            expiresAt:
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        });

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        );

        res.json({
            accessToken,
            user: { name: user.name, email: user.email }
        });

    } catch (error) {

        res.status(500)
            .json({
                message: error.message
            });

    }

};

export const refreshToken = async (req, res) => {
    try {
        // Get refresh token from cookie
        const oldRefreshToken = req.cookies.refreshToken;
        console.log(oldRefreshToken, "oldrefresh")

        if (!oldRefreshToken) {
            return res.status(401).json({
                message: "Refresh token is missing"
            });
        }

        // // Verify JWT
        const payload = jwt.verify(
            oldRefreshToken,
            process.env.REFRESH_SECRET
        );

        console.log(payload, "payload")

        // Find token in database
        const storedToken = await RefreshToken.findOne({
            userId: payload.id,
            tokenHash: hashToken(oldRefreshToken)
        });



        if (!storedToken) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        // Check expiration stored in DB
        if (storedToken.expiresAt < new Date()) {
            await storedToken.deleteOne();

            return res.status(401).json({
                message: "Refresh token expired"
            });
        }

        // Get user
        const user = await User.findById(payload.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Remove old refresh token (rotation)
        await storedToken.deleteOne();

        // Generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Save new refresh token
        await RefreshToken.create({
            userId: user._id,
            tokenHash: hashToken(newRefreshToken),
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
            device: req.headers["device"] || "unknown",
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        // Replace cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        const isAll = req.query.isAll === "true";

        if (!oldRefreshToken) {
            return res.status(200).json({
                message: "Already logged out"
            });
        }

        try {
            const payload = jwt.verify(
                oldRefreshToken,
                process.env.REFRESH_SECRET
            );

            if (isAll) {
                // Delete all refresh tokens for this user
                await RefreshToken.deleteMany({
                    userId: payload.id
                });
            } else {
                // Delete only the current session
                await RefreshToken.deleteOne({
                    userId: payload.id,
                    tokenHash: hashToken(oldRefreshToken)
                });
            }

        } catch (err) {
            // Ignore invalid/expired token and continue clearing cookie
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "strict",
        });

        return res.status(200).json({
            message: isAll
                ? "Logged out from all devices"
                : "Logout successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};