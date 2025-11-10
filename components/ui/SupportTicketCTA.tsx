"use client"

import { motion } from "framer-motion"
import Link from "next/link";
import { Ticket, ArrowRight, ArrowLeft } from "lucide-react";
import { useLocalesStore } from "@/app/store/useLocalesStore";
import { useLangStore } from "@/app/store/useLangStore";
import { isRTL } from "@/lib/utils";
export default function SupportTicketCTA() {
  const lang = useLangStore((state) => state.lang);
  const locales = useLocalesStore((state) => state.locales);
  const rtl = isRTL(lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="relative overflow-hidden rounded-2xl"
      >
        {/* Background glow effect */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative rounded-2xl bg-card/80 backdrop-blur-sm p-8 md:p-12 border border-border/20 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className={`flex-1 text-center ${rtl ? 'md:text-right' : 'md:text-left'}`}>
              <motion.div
                initial={{ opacity: 0, x: rtl ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 md:mb-0 ${rtl ? 'md:ml-6' : 'md:mr-6'}`}
              >
                <Ticket className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent"
              >
                {locales.tickets?.title || "Didn't find answer?"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-muted-foreground text-lg"
              >
                {locales.tickets?.description || "Submit a ticket and our support team will get back to you."}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: rtl ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Link
                href="/support-tickets"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                <span>{locales.ui?.track_your_tickets || "Track Your Tickets"}</span>
                {rtl ? (
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                )}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>)
}