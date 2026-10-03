// const express = require('express')// method-1
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";

 
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(cookieParser());
const allowedFrontend = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim().replace(/\/$/, "") : 'http://localhost:3000';

const corsOption = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (
            origin === allowedFrontend ||
            origin === 'http://localhost:3000' ||
            origin.endsWith('.vercel.app')
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
};
app.use(cors(corsOption)); 


// routes
app.use("/api/v1/user",userRoute); 
app.use("/api/v1/message",messageRoute);
 

server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});

