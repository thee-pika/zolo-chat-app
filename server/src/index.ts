import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middleware/error";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { createMessages, createMessagesInAGroup, createSingleChats, createUser } from "./seeders/user";
config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is saying hii");
});

app.use("/api/v1", router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("App is running on", PORT);
});

