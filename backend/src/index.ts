import express from "express";
import volunteerRouter from "./routes/volunteerRouting.ts";
import organizationRouter from "./routes/organizationRouting.ts";
import authRouter from "./routes/authRouting.ts";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Support both backend/.env and repo-root .env so dev works regardless of launch folder.
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const server = express();

server.use(express.json());
server.use(cookieParser());

server.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

const port = 3000;

server.use("/volunteer", volunteerRouter)
server.use("/organization", organizationRouter);
server.use("/auth", authRouter);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
