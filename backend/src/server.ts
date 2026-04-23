import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import volunteerRouter from "./routes/volunteerRouting.ts";
import organizationRouter from "./routes/organizationRouting.ts";
import authRouter from "./routes/authRouting.ts";

dotenv.config();

const server = express();

server.use(express.json());
server.use(cookieParser());

server.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

server.use("/volunteer", volunteerRouter)
server.use("/organization", organizationRouter);
server.use("/auth", authRouter);


export default server;
