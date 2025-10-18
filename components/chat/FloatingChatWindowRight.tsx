"use client";
import { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import { MessageCircle, X } from "lucide-react";
import { chatService } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChatWindowRight() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; avatar: string; sender: "user" | "bot" }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSend = async (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message,
        sender: "user",
        avatar: "/user.svg",
      },
    ]);
    setIsLoading(true);
    const response = await chatService.ask(message);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: response.answer,
        avatar: "/assistant.svg",
        sender: "bot",
      },
    ]);
    setIsLoading(false);
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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary via-primary/90 to-secondary/80 text-primary-foreground rounded-full shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background group"
            aria-label="Open chat"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                whileHover={{ rotate: 12 }}
                transition={{ duration: 0.2 }}
                className="transition-all duration-300"
              >
                <MessageCircle className="w-8 h-8" />
              </motion.div>
              {messages.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-destructive to-orange-500 rounded-full animate-bounce shadow-lg shadow-destructive/50"
                >
                  <span className="absolute inset-0 rounded-full bg-destructive animate-ping" />
                </motion.span>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window - Bottom Right */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 transition-opacity duration-300 overflow-y-auto"
              onClick={handleOverlayClick}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-6 right-6 z-40"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-card/95 backdrop-blur-xl border border-border/30 rounded-2xl shadow-2xl shadow-primary/10 w-[550px] h-[750px] flex flex-col overflow-hidden"
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-gradient-to-r from-primary/20 via-secondary/15 to-accent/20 border-b border-border/20 px-6 py-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative"
                    >
                      <div className="w-4 h-4 bg-success rounded-full shadow-lg shadow-success/50" />
                      <div className="absolute inset-0 w-4 h-4 bg-success rounded-full animate-ping" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-card-foreground">
                        AI Assistant
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Ready to assist you 24/7
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="text-muted-foreground hover:text-card-foreground transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>

                {/* Chat Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <ChatHistory
                    messages={messages}
                    onSendMessage={handleSend}
                    isLoading={isLoading}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
