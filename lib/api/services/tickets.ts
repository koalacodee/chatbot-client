// support-ticket-client.ts
import ky from "ky";
import { JSendResponse } from "../jsend";

interface CreateSupportTicketRequest {
  subject: string;
  description: string;
  departmentId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  attach?: boolean;
  chooseAttachments?: string[];
}

interface CreateSupportTicketResponse {
  message: string;
  ticketId: string;
  verificationEmailSent: boolean;
}

interface VerifySupportTicketRequest {
  code: string; // 6-digit verification code
}

interface VerifySupportTicketResponse {
  ticket: {
    id: string;
    subject: string;
    description: string;
    departmentId: string;
    status: string;
    code: string;
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  uploadKey?: string;
  fileHubUploadKey?: string;
}

interface TrackTicketResponse {
  ticket: {
    id: string;
    subject: string;
    description: string;
    departmentId: string;
    status: string;
    code: string;
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    createdAt: string;
    updatedAt: string;
  };
  answers: Array<{
    id: string;
    supportTicketId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }>;
  fileHubAttachments: Array<{
    originalName: string;
    filename: string;
    fileType: string; // Extension of the file
    size: number;
    isGlobal: boolean;
    expirationDate?: string | null;
    createdAt: string;
    signedUrl?: string;
    id: string;
    targetId?: string;
    userId?: string;
  }>;
  isRated: boolean;
}

interface RecordInteractionResponse {
  interaction: {
    id: string;
    supportTicketId: string;
    guestId: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
}

class SupportTicketClient {
  private client: typeof ky;

  constructor(client: typeof ky) {
    this.client = client;
  }

  /**
   * Create a support ticket with email verification
   * POST /support-tickets
   */
  async createWithVerification(
    data: CreateSupportTicketRequest
  ): Promise<JSendResponse<CreateSupportTicketResponse>> {
    const response = await this.client.post<
      JSendResponse<CreateSupportTicketResponse>
    >("support-tickets", {
      json: data,
    });
    return response.json();
  }

  /**
   * Verify support ticket with 6-digit code
   * POST /support-tickets/verify
   */
  async verifyTicket(
    data: VerifySupportTicketRequest
  ): Promise<JSendResponse<VerifySupportTicketResponse>> {
    const response = await this.client.post<
      JSendResponse<VerifySupportTicketResponse>
    >("support-tickets/verify", {
      json: { code: data.code },
    });
    return response.json();
  }

  /**
   * Track a ticket by code
   * GET /support-tickets/track/:code
   */
  async trackTicket(
    code: string,
    guestId?: string
  ): Promise<JSendResponse<TrackTicketResponse>> {
    const client = guestId
      ? this.client.extend({
          headers: { "x-guest-id": guestId },
        })
      : this.client;

    const response = await client.get<JSendResponse<TrackTicketResponse>>(
      `support-tickets/track/${code}`
    );
    return response.json();
  }

  /**
   * Record support ticket interaction (RATED or VIEWED)
   * POST /support-tickets/:type/:ticketId
   */
  async recordInteraction(
    type: "RATED" | "VIEWED",
    ticketId: string,
    guestId?: string
  ): Promise<JSendResponse<RecordInteractionResponse | null>> {
    const client = guestId
      ? this.client.extend({
          headers: { "x-guest-id": guestId },
        })
      : this.client;

    const response = await client.post<
      JSendResponse<RecordInteractionResponse>
    >(`support-tickets/${type.toLowerCase()}/${ticketId}`);
    return response.json();
  }
}

export { SupportTicketClient };
export type {
  CreateSupportTicketRequest,
  CreateSupportTicketResponse,
  VerifySupportTicketRequest,
  VerifySupportTicketResponse,
  TrackTicketResponse,
  RecordInteractionResponse,
};
