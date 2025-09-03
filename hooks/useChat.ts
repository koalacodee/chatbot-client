import { useState, useEffect, useCallback } from "react";
import { chatService } from "../utils/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// AskDto interface matching backend DTO
interface AskDto {
  question: string;
  conversationId?: string;
  faqId?: string;
}

// Backend API interfaces matching exact response format
interface ApiMessage {
  id: string;
  conversationId?: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiConversation {
  id: string;
  userId?: string;
  guestId?: string;
  startedAt: string;
  endedAt?: string;
  messages: ApiMessage[];
  retrievedChunks: any[];
}

// Frontend UI interfaces (maintaining compatibility)
interface Message {
  id: string;
  conversationId?: string;
  role: "user" | "bot";
  content: string;
  createdAt: string;
  updatedAt: string;
  // UI compatibility fields
  text: string;
  sender: "user" | "bot";
  avatar: string;
}

interface Conversation {
  id: string;
  userId?: string;
  guestId?: string;
  startedAt: string;
  endedAt?: string;
  messages: Message[];
  retrievedChunks: any[];
  title?: string;
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status and load conversation ID from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };
    checkAuth();

    // Load conversation ID from localStorage on mount
    const savedConversationId = localStorage.getItem("conversationId");
    if (savedConversationId) {
      setConversationId(savedConversationId);
    }

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Transform API message to UI message format
  const transformApiMessageToUIMessage = (apiMessage: ApiMessage): Message => ({
    id: apiMessage.id,
    conversationId: apiMessage.conversationId,
    role: apiMessage.role === "USER" ? "user" : "bot",
    content: apiMessage.content,
    createdAt: apiMessage.createdAt,
    updatedAt: apiMessage.updatedAt,
    text: apiMessage.content,
    sender: apiMessage.role === "USER" ? "user" : "bot",
    avatar:
      apiMessage.role === "USER"
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCaLzWfDsZtTMcOiftXOzSSn4PiGn7zELOdkXLlX-VGt2cbvj-rrXqxXtwHa5jYMa7rM54OLjTrpTDNLpU87Ynnk_82u4-p1-b7NXgjb_PXJ6sWKOIGjgM_zYE9W2uVz8Ai6aCBLqWhqKGkBnXKf6bUfVMBPKaBRqMEfzfU-qWngHn2p1pYqLQ7LIln174jcxIpODO9NKmDYuc_JLkrmuYKqbOMl3NWQSSXp1rXP-2nkN0E8T7S2dUhBqmpmJ5tueJa4ZLVcbezK9SX"
        : "https://lh3.googleusercontent.com/aida-public/AB6AXuBgKlv7ixfo9vzS_21DuHmQDCjiiAvASKEkIVNjEvzLnLL3D7zpA55mPPU2P-x4zyx9aLxXdhuXHzpqNad8Lf0Vn2xd_lYCi5GTwlguXB0Wr__Z-S-PdB_dU394TZKHA9qAARLdFWzwS8H989z2Rz33ZxpF0iPzV9v5DB1TQ6iCO0m77fNkH7M74bEyuZn9ySp1Knf-SQxs1Ovw2OtK5Ttc3i7LxQk89LLPDit4QxhjQGkKK-8M54GisGi8tOXNoUEyyNhOUokCojVf",
  });

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const data: ApiConversation[] = await chatService.getConversations();
        const uiConversations = (data || []).map((apiConversation) => ({
          ...apiConversation,
          messages: apiConversation.messages.map(
            transformApiMessageToUIMessage
          ),
        }));
        setConversations(uiConversations);

