import { create } from "zustand";

interface Message {
  id: string;
  text: string;
  avatar: string;
  sender: "user" | "bot";
  timestamp?: string;
}
interface MessageStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  updateMessage: (id: string, message: Message) => void;
  getMessage: (id: string) => Message | undefined;
  getMessages: () => Message[];
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
  setMessage: (id: string, message: Message) => void;
  setMessageText: (id: string, text: string) => void;
  appendMessageText: (id: string, text: string) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  addMessage: (message: Message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  removeMessage: (id: string) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
  updateMessage: (id: string, message: Message) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? message : message
      ),
    })),
  getMessage: (id: string) =>
    get().messages.find((message) => message.id === id),
  getMessages: () => get().messages,
  clearMessages: () => set({ messages: [] }),
  setMessages: (messages: Message[]) => set({ messages }),
  setMessage: (id: string, message: Message) =>
    set((state) => ({
      messages: get().messages.map((message) =>
        message.id === id ? message : message
      ),
    })),
  setMessageText: (id: string, text: string) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, text } : message
      ),
    })),
  appendMessageText: (id: string, text: string) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, text: message.text + text } : message
      ),
    })),
}));
