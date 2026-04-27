import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import volunteerRouter from "./routes/volunteerRouting.ts";
import organizationRouter from "./routes/organizationRouting.ts";
import authRouter from "./routes/authRouting.ts";

dotenv.config({ path: [".env", "../.env"] });

const server = express();

server.use(express.json());
server.use(cookieParser());

server.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

server.use("/volunteer", volunteerRouter)
server.use("/organization", organizationRouter);
server.use("/auth", authRouter);


export default server;
