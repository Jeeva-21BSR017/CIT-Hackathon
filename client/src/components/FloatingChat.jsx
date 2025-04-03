import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Bot, Send, X } from 'lucide-react';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:9000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.reply) {
        throw new Error('No reply received from the server');
      }

      const botMessage = { text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-96 h-[500px] flex flex-col shadow-lg backdrop-blur-lg bg-white/30 border border-white/20">
              <div className="p-4 border-b border-white/20 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">AI Assistant</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary/80 text-white backdrop-blur-sm'
                          : 'bg-white/20 text-gray-800 backdrop-blur-sm'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-left mb-4">
                    <div className="inline-block p-3 rounded-lg bg-white/20 text-gray-800 backdrop-blur-sm">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>
              <div className="p-4 border-t border-white/20 flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="bg-white/20 text-gray-800 placeholder:text-gray-500 border-white/20 focus:border-white/40"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-primary/80 hover:bg-primary/90 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="cursor-pointer"
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-primary/80 hover:bg-primary/90 backdrop-blur-sm border border-white/20"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bot className="h-6 w-6 animate-pulse text-white" />
        </Button>
      </motion.div>
    </div>
  );
};

export default FloatingChat; 