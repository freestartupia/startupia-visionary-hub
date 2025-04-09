
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useChatbot } from '@/hooks/use-chatbot';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-mobile';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export const ChatbotButton = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { hasInitialMessage } = useChatbot();
  
  useEffect(() => {
    if (hasInitialMessage && !open) {
      setUnreadCount(1);
    }
  }, [hasInitialMessage, open]);
  
  const handleOpen = () => {
    setOpen(true);
    setUnreadCount(0);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button 
            onClick={handleOpen}
            className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg bg-startupia-turquoise hover:bg-startupia-turquoise/90 p-0 flex items-center justify-center"
          >
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85vh]">
          <ChatContent isMobile={true} onClose={() => setOpen(false)} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg bg-startupia-turquoise hover:bg-startupia-turquoise/90 p-0 flex items-center justify-center"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
      <DialogContent className="sm:max-w-[400px] h-[500px] p-0 bg-black border-white/20 overflow-hidden flex flex-col">
        <ChatContent onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

const ChatContent = ({ onClose, isMobile = false }: { onClose: () => void, isMobile?: boolean }) => {
  const { messages, sendMessage, suggestedQuestions } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={cn("flex flex-col h-full", isMobile ? "p-0" : "")}>
      <div className="flex items-center justify-between border-b border-white/10 bg-black p-4">
        <div className="flex items-center">
          <MessageCircle size={20} className="mr-2 text-startupia-turquoise" />
          <h2 className="text-lg font-semibold">Assistant Startupia</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-xl p-3",
                message.sender === 'user'
                  ? "bg-startupia-turquoise/90 text-white"
                  : "bg-white/10 text-white"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {messages.length === 1 && suggestedQuestions.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-white/60">Questions fréquentes :</p>
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start bg-white/5 hover:bg-white/10 text-left"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question..."
            className="bg-black/30 border-white/20"
          />
          <Button
            onClick={handleSend}
            className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 p-2"
            disabled={!inputValue.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
