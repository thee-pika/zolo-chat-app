import type { ComponentType } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMyChatsQuery } from "../../redux/api/api";

function AppLayout<P extends object>(WrappedComponent: ComponentType<P>) {
  return function EnhancedComponent(props: P) {
    
    const params = useParams();
    const { isMobileMenuFriend } = useSelector(
      (state: { misc: unknown }) => state.misc
    );

    const sampleChats = {};
    const chatId = params.chatId;
    const handleDeleteChat = () => {
      console.log("Delete chat:", chatId);
    };
    
    const { isLoading } = useMyChatsQuery("");

    return (
      <div>
        <Title />
        <Header />
        <div className="flex">
          <div className="bg-red-600 w-1/4 h-screen sm:block hidden">
            <ChatList
              chats={sampleChats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
          </div>
          <div className="bg-yellow-600 h-screen flex-1">
            <WrappedComponent {...props} />
          </div>
          <div className="bg-green-600 w-1/4 h-screen md:block hidden">
            Third
          </div>
        </div>
      </div>
    );
  };
}

export default AppLayout;