        if (data && data.length > 0) {
          await fetchConversationDetails(data[0].id);
        } else {
          await createNewConversation();
        }
      } else {
        const data: ApiConversation[] =
          await chatService.getConversationsGuest();
        const uiConversations = (data || []).map((apiConversation) => ({
          ...apiConversation,
          messages: apiConversation.messages.map(
            transformApiMessageToUIMessage
          ),
        }));
        setConversations(uiConversations);

        console.log(data);

        if (data && data.length > 0) {
          await fetchConversationDetails(data[0].id);
        } else {
          await createNewConversation();
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchConversationDetails = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const data: ApiConversation = isAuthenticated
          ? await chatService.getConversation(id)
          : await chatService.getConversationGuest(id);

        console.log(data);

        const uiConversation = {
          ...data,
          messages: data.messages.map(transformApiMessageToUIMessage),
        };
        setCurrentConversation(uiConversation);
        setConversationId(id);
        setMessages(uiConversation.messages);

        // Save conversation ID to localStorage
        localStorage.setItem("conversationId", id);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 403) {
            localStorage.removeItem("conversationId");
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const createNewConversation = async () => {
    setMessages([]);
    setConversationId(null);
    setCurrentConversation(null);
    localStorage.removeItem("conversationId");
  };

  // Add new state for modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [pendingTicketCode, setPendingTicketCode] = useState<
    string | undefined
  >();

  // Add new state
  const [isTyping, setIsTyping] = useState(false);

  // Update sendMessage function
  const sendMessage = useCallback(
    async (message: string, faqId?: string) => {
      try {
        setIsTyping(true); // Start typing indicator
        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          text: message,
          sender: "user",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCaLzWfDsZtTMcOiftXOzSSn4PiGn7zELOdkXLlX-VGt2cbvj-rrXqxXtwHa5jYMa7rM54OLjTrpTDNLpU87Ynnk_82u4-p1-b7NXgjb_PXJ6sWKOIGjgM_zYE9W2uVz8Ai6aCBLqWhqKGkBnXKf6bUfVMBPKaBRqMEfzfU-qWngHn2p1pYqLQ7LIln174jcxIpODO9NKmDYuc_JLkrmuYKqbOMl3NWQSSXp1rXP-2nkN0E8T7S2dUhBqmpmJ5tueJa4ZLVcbezK9SX",
        };

        setMessages((prev) => [...prev, userMessage]);

        const askDto: AskDto = {
          question: message,
          conversationId: conversationId || undefined,
          faqId: faqId || undefined,
        };

        // Simulate typing delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = isAuthenticated
          ? await chatService.ask(
              askDto.question,
              askDto.conversationId,
              askDto.faqId
            )
          : await chatService.askGuest(
              askDto.question,
              askDto.conversationId,
              askDto.faqId
            );

        setIsTyping(false); // Stop typing indicator

        if (response.ticket) {
          setPendingTicketCode(response.ticket);
          setShowTicketModal(true);
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: response.answer || "Response received",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          text: response.answer || "Response received",
          sender: "bot",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAGvKjyp-rb03_BvEKUZ4Hi51GAD10BOYDvU1DR6lznHmx1LmDtj_xSWM0aW7lk4f0vHqxn_gXHB7Fh0Un29FKzkI8XnRhcKhy6g3sv3PjeAuO5ngfMBshvvm8Cb_pWau5PASH1WRuYiTYFn1jsX26F_K1XYOU443MWj4pX7-5971IbxjoaekbzQJNNciB0hWtFlNkE6KrUNwKYhFL4AEjfT37mnRIPCbtecytWjmB81hgG-cs12T61_jaOzeuKLrvGPdae_hDygPJM",
        };

        setMessages((prev) => [...prev, botMessage]);

        if (!conversationId && response.conversationId) {
          setConversationId(response.conversationId);
          localStorage.setItem("conversationId", response.conversationId);
        }
      } catch (error) {
        setIsTyping(false); // Stop typing indicator on error
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: "bot",
          content: "Sorry, I'm having trouble connecting. Please try again.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          text: "Sorry, I'm having trouble connecting. Please try again.",
          sender: "bot",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAGvKjyp-rb03_BvEKUZ4Hi51GAD10BOYDvU1DR6lznHmx1LmDtj_xSWM0aW7lk4f0vHqxn_gXHB7Fh0Un29FKzkI8XnRhcKhy6g3sv3PjeAuO5ngfMBshvvm8Cb_pWau5PASH1WRuYiTYFn1jsX26F_K1XYOU443MWj4pX7-5971IbxjoaekbzQJNNciB0hWtFlNkE6KrUNwKYhFL4AEjfT37mnRIPCbtecytWjmB81hgG-cs12T61_jaOzeuKLrvGPdae_hDygPJM",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    },
    [isAuthenticated, conversationId]
  );

  // Initialize on mount - load saved conversation if exists
  useEffect(() => {
    const initializeChat = async () => {
      const savedConversationId = localStorage.getItem("conversationId");
      if (savedConversationId) {
        await fetchConversationDetails(savedConversationId);
      } else {
        await fetchConversations();
      }
    };

    initializeChat();
  }, []);

  // Add modal handlers
  const handleCreateTicket = () => {
    setShowTicketModal(false);
    router.push("/create-ticket");
  };

  const handleCancelTicket = () => {
    setShowTicketModal(false);
    setPendingTicketCode(undefined);
  };

  // Update return object
  return {
    conversations,
    currentConversation,
    messages,
    loading,
    isAuthenticated,
    conversationId,
    isTyping, // Add this
    sendMessage,
    fetchConversationDetails,
    createNewConversation,
    showTicketModal,
    pendingTicketCode,
    handleCreateTicket,
    handleCancelTicket,
  };
};
