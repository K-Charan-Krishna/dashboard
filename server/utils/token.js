import jwt from "jsonwebtoken";


export const generateAccessToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );

};


export const generateRefreshToken = (user) => {

    return jwt.sign(
        {
            id: user._id
        },
        process.env.REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );

};

import crypto from "crypto";


export const hashToken = (token) => {

    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

};