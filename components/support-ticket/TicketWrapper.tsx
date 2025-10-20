"use client";
import TicketHistory from "./TicketHistory";
import TicketForm from "./TicketForm";
import VerificationForm from "./VerificationForm";
import { useSubmittedTicketStore } from "@/app/store/useSubmittedTicketStore";
import { useTicketHistoryStore } from "@/app/store/useTicketHistoryStore";
import { useVerificationStore } from "@/app/store/useVerificationStore";
import { useAttachmentsStore } from "@/app/store/useAttachmentsStore";
import { motion } from "framer-motion";
import { CommonLocales } from "@/public/locales/common/map";
import { useLocalesStore } from "@/app/store/useLocalesStore";

export default function TicketWrapper() {
  const { submittedTicket } = useSubmittedTicketStore();
  const { tickets } = useTicketHistoryStore();
  const { isVerifying } = useVerificationStore();
  const attachments = useAttachmentsStore((state) => state.attachments);
  const locales = useLocalesStore((state) => state.locales);
  return (
    <>
      {!submittedTicket && !isVerifying ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mt-12 p-8 bg-card/80 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-border/20 backdrop-blur-sm"
        >
          {/* Background glow effect */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl -z-10"
          />

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-2xl font-bold text-center bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-2"
          >
            {locales.tickets?.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-center text-muted-foreground mb-8"
          >
            {locales.tickets?.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <TicketHistory
              tickets={tickets}
              attachments={attachments}
              locales={locales.tickets}
            />
            <hr className="!my-6 border-border/30" />
            <TicketForm />
          </motion.div>
        </motion.div>
      ) : isVerifying ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mt-12 p-8 bg-card/80 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-border/20 backdrop-blur-sm"
        >
          {/* Background glow effect */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl -z-10"
          />
          <VerificationForm />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mt-12 p-8 bg-success/10 rounded-2xl shadow-xl border border-success/20 text-center backdrop-blur-sm"
        >
          {/* Background glow effect */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-r from-success/20 via-success/10 to-success/20 rounded-2xl blur-xl -z-10"
          />

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-2xl font-bold text-success mb-2"
          >
            {locales.tickets?.ticket_verified}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-success-foreground mb-4"
          >
            {locales.tickets?.ticket_verified_description}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-muted-foreground"
          >
            {locales.tickets?.reference_number}:
          </motion.p>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-2xl font-mono bg-success/20 text-success inline-block px-4 py-2 rounded-md mt-2 animate-bounce"
          >
            {submittedTicket?.ticketId}
          </motion.p>
        </motion.div>
      )}
    </>
  );
}
