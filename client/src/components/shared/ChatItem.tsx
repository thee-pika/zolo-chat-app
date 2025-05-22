import React from "react";

interface MessageAlertType {
  chatId: string;
  count: number;
}

interface ChatListProps {
  onlineUsers: string[];
  newMessagesAlert: MessageAlertType;
  handleDeleteChat: () => void;
  avatar: string;
  id: string;
  name: string;
  sameSender: string;
  isOnline: boolean;
  index: number;
}

const ChatItem: React.FC<ChatListProps> = ({
  avatar,
  name,
  id,
  sameSender,
  isOnline,
  newMessagesAlert,
  handleDeleteChat,
}) => {
  const newMessageCount = newMessagesAlert?.chatId === id ? newMessagesAlert.count : 0;

  return (
    <div
      className="flex items-center p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer relative group"
      title={`${name} ${newMessageCount > 0 ? `(${newMessageCount} new messages)` : ""}`}
    >

      <div className="relative">
        <img
          src={avatar}
          alt={`${name}'s avatar`}
          className="w-12 h-12 rounded-full border border-gray-200"
        />
  
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      <div className="ml-4 flex-1">
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">
          {newMessageCount > 0
            ? `${newMessageCount} new message${newMessageCount > 1 ? "s" : ""}`
            : "No new messages"}
        </p>
      </div>

      {newMessageCount > 0 && (
        <div className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
          {newMessageCount}
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
