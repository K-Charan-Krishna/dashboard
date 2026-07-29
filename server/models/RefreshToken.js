import mongoose from "mongoose";


const refreshTokenSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    tokenHash: {
        type: String,
        required: true
    },

    userAgent: String,

    ipAddress: String,

    device: String,

    revoked: {
        type: Boolean,
        default: false
    },

    expiresAt: Date

}, {
    timestamps: true
});


export default mongoose.model(
    "RefreshToken",
    refreshTokenSchema
);