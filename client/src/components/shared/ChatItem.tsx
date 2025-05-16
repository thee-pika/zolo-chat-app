

const ChatItem = ({
    w = "100%",
    chats = [],
    chatId,
    onlineUsers = [],
    newMessageAlert = [
        {
            chatId: "",
            count: 0
        }
    ],
    handleDeleteChat,
}) => {
  return (
    <div>
      {
        chats.map((data) => {
            return <div>{data}</div>
        })
      }
    </div>
  )
}

export default ChatItem
