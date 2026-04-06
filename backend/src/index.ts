import express from "express";
import volunteerRouter from "./routes/volunteerRouting.ts";
import organizationRouter from "./routes/organizationRouting.ts";
import authRouter from "./routes/authRouting.ts";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const server = express();

server.use(express.json());
server.use(cookieParser());

const port = 3000;

server.use("/volunteer", volunteerRouter)
server.use("/organization", organizationRouter);
server.use("/auth", authRouter);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})
