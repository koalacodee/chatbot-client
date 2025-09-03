import React, { useState, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your question here...",
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || disabled || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const isDisabled = disabled || isSending;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative flex items-center gap-2 p-4 bg-card border-border">
        <div className="flex-1 relative flex items-center">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={isDisabled}
            className={cn(
              "w-full min-h-[40px] max-h-[120px] px-6 py-2",
              "bg-background border border-input rounded-lg",
              "text-sm text-foreground",
              "placeholder:text-muted-foreground/50 placeholder:italic",
              "resize-none",
              "transition-height duration-300 ease-in-out",
              "outline-none",
              "border-opacity-40 hover:border-opacity-100",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            )}
            rows={1}
            aria-label="Message input"
            maxLength={1000}
          />
          <div className="absolute right-2 bottom-1.5 text-xs text-muted-foreground">
            {message.length}/1000
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={isDisabled || !message.trim()}
          className={cn(
            "flex items-center justify-center",
            "w-10 h-10 rounded-lg",
            "bg-blue-600 text-white",
            "hover:bg-blue-700 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "shadow-sm hover:shadow-md",
            "self-end mb-[6px]"
          )}
          aria-label="Send message"
        >
          {isSending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
