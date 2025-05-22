import type React from "react";
import ChatItem from "../shared/ChatItem";

interface MessageAlertType {
  chatId: string;
  count: number;
}

interface ChatT {
  id: string;
  name: string;
  avatar: string;
  groupChat: boolean;
  members: string[];
}

interface ChatListProps {
  chats: ChatT[];
  chatId: string;
  onlineUsers: string[];
  newMessagesAlert: MessageAlertType;
  handleDeleteChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert,
  handleDeleteChat,
  
}) => {
  console.log(chats);
  console.log(chatId);
  const sameSender = "";
  const isOnline = false;
  return (
    <>
      <div>
        {chats && chats.length > 0
          ? chats.map((data, index) => {
              const { avatar, id, name, groupChat, members } = data;

              return (
                <ChatItem
                  sameSender={sameSender}
                  isOnline={isOnline}
                  newMessagesAlert={newMessagesAlert}
                  handleDeleteChat={handleDeleteChat}
                  onlineUsers={onlineUsers}
                  avatar={avatar}
                  groupChat={groupChat}
                  name={name}
                  index={index}
                  id={id}
                />
              );
            })
          : ""}
      </div>
    </>
  );
};

export default ChatList;
