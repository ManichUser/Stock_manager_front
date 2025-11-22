'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { WSMessage } from "../types/models";

interface WSContextType {
  socket: WebSocket | null;
  lastMessage: WSMessage | null;
}

const WSContext = createContext<WSContextType>({ socket: null, lastMessage: null });

export const WSProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/ws");
    ws.onopen = () => console.log("WebSocket connecté !");
    ws.onmessage = (msg: MessageEvent) => {
      const payload: WSMessage = JSON.parse(msg.data);
      setLastMessage(payload);
    };
    ws.onerror = (err) => console.error("Erreur WS :", err);
    ws.onclose = () => console.log("WebSocket déconnecté");
    setSocket(ws);
    return () => ws.close();
  }, []);

  return (
    <WSContext.Provider value={{ socket, lastMessage }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWS = () => useContext(WSContext);
