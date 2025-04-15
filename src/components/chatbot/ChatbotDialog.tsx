
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Mail } from "lucide-react";
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
            className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg bg-startupia-turquoise hover:bg-startupia-turquoise/90 p-0 flex items-center justify-center z-50"
          >
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] z-50">
          <ChatContent isMobile={true} onClose={() => setOpen(false)} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg bg-startupia-turquoise hover:bg-startupia-turquoise/90 p-0 flex items-center justify-center z-50"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
      <DialogContent className="sm:max-w-[400px] h-[500px] p-0 bg-black border-white/20 overflow-hidden flex flex-col z-50">
        <ChatContent onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

const ChatContent = ({ onClose, isMobile = false }: { onClose: () => void, isMobile?: boolean }) => {
  const { messages, sendMessage, suggestedQuestions } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showContactEmail, setShowContactEmail] = useState(false);
  
  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleTalkToHuman = () => {
    setShowContactEmail(true);
  };

  // Function to format message content with email highlighting
  const formatMessageContent = (content: string) => {
    const emailRegex = /startupia@gowithia\.fr/g;
    if (emailRegex.test(content)) {
      const parts = content.split(emailRegex);
      return (
        <>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < parts.length - 1 && (
                <a 
                  href="mailto:startupia@gowithia.fr" 
                  className="text-startupia-turquoise hover:underline font-medium flex items-center inline-flex"
                >
                  <Mail size={14} className="mr-1" />
                  startupia@gowithia.fr
                </a>
              )}
            </React.Fragment>
          ))}
        </>
      );
    }
    return content;
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
              {message.sender === 'bot' 
                ? formatMessageContent(message.content) 
                : message.content}
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
        
        {showContactEmail ? (
          <div className="mt-6 p-4 bg-white/10 rounded-lg text-center">
            <p className="mb-2 text-white">Contactez-nous à :</p>
            <a 
              href="mailto:startupia@gowithia.fr" 
              className="text-startupia-turquoise hover:underline font-medium flex items-center justify-center"
            >
              <Mail size={18} className="mr-2" />
              startupia@gowithia.fr
            </a>
            <p className="mt-2 text-xs text-white/60">Nous nous engageons à vous répondre dans les 24 heures.</p>
          </div>
        ) : (
          <div className="mt-6">
            <Button
              onClick={handleTalkToHuman}
              variant="outline"
              className="w-full justify-center bg-white/5 hover:bg-white/10"
            >
              <Mail className="mr-2" size={18} />
              Parler à un humain
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
