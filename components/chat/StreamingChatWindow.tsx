"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalesStore } from "@/app/store/useLocalesStore";
import { chatService } from "@/utils/api";
import { useMessageStore } from "@/app/store/useMessageStore";

interface Message {
  id: string;
  text: string;
  avatar: string;
  sender: "user" | "bot";
  timestamp?: string;
}

interface SSEEvent {
  type: "message" | "conversation_meta";
  data: string | { conversationId: string };
}

export default function StreamingChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentBotMessage, setCurrentBotMessage] = useState<string>("");
  const [currentBotMessageId, setCurrentBotMessageId] = useState<string | null>(
    null
  );

  const locales = useLocalesStore((state) => state.locales);
  const { addMessage, messages, setMessageText } = useMessageStore();

  const eventSourceRef = useRef<EventSource | null>(null);
  const currentBotMessageRef = useRef("");

  useEffect(() => {
    currentBotMessageRef.current = currentBotMessage;
    if (currentBotMessageId) {
      setMessageText(currentBotMessageId, currentBotMessage);
    }
  }, [currentBotMessage, currentBotMessageId]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log("currentBotMessage changed:", currentBotMessage);
  }, [currentBotMessage]);

  useEffect(() => {
    console.log("isLoading changed:", isLoading);
  }, [isLoading]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Close any open SSE connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSSEStream = (message: string) => {
    // Create a new bot message if it doesn't exist
    console.log("Received message chunk:", message);
    setCurrentBotMessage((prev) => prev + message);
  };

  const handleDone = () => {
    console.log("DONEEE", currentBotMessageRef.current);

    const messageId = `final-${Date.now()}-${Math.random()}`;
    addMessage({
      id: messageId,
      text: currentBotMessageRef.current,
      sender: "bot",
      avatar: "/assistant.svg",
      timestamp: new Date().toISOString(),
    });
    setCurrentBotMessageId(messageId);
  };

  const handleConversationMeta = (data: { conversationId: string }) => {
    console.log("Received conversation meta:", data);
    setConversationId(data.conversationId);

    setIsLoading(false);
  };

  const handleSend = async (message: string) => {
    setCurrentBotMessage("");
    currentBotMessageRef.current = "";
    setCurrentBotMessageId(null);
    addMessage({
      id: Date.now().toString(),
      text: message,
      sender: "user",
      avatar: "/user.svg",
      timestamp: new Date().toISOString(),
    });

    setIsLoading(true);

    try {
      const response = await chatService.chat({
        question: message,
        conversationId: conversationId || undefined,
      });

      const stream = response.data as ReadableStream<Uint8Array>;
      const reader = stream.getReader(); // ← lock the stream
      const decoder = new TextDecoder(); // reusable UTF-8 decoder
      let buffer = ""; // leftover from previous chunk

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break; // stream finished cleanly

          buffer += decoder.decode(value, { stream: true }); // keep partial lines
          const lines = buffer.split("\n");
          buffer = lines.pop()!; // last item may be incomplete

          for (const raw of lines) {
            const line = raw.trim();
            if (line.startsWith("data: ")) {
              try {
                const payload = JSON.parse(line.slice(6)); // remove "data: "
                console.log(payload);

                if (payload.type == "message") {
                  handleSSEStream(payload.data);
                } else if (payload.type == "conversation_meta") {
                  handleConversationMeta(payload.data);
                } else if (payload.data == "[DONE]") {
                  // handleDone();
                }
              } catch (parseErr) {
                console.warn("Bad JSON in SSE line:", line, parseErr);
              }
            }
          }
        }

        // ---- stream ended ----
        setIsLoading(false);
      } finally {
        reader.releaseLock(); // always unlock
        console.log("Stream ended");
        handleDone();
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      setIsLoading(false);
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

  // Cleanup SSE connection on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

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
                        {locales.ui?.ai_assistant || "AI Assistant"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {locales.ui?.ready_to_assist ||
                          "Ready to assist you 24/7"}
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
                  <StreamingChatHistory
                    messages={messages}
                    onSendMessage={handleSend}
                    isLoading={isLoading}
                    currentBotMessage={currentBotMessage}
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

// Custom ChatHistory component for streaming
interface StreamingChatHistoryProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  currentBotMessage: string;
}

function StreamingChatHistory({
  messages,
  onSendMessage,
  isLoading,
  currentBotMessage,
}: StreamingChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const locales = useLocalesStore((state) => state.locales);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, currentBotMessage]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-muted"></div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {locales.ui?.start_conversation || "Start a conversation"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locales.ui?.ask_anything ||
                    "Ask me anything about our services or support"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  {...message}
                  isLoading={false}
                />
              ))}
              {/* Show streaming message */}
              {isLoading && currentBotMessage && (
                <>
                  {console.log(
                    "Rendering streaming message:",
                    currentBotMessage
                  )}
                  <ChatMessage
                    message={currentBotMessage}
                    sender="bot"
                    avatar="/assistant.svg"
                    timestamp={new Date().toISOString()}
                    isLoading={false}
                  />
                </>
              )}
              {/* Show typing indicator when no current message */}
              {isLoading && !currentBotMessage && <TypingIndicator />}
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/20">
        <div className="mx-auto max-w-4xl p-4">
          <ChatInput
            onSendMessage={onSendMessage}
            disabled={isLoading}
            placeholder={
              locales.ui?.type_question || "Type your question here..."
            }
          />
        </div>
      </div>
    </div>
  );
}
