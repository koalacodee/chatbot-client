"use client";
import React from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  text: string;
  avatar: string;
  sender: "user" | "bot";
}

interface ChatHistoryProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

export default function ChatHistory({
  messages,
  onSendMessage,
  isTyping = false,
}: ChatHistoryProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-muted"></div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Start a conversation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ask me anything about our services or support
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
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>
      </div>

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-4xl p-4">
          <ChatInput onSendMessage={onSendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}
