import express from "express";
import "dotenv/config";
import { connectDb } from "./db/client.js";
import notesRouter from "./routes/notes.js";
import usersRouter from "./routes/users.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/notes", notesRouter);
app.use("/users", usersRouter);

const startServer = async() => {
  await connectDb();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer().catch((error) => console.log(error, 'failed to start server'));