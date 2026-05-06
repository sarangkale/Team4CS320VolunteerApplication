import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import volunteerRouter from "./routes/volunteerRouting.ts";
import organizationRouter from "./routes/organizationRouting.ts";
import authRouter from "./routes/authRouting.ts";

dotenv.config({ path: [".env", "../.env"] });

const server = express();

server.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
server.options(/.*/, cors()); 

server.use(express.json());
server.use(cookieParser());

server.use("/volunteer", volunteerRouter);
server.use("/organization", organizationRouter);
server.use("/auth", authRouter);

export default server;
