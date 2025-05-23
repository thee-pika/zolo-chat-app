import { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

type SocketType = Socket | null;
const SocketContext = createContext<SocketType>(null);

const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useMemo(() => io(`${import.meta.env.VITE_BACKEND_URL}`), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
