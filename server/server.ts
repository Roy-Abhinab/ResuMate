import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./configs/db";

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => res.send("Server is live..."));

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});