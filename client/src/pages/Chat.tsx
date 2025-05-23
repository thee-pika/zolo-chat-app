import { useSocket } from "@/socket/socket";
import AppLayout from "../components/layout/AppLayout";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useChatDetailsQuery, useGetMessagesQuery } from "@/redux/api/api";
import { useInfiniteScrollTop } from "6pp";
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from "@/constants/event";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "@/redux/reducers/misc";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  publicId: string;
  bio: string;
}

const Chat = ({ user }: { user: User }) => {
  const [message, setmessage] = useState<string>("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const { chatId } = useParams<{ chatId: string }>();
  const socket = useSocket();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessages = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessages.data.totalPages,
    page,
    setPage,
    oldMessages.data.messages
  );

  const errors = [
    {
      isError: chatDetails.isError,
      error: chatDetails.error,
    },
    {
      isError: oldMessages.isError,
      error: oldMessages.error,
    },
  ];

  const members = chatDetails?.data?.chat?.members;

  if (!socket) {
    return;
  }

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

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  return (
    <div className=" h-[calc(100vh-80px)] flex flex-col-reverse">
      <div className="flex items-center justify-evenly bg-gray-300 p-4">
        <div>
          <button className="hover:bg-gray-100 rounded-md p-[10px] cursor-pointer mr-4">
            <AttachFileIcon fontSize="large" />
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
    </div>
  );
};

export default AppLayout(Chat);
