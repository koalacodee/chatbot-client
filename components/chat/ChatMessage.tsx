import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
// Add isLoading prop support for existing implementation
interface ChatMessageProps {
  message: string;
  sender: "user" | "bot";
  avatar: string;
  timestamp?: string;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sender,
  avatar,
  timestamp,
  isLoading = false,
}) => {
  const isUser = sender === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 group animate-in fade-in slide-in-from-bottom-2 duration-300",
        "transition-colors duration-200",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className="flex-shrink-0">
        <img
          src={avatar}
          alt={`${sender} avatar`}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
          loading="lazy"
        />
      </div>

      <div
        className={cn(
          "flex flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {isUser ? "You" : "Assistant"}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground/70">
              {new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <div
          className={cn(
            "max-w-lg px-5 py-3 rounded-2xl",
            "text-sm leading-relaxed shadow-sm",
            "transition-all duration-300 hover:shadow-md",
            isUser
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md shadow-primary/20"
              : "bg-gradient-to-br from-muted to-muted/90 text-foreground rounded-bl-md shadow-muted/20",
            isLoading && "animate-pulse"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
