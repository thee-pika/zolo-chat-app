import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middleware/error";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { createServer } from "http";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./utils/event";
import { v4 as uuidv4 } from "uuid";
import { getSockets } from "./lib/helper";
import { prisma } from "../db";

config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {},
});

const userSocketIds = new Map();

io.use((socket, next) => {
  next();
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  const user = {
    id: "vfvbhbvgju",
    name: "John Doe",
  };

  userSocketIds.set(user.id, socket.id);
  console.log("User Socket IDs", userSocketIds);
  socket.on(NEW_MESSAGE, async (data) => {
    const { chatId, members, message } = JSON.parse(data);

    console.log(chatId, members, message);

    const messageForRT = {
      content: message,
      id: uuidv4(),
      sender: {
        id: user.id,
        name: user.name,
      },
      chatId,
      createdAt: new Date().toISOString(),
    };

    console.log("New Message", messageForRT);

    const messageForDB = {
      content: message,
      senderId: user.id,
      chatId,
    };

    const userSockets = getSockets([user], userSocketIds);
    console.log("User Sockets", userSockets);

    const filteredUserSockets = userSockets.filter(
      (id): id is string => typeof id === "string"
    );

    if (!filteredUserSockets || filteredUserSockets.length === 0) {
      console.log("No user sockets found");
      return;
    }

    io.to(filteredUserSockets).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRT,
    });

    io.to(filteredUserSockets).emit(NEW_MESSAGE_ALERT, {
      chatId,
    });

    try {
      await prisma.message.create({
        data: messageForDB,
      });
    } catch (error) {
      console.error("Error saving message to DB", error);
    }

    console.log("Message saved to DB", messageForDB);
    console.log("User Sockets", userSockets);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    userSocketIds.delete(user.id);
  });
});

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is saying hii");
});

app.use("/api/v1", router);

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log("App is running on", PORT);
});
