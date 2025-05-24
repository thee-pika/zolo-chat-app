import React from "react";

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
  onlineUsers: string[];
  newMessagesAlert: MessageAlertType[];
  handleDeleteChat: () => void;

  chat: ChatT;

  sameSender: boolean;
  isOnline: boolean;
  index: number;
}

const ChatItem: React.FC<ChatListProps> = ({
  sameSender,
  chat,
  isOnline,
  newMessagesAlert,
  handleDeleteChat,
}) => {
  console.log("chatchatchatchat in chatitttttttttttttttttttem ", chat);
  const newMessageCount = newMessagesAlert.find((messageAlert) =>
    messageAlert.chatId === chat.id ? messageAlert.count : 0
  );
  console.log(newMessageCount);
  console.log("sameSender", sameSender);
  return (
    <div
      className="flex border-b-2 items-center p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer relative group"
      title={`${chat.name} ${
        newMessageCount && newMessageCount.count > 0
          ? `(${newMessageCount} new messages)`
          : ""
      }`}
    >
      <div className="relative">
        <img
          src={chat.avatar}
          alt={`${chat.name}'s avatar`}
          className="w-12 h-12 rounded-full border border-gray-200"
        />

        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      <div className="ml-4 flex-1">
        <p className="font-medium text-gray-800">{chat.name}</p>
        <p className="text-sm text-gray-500">
          {newMessageCount && newMessageCount.count > 0
            ? `${newMessageCount} new message${
                newMessageCount.count > 1 ? "s" : ""
              }`
            : ""}
        </p>
      </div>

      {newMessageCount && newMessageCount.count > 0 && (
        <div className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
          {newMessageCount.count}
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteChat();
        }}
        className="hidden group-hover:flex items-center justify-center w-8 h-8 bg-red-100 text-red-500 rounded-full ml-4"
      >
        ✕
      </button>
    </div>
  );
};

export default ChatItem;
