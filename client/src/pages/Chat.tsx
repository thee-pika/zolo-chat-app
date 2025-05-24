import { useSocket } from "@/socket/socket";
import AppLayout from "../components/layout/AppLayout";

import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatDetailsQuery, useGetMessagesQuery } from "@/redux/api/api";
import { useInfiniteScrollTop, useSocketEvents } from "6pp";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "@/constants/event";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "@/redux/reducers/misc";
import { removeNewMessageAlert } from "@/redux/reducers/chat";
import { useErrors } from "@/hooks/hook";
import { IconButton, Skeleton } from "@mui/material";
import MessageComponent from "@/components/shared/MessageComponent";
import { TypingLoader } from "@/components/layout/Loaders";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  publicId: string;
  bio: string;
}

type ErrorObject = {
  isError: boolean;
  error:
    | {
        data: {
          message: string;
        };
      }
    | undefined;
  fallback?: () => void;
};

const Chat = ({ user }: { user: User }) => {
  const [message, setmessage] = useState<string>("");
  const [messages, setMessages] = useState<unknown[]>([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState<HTMLElement | null>(
    null
  );
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const socket = useSocket();
  const containerRef = useRef(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data.totalPages,
    page,
    setPage,
    oldMessagesChunk.data.messages
  );

  const errors: ErrorObject[] = [
    {
      isError: chatDetails.isError,
      error: isErrorWithMessage(chatDetails.error)
        ? chatDetails.error
        : undefined,
    },
    {
      isError: oldMessagesChunk.isError,
      error: isErrorWithMessage(chatDetails.error)
        ? chatDetails.error
        : undefined,
    },
  ];

  useErrors(errors);

  const members = chatDetails?.data?.chat?.members;

  const startTypingListener = useCallback(
    ({
      data,
    }: {
      data: {
        chatId: string;
      };
    }) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    ({
      data,
    }: {
      data: {
        chatId: string;
      };
    }) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    ({
      data,
    }: {
      data: {
        chatId: string;
        message: string;
      };
    }) => {
      if (data.chatId !== chatId) return;

      const messageForAlert = {
        content: data.message,
        sender: {
          id: "78999999999999",
          name: "Farul",
        },
        chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) navigate("/");
  }, [chatDetails.isError, navigate]);

  const newMessageListener = useCallback(
    ({
      data,
    }: {
      data: {
        chatId: string;
        message: string;
      };
    }) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const handleSubmit = () => {
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setmessage("");
    console.log(message);
  };

  const onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setmessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e: React.FormEvent) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget as HTMLElement);
  };

  useEffect(() => {
    if (socket) {
      socket.emit(CHAT_JOINED, { userId: user.id, members });
      dispatch(removeNewMessageAlert(chatId));
      return () => {
        setMessages([]);
        setmessage("");
        setOldMessages([]);
        setPage(1);
        socket.emit(CHAT_LEAVED, { userId: user.id, members });
      };
    }
  }, [chatId, dispatch, members, setOldMessages, socket, user.id]);

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessageListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  const allMessages = [...oldMessages, message];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <div
      className=" h-[calc(100vh-80px)] flex flex-col-reverse"
      ref={containerRef}
    >
      {allMessages.map((i, idx) => (
        <MessageComponent
          user={user}
          id={
            typeof i === "object" && i !== null && "_id" in i
              ? i._id.toString()
              : idx.toString()
          }
          message={i}
        />
      ))}

      {userTyping && <TypingLoader />}
      <div ref={bottomRef} />
      <div className="flex items-center justify-evenly bg-gray-300 p-4">
        <div>
          <button className="hover:bg-gray-100 rounded-md p-[10px] cursor-pointer mr-4">
            <IconButton onClick={handleFileOpen}>
              <AttachFileIcon fontSize="large" />
            </IconButton>
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Type Your Message here"
            className="p-4 border bg-gray-100 w-3xl"
            onChange={onMessageChange}
            value={message}
          />
        </div>
        <div className="">
          <button
            onClick={handleSubmit}
            className="hover:bg-gray-100 rounded-md p-[10px] cursor-pointer ml-4"
          >
            <SendIcon fontSize="large" />
          </button>
        </div>
      </div>
      {/* <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} /> */}
    </div>
  );
};

function isErrorWithMessage(
  error: FetchBaseQueryError | SerializedError | undefined
): error is FetchBaseQueryError & { data: { message: string } } {
  return !!(
    error &&
    typeof error === "object" &&
    "data" in error &&
    typeof error.data === "object" &&
    "message" in (error.data as object)
  );
}

export default AppLayout(Chat);
