import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middleware/error";
import { router } from "./routes";
config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/api/v1", router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("App is running on", PORT);
});
