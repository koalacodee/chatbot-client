"use client";
import { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import { MessageCircle, X } from "lucide-react";

export default function FloatingChatWindowRight() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; avatar: string; sender: "user" | "bot" }>
  >([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <>
      {/* Toggle Button - Bottom Right */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 w-13 h-13 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Open chat"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="transition-all duration-300">
              <MessageCircle className="w-7 h-7" />
            </div>
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-bounce">
                <span className="absolute inset-0 rounded-full bg-destructive animate-ping" />
              </span>
            )}
          </div>
        </button>
      )}

      {/* Chat Window - Bottom Right */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-30 transition-opacity duration-300"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
          <div className="fixed bottom-6 right-6 z-40 transition-all duration-300 ease-in-out">
            <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl w-[430px] h-[550px] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/30 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-card-foreground">
                      AI Assistant
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Always here to help
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-card-foreground transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 flex flex-col">
                <ChatHistory messages={messages} onSendMessage={() => {}} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
