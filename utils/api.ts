import axios from "axios";
import { getCookie, setCookie } from "./cookies";
import { env } from "next-runtime-env";

// Types for authentication
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  departmentId?: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface LoginCredentials {
  email: string;
}

interface Question {
  id: string;
  text: string;
  departmentId: string;
  knowledgeChunkId: string;
}

interface Department {
  id: string;
  name: string;
  questions: Question[];
}

interface TrackTicketResponse {
  id: string;
  code: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  question: string;
  answer?: string;
}

// Create axios instance
export const api = axios.create({
  baseURL: env("NEXT_PUBLIC_API_URL"),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies handling
});

// Request interceptor to add auth token
// Request interceptor to inject the accessToken from sessionStorage
api.interceptors.request.use(
  async (config) => {
    const accessToken = await getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  async (error) => {
    throw error;
  }
);

// // Response interceptor to handle 401 errors with token refresh
// api.interceptors.response.use(
//   async (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is not 401, or if we've already tried to refresh, reject
//     if (error.response?.status !== 401 || originalRequest._retry) {
//       throw error;
//     }

//     // Check if the 401 is from the refresh endpoint itself
//     if (originalRequest.url === "/auth/guest/refresh") {
//       throw error;
//     }

//     // Mark this request as retried to prevent infinite loops
//     originalRequest._retry = true;

//     try {
//       // Attempt to refresh the token
//       const response = await api.post<{ data: { accessToken: string } }>(
//         "/auth/guest/refresh"
//       );
//       const accessToken = response.data.data.accessToken;
//       await setCookie("accessToken", accessToken);

//       // Retry the original request with the new token
//       return await api(originalRequest);
//     } catch (refreshError) {
//       // If refresh fails (401 or other error), reject with the original error

//       throw error;
//     }
//   }
// );

// Auth service functions
export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<{ data: AuthResponse }>(
      "/auth/guest/login",
      credentials
    );

    // Save token to localStorage
    if (typeof window !== "undefined") {
      setCookie("accessToken", response.data.data.accessToken);
    }

    return response.data.data.user;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/guest/logout");

    // Clear token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  },

  refreshToken: async (): Promise<string> => {
    const response = await api.post<{ data: { accessToken: string } }>(
      "/auth/refresh"
    );
    const newToken = response.data.data.accessToken;

    // Save the new token
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", newToken);
    }

    return newToken;
  },
};

// Chat service functions
export const chatService = {
  ask: async (question: string, conversationId?: string, faqId?: string) => {
    const response = await api.post<{
      data: { answer: string; conversationId: string };
    }>("/chat/ask", {
      question,
      conversationId,
      faqId,
    });
    return response.data.data;
  },

  askGuest: async (
    question: string,
    conversationId?: string,
    faqId?: string
  ) => {
    const response = await api.post("/chat/ask/guest", {
      question,
      conversationId,
      faqId,
    });
    return response.data.data;
  },

  getConversations: async () => {
    const response = await api.get("/chat/conversations");
    return response.data.data;
  },

  getConversationsGuest: async () => {
    const response = await api.get("/chat/conversations/guest");
    return response.data.data;
  },

  getConversation: async (id: string) => {
    const response = await api.get(`/chat/${id}`);
    return response.data.data;
  },

  getConversationGuest: async (id: string) => {
    const response = await api.get(`/chat/${id}/guest`);
    return response.data.data;
  },
};

export const FAQService = {
  getQuestions: async (department?: string) => {
    const response = await api.get<{ data: Question[] }>(
      `/questions${department ? `?departmentId=${department}` : ""}`
    );
    console.log(response);

    return response.data.data;
  },
};

export const departmentService = {
  getDepartments: async () => {
    const response = await api.get<{ data: Department[] }>("/department");
    return response.data.data;
  },
};

export const ticketService = {
  createTicket: async ({
    departmentId,
    question,
  }: {
    departmentId: string;
    question: string;
  }) => {
    const response = await api.post("/tickets", { departmentId, question });

    return response.data.data.ticket;
  },

  createTicketGuest: async ({
    departmentId,
    question,
  }: {
    departmentId: string;
    question: string;
  }) => {
    const response = await api.post("/tickets/guest", {
      departmentId,
      question,
    });

    return response.data.data.ticket;
  },

  trackTicket: async (code: string) => {
    return api
      .get<{ data: TrackTicketResponse }>(`/tickets/${code}`)
      .then((res) => res.data.data);
  },

  trackTicketGuest: async (code: string) => {
    return api
      .get<{ data: TrackTicketResponse }>(`/tickets/${code}/guest`)
      .then((res) => res.data.data);
  },
};

interface AttachmentMetadataResponse {
  data: {
    fileType: string;
    originalName: string;
    sizeInBytes: number;
    expiryDate: string;
    contentType: string;
  };
}

export const AttachmentService = {
  getAttachmentMetadata: async (tokenOrId: string) => {
    const res = await api.get<AttachmentMetadataResponse>(
      `/attachment/${tokenOrId}/metadata`
    );
    return res.data.data;
  },
};

export default api;
