import ky from "ky";
import { env } from "next-runtime-env";
import { SupportTicketClient } from "./services/tickets";

const client = ky.create({
  prefixUrl: env("NEXT_PUBLIC_API_URL"),
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important for cookies handling
});

export const SupportTicketService = new SupportTicketClient(client);
