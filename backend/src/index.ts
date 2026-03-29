import express from "express";
import volunteerRouter from "./routes/serveVolunteers.ts";

const server = express();

server.use("/volunteer", volunteerRouter)

const listener = server.listen(() => {
  console.log(`Server listening on port ${(listener.address() as any)["port"]}`);
})
