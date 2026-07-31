import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/mongoDB.js";
import allRoutes from "./routes/allRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


const startServer = async () => {
    try {
        await connectDB();

        app.use("/api", allRoutes);

        app.listen(process.env.PORT || 7201, () => {
            console.log("Server running on port 7201");
        });

    } catch (error) {
        console.log(error.message);
    }
};

console.log("this from charan branch")

startServer();