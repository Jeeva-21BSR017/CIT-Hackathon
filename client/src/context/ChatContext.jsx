
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./UserContext";

const ChatContext = createContext({
  publicMessages: [],
  privateMessages: {},
  sendPublicMessage: () => {},
  sendPrivateMessage: () => {}
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser, users } = useUserContext();
  const [publicMessages, setPublicMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});

  // Mock initial data
  useEffect(() => {
    if (!currentUser) return;

    // Mock public messages
    const mockPublicMessages = [
      {
        id: "msg1",
        senderId: "67cbfd4d8c5234d5c16a561a",
        sender: users.find(u => u._id === "67cbfd4d8c5234d5c16a561a") || users[0],
        content: "Has anyone worked with React Query? I'm having some issues with caching.",
        timestamp: new Date(Date.now() - 3600000 * 2),
        isPublic: true
      },
      {
        id: "msg2",
        senderId: "67cbfd4d8c5234d5c16a562b",
        sender: users.find(u => u._id === "67cbfd4d8c5234d5c16a562b") || users[1],
        content: "I'll be hosting a workshop on UI/UX design principles this weekend. Anyone interested?",
        timestamp: new Date(Date.now() - 3600000),
        isPublic: true
      },
      {
        id: "msg3",
        senderId: "67cbfd4d8c5234d5c16a563c",
        sender: users.find(u => u._id === "67cbfd4d8c5234d5c16a563c") || users[2],
        content: "Looking for group members for the upcoming hackathon. DM if interested!",
        timestamp: new Date(Date.now() - 1800000),
        isPublic: true
      }
    ];

    setPublicMessages(mockPublicMessages);
  }, [currentUser, users]);

  const sendPublicMessage = (content) => {
    if (!currentUser || !content.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser._id,
      sender: currentUser,
      content,
      timestamp: new Date(),
      isPublic: true
    };

    setPublicMessages(prev => [...prev, newMessage]);
  };

  const sendPrivateMessage = (content, receiverId) => {
    if (!currentUser || !content.trim()) return;

    const newMessage = {
      id: `msg_priv_${Date.now()}`,
      senderId: currentUser._id,
      sender: currentUser,
      content,
      timestamp: new Date(),
      isPublic: false,
      receiverId
    };

    // Get the conversation ID (combination of the two user IDs)
    const conversationId = [currentUser._id, receiverId].sort().join('_');

    setPrivateMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        publicMessages,
        privateMessages,
        sendPublicMessage,
        sendPrivateMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
