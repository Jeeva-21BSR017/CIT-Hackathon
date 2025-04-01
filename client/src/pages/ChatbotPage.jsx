import React from 'react';
import Chatbot from '../components/Chatbot';

const ChatbotPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Assistant</h1>
      <Chatbot />
    </div>
  );
};

export default ChatbotPage; 