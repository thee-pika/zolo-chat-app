import { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

type SocketType = Socket | null;
const SocketContext = createContext<SocketType>(null);

const useSocket = (): Socket => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error(
      "Socket is not initialized. Please wrap your component with <SocketProvider>."
    );
  }
  return socket;
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useMemo(() => io(`${import.meta.env.VITE_BACKEND_URL}`), []);
  console.log("socket connected  ...........", socket);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
