"use client";
import { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import { MessageCircle } from "lucide-react";

interface FloatingChatWindowProps {
  onSendMessage: (message: string) => void;
  messages?: Array<{
    id: string;
    text: string;
    avatar: string;
    sender: "user" | "bot";
  }>;
  isTyping?: boolean;
}

export default function FloatingChatWindow({
  onSendMessage,
  messages = [],
  isTyping = false,
}: FloatingChatWindowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 left-4 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6 transition-all duration-300" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
          )}
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 left-4 z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-card border border-border rounded-lg shadow-xl w-80 h-96 flex flex-col overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="bg-primary/10 border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <h3 className="text-sm font-medium text-card-foreground">Chat Support</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-muted-foreground hover:text-card-foreground transition-colors"
              aria-label="Close chat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <ChatHistory
              messages={messages}
              onSendMessage={onSendMessage}
              isTyping={isTyping}
            />
          </div>
        </div>
      </div>
    </>
  );
}
