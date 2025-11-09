"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLocalesStore } from "@/app/store/useLocalesStore";

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  referenceNumber: string;
}

export default function Toast({
  isOpen,
  onClose,
  message,
  referenceNumber,
}: ToastProps) {
  const [copied, setCopied] = useState(false);
  const locales = useLocalesStore((state) => state.locales);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 left-6 z-50 max-w-md"
        >
          <div className="bg-card rounded-xl shadow-2xl border border-border p-4 backdrop-blur-sm relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-success/10 via-success/5 to-success/10 rounded-xl blur-xl -z-10" />

            <div className="flex items-start gap-3">
              {/* Success Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-8">
                <p className="text-sm font-semibold text-foreground mb-2">
                  {message}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{locales.tickets?.toast?.reference_label || "Reference:"}</span>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded text-foreground">
                    {referenceNumber}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-muted transition-colors group relative"
                    title={locales.tickets?.toast?.copy_tooltip || "Copy reference number"}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded hover:bg-muted transition-colors"
                aria-label="Close toast"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

