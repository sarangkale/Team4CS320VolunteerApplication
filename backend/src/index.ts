import server from "./server.ts";
import dotenv from "dotenv";
dotenv.config();

const port = 3000;



server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

export default server;
