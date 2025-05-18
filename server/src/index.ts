import express from "express";
import {config} from "dotenv";
config();

const app = express();

const PORT = process.env.PORT || 8000;

app.get("/", (req , res) => {
    res.send({ message: "App is saying Hii"});
})

app.listen(PORT, () => { console.log("App is running on", PORT)});
