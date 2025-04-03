import React, { useState, useEffect } from 'react';
import Chatbot from './Chatbot';
import RobotIcon from './RobotIcon';
import './FloatingAIAssistant.css';

const FloatingAIAssistant = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('FloatingAIAssistant mounted with userId:', userId);
  }, [userId]);

  if (!userId) {
    console.log('No userId provided to FloatingAIAssistant');
    return null;
  }

  return (
    <div className="floating-ai-container">
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-popup-header">
            <h3>AI Assistant</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <Chatbot userId={userId} />
        </div>
      )}
      <button 
        className="floating-ai-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <RobotIcon />
        <span className="ai-label">AI Assistant</span>
      </button>
    </div>
  );
};

export default FloatingAIAssistant; 