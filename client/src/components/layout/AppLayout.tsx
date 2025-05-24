import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import Header from "./Header";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMyChatsQuery } from "../../redux/api/api";
import { useSocket } from "@/socket/socket";
import { useErrors } from "@/hooks/hook";
import { getOrSaveFromStorage } from "@/lib/feature";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "@/constants/event";
import {
  setIsDeleteMenu,
  setIsMobile,
  SetIsSelectedDeleteChat,
} from "@/redux/reducers/misc";
import {
  incrementNotification,
  setNewMessageAlert,
} from "@/redux/reducers/chat";
import { useSocketEvents } from "6pp";
import DeleteChatMenu from "../dialog/DeleteChatMenu";
import { Drawer, Skeleton } from "@mui/material";

interface ChatT {
  id: string;
  name: string;
  avatar: string;
  groupChat: boolean;
  members: string[];
}

interface NewMessageAlertT {
  chatId: string;
  count: number;
}

function AppLayout<P extends object>(WrappedComponent: ComponentType<P>) {
  return function EnhancedComponent(props: P) {
    const [chats, setChats] = useState<ChatT[]>([]);
    const params = useParams();
    const dispatch = useDispatch();
    const socket = useSocket();
    const navigate = useNavigate();
    const chatId = params.chatId;
    console.log("chatId  in layout", chatId);

    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const { isMobile } = useSelector(
      (state: { misc: { isMobile: boolean } }) => state.misc
    );

    const { newMessagesAlert } = useSelector(
      (state: { chat: { newMessagesAlert: NewMessageAlertT[] } }) => state.chat
    );

    console.log("newMessagesAlert", newMessagesAlert);
    // const sampleChats = [
    //   {
    //     id: "1",
    //     name: "John Doe",
    //     avatar: "https://via.placeholder.com/150",
    //     groupChat: false,
    //     members: ["1", "2"],
    //   },
    //   {
    //     id: "2",
    //     name: "Jane Smith",
    //     avatar: "https://via.placeholder.com/150",
    //     groupChat: true,
    //     members: ["2", "3", "4"],
    //   },
    //   {
    //     id: "3",
    //     name: "Dev Team",
    //     avatar: "https://via.placeholder.com/150",
    //     groupChat: true,
    //     members: ["1", "2", "3", "4"],
    //   },
    // ];

    // const onlineUsers = ["1", "3"];
    const deleteMenuAnchor = useRef<HTMLElement | null>(null);
    // const newMessagesAlert = { chatId, count: 5 };
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    if (!isLoading && data) {
      console.log("Chats state in AppLayout:", chats);
    }

    useEffect(() => {
      if (data) {
        const validChats = data.chats.filter((chat: ChatT) => chat !== null);
        console.log("validChats", validChats);
        setChats(validChats);
      }
    }, [data]);

    useErrors([
      {
        isError,
        error:
          error &&
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data &&
          typeof error.data.message === "string"
            ? { data: { message: error.data.message } }
            : { data: { message: "Unknown error" } },
      },
    ]);

    useEffect(() => {
      getOrSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        value: newMessagesAlert,
        get: false,
      });
    }, [newMessagesAlert]);

    const handleDeleteChat = ({
      e,
    }: {
      e: React.MouseEvent<HTMLElement>;
      chatId: string;
      groupChat: boolean;
    }) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(SetIsSelectedDeleteChat(true));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => {
      dispatch(setIsMobile(true));
    };

    const newMessageAlertListener = useCallback(
      ({
        data,
      }: {
        data: {
          chatId: string;
        };
      }) => {
        if (data.chatId === chatId) {
          dispatch(setNewMessageAlert({ chatId: data.chatId }));
        }
      },
      [chatId, dispatch]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data: string[]) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };
    console.log("socketsocketsocket", socket);
    useSocketEvents(socket!, eventHandlers);

    if (isLoading) {
      console.log("isLoading");
      return <div className="bg-red-800 h-screen">Loading chats...</div>;
    }

    if (error) {
      console.log(error);
      if (!socket) {
        console.log("Socket not found!");
        return <div>Socket connection is not established</div>;
      }
      return <div>Error loading chats</div>;
    }

    return (
      <>
        <Title />
        <Header />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor.current}
        />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              chats={chats}
              chatId={chatId || "909090"}
              onlineUsers={onlineUsers}
              newMessagesAlert={newMessagesAlert}
              handleDeleteChat={() => handleDeleteChat}
            />
          </Drawer>
        )}
        <div className="flex">
          <div className=" w-1/4 min-h-[calc(100vh-80px)] sm:block hidden border-r-2">
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={chats}
                chatId={chatId || "9099999999999"}
                handleDeleteChat={() => handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </div>
          <div className=" h-[calc(100vh-80px)] flex-1">
            <WrappedComponent {...props} />
          </div>
          <div className="bg-green-600 w-1/4 h-[calc(100vh-80px)] md:block hidden">
            Third
          </div>
        </div>
      </>
    );
  };
}

export default AppLayout;
