
// import React, { useState, useRef, useEffect } from "react";
// import { useChatContext } from "@/context/ChatContext";
// import { useUserContext } from "@/context/UserContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Send } from "lucide-react";
// import { cn } from "@/lib/utils";

// const PublicChat = () => {
//   const { publicMessages, sendPublicMessage } = useChatContext();
//   const { currentUser } = useUserContext();
//   const [message, setMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom whenever messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [publicMessages]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (message.trim() && currentUser) {
//       sendPublicMessage(message);
//       setMessage("");
//     }
//   };

//   // Format timestamp
//   const formatTime = (date) => {
//     return new Intl.DateTimeFormat("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(date);
//   };

//   // Get initials for avatar
//   const getInitials = (name) => {
//     return name
//       .split(" ")
//       .map(part => part[0])
//       .join("")
//       .toUpperCase();
//   };

//   return (
//     <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-lg shadow-sm border border-gray-100">
//       <div className="p-4 border-b">
//         <h2 className="text-lg font-semibold">Public Chat</h2>
//         <p className="text-sm text-gray-500">Chat with the entire community</p>
//       </div>

//       <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
//         {publicMessages.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-center">
//             <div className="bg-blue-100 p-4 rounded-full mb-3">
//               <Send className="h-6 w-6 text-blue-600" />
//             </div>
//             <p className="text-gray-500 font-medium">Start the conversation</p>
//             <p className="text-gray-400 text-sm mt-1">Be the first to send a message</p>
//           </div>
//         ) : (
//           publicMessages.map((msg) => (
//             <div 
//               key={msg.id} 
//               className={`flex mb-4 ${msg.senderId === currentUser?._id ? 'justify-end' : 'justify-start'}`}
//             >
//               {msg.senderId !== currentUser?._id && (
//                 <div className={cn(
//                   "rounded-full h-8 w-8 flex items-center justify-center text-white font-medium text-sm mr-2",
//                   "bg-gradient-to-br from-blue-500 to-violet-500"
//                 )}>
//                   {getInitials(msg.sender.fullName)}
//                 </div>
//               )}

//               <div 
//                 className={`max-w-xs sm:max-w-md rounded-lg px-4 py-2 ${
//                   msg.senderId === currentUser?._id 
//                     ? 'bg-blue-500 text-white rounded-tr-none' 
//                     : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
//                 }`}
//               >
//                 {msg.senderId !== currentUser?._id && (
//                   <p className="font-medium text-xs mb-1">
//                     {msg.sender.fullName}
//                   </p>
//                 )}
//                 <p>{msg.content}</p>
//                 <p className={`text-xs mt-1 ${
//                   msg.senderId === currentUser?._id ? 'text-blue-100' : 'text-gray-500'
//                 }`}>
//                   {formatTime(msg.timestamp)}
//                 </p>
//               </div>

//               {msg.senderId === currentUser?._id && (
//                 <div className={cn(
//                   "rounded-full h-8 w-8 flex items-center justify-center text-white font-medium text-sm ml-2",
//                   "bg-gradient-to-br from-blue-500 to-violet-500"
//                 )}>
//                   {getInitials(currentUser.fullName)}
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
//         <div className="flex items-center">
//           <Input
//             type="text"
//             placeholder="Type your message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="flex-grow"
//           />
//           <Button 
//             type="submit" 
//             className="ml-2 bg-blue-500 hover:bg-blue-600 transition-colors"
//             disabled={!message.trim()}
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PublicChat;


// src/components/community/PublicChat.js
// import React, { useState } from "react";

// const PublicChat = ({ messages, onSendMessage }) => {
//   const [newMessage, setNewMessage] = useState("");

//   const handleSend = () => {
//     if (newMessage.trim()) {
//       onSendMessage(newMessage);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//       <div className="space-y-4">
//         {messages.map((message, index) => (
//           <div key={index} className="p-4 bg-gray-50 rounded-lg">
//             <p>{message.text}</p>
//             <p className="text-xs text-gray-500">{message.user}</p>
//           </div>
//         ))}
//       </div>
//       <div className="mt-4 flex gap-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-1 p-2 border rounded-lg"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-500 text-white p-2 rounded-lg"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PublicChat;


import React, { useState } from "react";

const PublicChat = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <p>{message.message}</p>
            <p className="text-xs text-gray-500">{message.user.name}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PublicChat;
