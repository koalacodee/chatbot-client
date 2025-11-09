"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ticketService, AttachmentService, api } from "@/utils/api";
import { SupportTicketService } from "@/utils/api/index";
import PageLayout from "@/components/layout/PageLayout";
import { Search, CheckCircle2, Clock, User, Mail, Phone, Building2, FileText, Calendar, Hash, Plus, X, Download, ArrowLeft } from "lucide-react";
import CreateTicketModal from "@/components/support-ticket/CreateTicketModal";
import Toast from "@/components/ui/Toast";
import { env } from "next-runtime-env";
import { useLocalesStore } from "@/app/store/useLocalesStore";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface TicketData {
  id: string;
  subject: string;
  description: string;
  departmentId: string;
  department: {
    id: string;
    name: string;
  };
  answer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
}

interface Attachment {
  fileType: string;
  originalName: string;
  sizeInBytes: number;
  expiryDate: string;
  contentType: string;
  token: string;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/20",
  },
  in_progress: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/20",
  },
  resolved: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
  },
  closed: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
  },
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  in_progress: <Clock className="h-4 w-4" />,
  resolved: <CheckCircle2 className="h-4 w-4" />,
  closed: <CheckCircle2 className="h-4 w-4" />,
};

export default function SupportTicketsPage() {
  const [code, setCode] = useState("");
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [answerAttachments, setAnswerAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [ticketReferenceNumber, setTicketReferenceNumber] = useState<string>("");
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    attachment: Attachment | null;
    url: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    attachment: null,
    url: "",
    isLoading: false,
  });
  const [isRated, setIsRated] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const locales = useLocalesStore((state) => state.locales);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isClearingRef = useRef(false);

  const handleTrackTicket = useCallback(async (ticketCode: string) => {
    if (!ticketCode.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await ticketService.trackSupportTicket(ticketCode.trim());
      setTicketData(data.ticket as TicketData);
      setShowForm(false);
      setIsRated(data.isRated); // Reset rating state for new ticket

      // Update URL with code query parameter (without redirecting)
      router.replace(`/support-tickets?code=${encodeURIComponent(ticketCode.trim())}`, { scroll: false });

      // Fetch attachment metadata
      const ticketId = (data.ticket as TicketData).id;
      const attachmentTokens = data.attachments[ticketId] || [];
      const answerAttachmentTokens = data.answerAttachments?.[ticketId] || [];

      // Fetch metadata for question attachments
      if (attachmentTokens.length > 0) {
        const attachmentMetadata = await Promise.all(
          attachmentTokens.map(async (token: string) => {
            const metadata = await AttachmentService.getAttachmentMetadata(token);
            return { ...metadata, token };
          })
        );
        setAttachments(attachmentMetadata);
      } else {
        setAttachments([]);
      }

      // Fetch metadata for answer attachments
      if (answerAttachmentTokens.length > 0) {
        const answerAttachmentMetadata = await Promise.all(
          answerAttachmentTokens.map(async (token: string) => {
            const metadata = await AttachmentService.getAttachmentMetadata(token);
            return { ...metadata, token };
          })
        );
        setAnswerAttachments(answerAttachmentMetadata);
      } else {
        setAnswerAttachments([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to find ticket. Please check your reference number.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Check for code in URL on mount and when searchParams change
  useEffect(() => {
    // Skip if we're intentionally clearing
    if (isClearingRef.current) {
      return;
    }

    const urlCode = searchParams.get("code");
    // Only track if we have a code in URL, no ticket data yet, not currently loading, and form is not showing
    if (urlCode && !ticketData && !isLoading) {
      // Only track if the code is different from what we're currently tracking
      if (code !== urlCode) {
        setCode(urlCode);
        handleTrackTicket(urlCode);
      }
    }
  }, [searchParams, ticketData, isLoading, showForm, handleTrackTicket, code]);

  // Reset clearing flag when form is shown
  useEffect(() => {
    if (showForm) {
      // Small delay to ensure URL has updated
      const timer = setTimeout(() => {
        isClearingRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    await handleTrackTicket(code.trim());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "_");
    return statusColors[normalizedStatus] || statusColors.pending;
  };

  const handleAttachmentPreview = async (attachment: Attachment) => {
    setPreviewModal({
      isOpen: true,
      attachment,
      url: "",
      isLoading: true,
    });

    try {
      let attachmentUrl: string;
      if (env("NEXT_PUBLIC_MEDIA_ACCESS_TYPE") === "signed-url") {
        const response = await AttachmentService.getAttachmentSignedUrl(
          attachment.token
        );
        attachmentUrl = response.signedUrl;
      } else {
        attachmentUrl = `${api.defaults.baseURL}/attachment/${attachment.token}`;
      }
      setPreviewModal((prev) => ({
        ...prev,
        url: attachmentUrl,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch attachment URL:", error);
      setPreviewModal((prev) => ({
        ...prev,
        url: `${api.defaults.baseURL}/attachment/${attachment.token}`,
        isLoading: false,
      }));
    }
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      attachment: null,
      url: "",
      isLoading: false,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleReturnToForm = () => {
    // Set flag to prevent useEffect from running
    isClearingRef.current = true;
    // Clear the code from URL FIRST
    router.replace("/support-tickets", { scroll: false });
    // Then reset all state
    setTicketData(null);
    setAttachments([]);
    setAnswerAttachments([]);
    setCode("");
    setError(null);
    setShowForm(true);
    setIsRated(false);
  };

  const handleRate = async (rate: "satisfied" | "dissatisfied") => {
    if (isRated || !ticketData) return;
    setIsSubmittingRating(true);
    try {
      switch (rate) {
        case "satisfied":
          await SupportTicketService.recordTicketSatisfaction(ticketData.id);
          setIsRated(true);
          break;
        case "dissatisfied":
          await SupportTicketService.recordTicketDissatisfaction(ticketData.id);
          setIsRated(true);
          break;
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) {
      return (
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      );
    } else if (contentType.startsWith("application/pdf")) {
      return (
        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
      );
    } else if (contentType.includes("text/")) {
      return (
        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
      );
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium mb-6"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>{locales.tickets?.tracking?.back_to_home || "Back to Home"}</span>
                  </Link>
                </motion.div>
                <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-12 backdrop-blur-sm">
                  {/* Background glow effect */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.05 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl -z-10"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-center mb-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
                    >
                      <Search className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {locales.tickets?.tracking?.title || "Track Support Ticket"}
                    </h1>
                    <p className="text-muted-foreground">
                      {locales.tickets?.tracking?.description || "Enter your reference number to view ticket details"}
                    </p>
                  </motion.div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {locales.tickets?.tracking?.reference_number_label || "Reference Number"}
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          id="code"
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder={locales.tickets?.tracking?.reference_number_placeholder || "Enter your ticket reference number"}
                          className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                          disabled={isLoading}
                          autoFocus
                        />
                      </div>
                    </motion.div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isLoading || !code.trim()}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                          />
                          {locales.tickets?.tracking?.searching || "Searching..."}
                        </span>
                      ) : (
                        locales.tickets?.tracking?.track_button || "Track Ticket"
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            ) : ticketData ? (
              <motion.div
                key="ticket"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Return Button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  onClick={handleReturnToForm}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>{locales.tickets?.tracking?.track_another || "Track Another Ticket"}</span>
                </motion.button>

                {/* Header Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8 backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl blur-xl -z-10" />

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {ticketData.subject}
                      </h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hash className="h-4 w-4" />
                        <span className="font-mono text-sm">{ticketData.code}</span>
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusConfig(ticketData.status).bg} ${getStatusConfig(ticketData.status).text} ${getStatusConfig(ticketData.status).border}`}
                    >
                      {statusIcons[ticketData.status.toLowerCase().replace(/\s+/g, "_")] || statusIcons.pending}
                      <span className="font-semibold capitalize">{ticketData.status}</span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Details Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Description Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-card rounded-xl shadow-md border border-border p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">{locales.tickets?.tracking?.description_label || "Description"}</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">{ticketData.description}</p>
                    {attachments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {locales.ui?.attachments || "Attachments"} ({attachments.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {attachments.map((attachment, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              onClick={() => handleAttachmentPreview(attachment)}
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors cursor-pointer"
                            >
                              {getFileIcon(attachment.contentType)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {attachment.originalName}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{attachment.fileType.toUpperCase()}</span>
                                  <span>•</span>
                                  <span>{formatFileSize(attachment.sizeInBytes)}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Department Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-card rounded-xl shadow-md border border-border p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">{locales.tickets?.tracking?.department_label || "Department"}</h2>
                    </div>
                    <p className="text-foreground font-medium">{ticketData.department?.name || locales.tickets?.tracking?.not_available || "N/A"}</p>
                  </motion.div>

                  {/* Answer Card */}
                  {ticketData.answer && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="md:col-span-2 bg-success/5 rounded-xl shadow-md border border-success/20 p-6 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <h2 className="text-lg font-semibold text-success">{locales.tickets?.tracking?.response_label || "Response"}</h2>
                      </div>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-4">{ticketData.answer}</p>
                      {answerAttachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-success/20">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium text-success">
                              {locales.ui?.attachments || "Attachments"} ({answerAttachments.length})
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {answerAttachments.map((attachment, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                                onClick={() => handleAttachmentPreview(attachment)}
                                className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20 hover:bg-success/20 transition-colors cursor-pointer"
                              >
                                {getFileIcon(attachment.contentType)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {attachment.originalName}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{attachment.fileType.toUpperCase()}</span>
                                    <span>•</span>
                                    <span>{formatFileSize(attachment.sizeInBytes)}</span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rating Component */}
                      {ticketData.answer && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                          className="mt-6 pt-6 border-t border-success/20"
                        >
                          {!isRated ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20 backdrop-blur-sm">
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-foreground mb-1">
                                  {locales.faqs?.was_this_reply_helpful || "Was this reply helpful?"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {locales.tickets?.tracking?.feedback_help_text || "Your feedback helps us improve our support"}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <motion.button
                                  type="button"
                                  onClick={() => handleRate("satisfied")}
                                  disabled={isSubmittingRating}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="group relative p-3 bg-success/10 hover:bg-success/20 border-2 border-success/30 hover:border-success/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label={locales.faqs?.satisfied || "Satisfied"}
                                >
                                  <motion.span
                                    className="text-2xl"
                                    animate={isSubmittingRating ? { rotate: 360 } : {}}
                                    transition={{ duration: 0.5, repeat: isSubmittingRating ? Infinity : 0 }}
                                  >
                                    👍
                                  </motion.span>
                                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-success opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {locales.faqs?.satisfied || "Satisfied"}
                                  </span>
                                </motion.button>
                                <motion.button
                                  type="button"
                                  onClick={() => handleRate("dissatisfied")}
                                  disabled={isSubmittingRating}
                                  whileHover={{ scale: 1.1, rotate: -5 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="group relative p-3 bg-destructive/10 hover:bg-destructive/20 border-2 border-destructive/30 hover:border-destructive/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label={locales.faqs?.dissatisfied || "Dissatisfied"}
                                >
                                  <motion.span
                                    className="text-2xl"
                                    animate={isSubmittingRating ? { rotate: 360 } : {}}
                                    transition={{ duration: 0.5, repeat: isSubmittingRating ? Infinity : 0 }}
                                  >
                                    👎
                                  </motion.span>
                                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-destructive opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {locales.faqs?.dissatisfied || "Dissatisfied"}
                                  </span>
                                </motion.button>
                              </div>
                            </div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/30 backdrop-blur-sm"
                            >
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="text-2xl"
                              >
                                ✨
                              </motion.div>
                              <p className="text-base font-semibold text-primary">
                                {locales.faqs?.thanks_for_your_feedback || "Thanks for your feedback!"}
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Guest Information Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="md:col-span-2 bg-card rounded-xl shadow-md border border-border p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">{locales.tickets?.tracking?.contact_information || "Contact Information"}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {ticketData.guestName && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">{locales.tickets?.tracking?.name || "Name"}</p>
                            <p className="text-foreground font-medium">{ticketData.guestName}</p>
                          </div>
                        </div>
                      )}
                      {ticketData.guestEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">{locales.tickets?.tracking?.email || "Email"}</p>
                            <p className="text-foreground font-medium break-all">{ticketData.guestEmail}</p>
                          </div>
                        </div>
                      )}
                      {ticketData.guestPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">{locales.tickets?.tracking?.phone || "Phone"}</p>
                            <p className="text-foreground font-medium">{ticketData.guestPhone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Dates Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="md:col-span-2 bg-card rounded-xl shadow-md border border-border p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">{locales.tickets?.tracking?.timeline_label || "Timeline"}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{locales.tickets?.tracking?.created_label || "Created"}</p>
                        <p className="text-foreground font-medium">{formatDate(ticketData.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{locales.tickets?.tracking?.last_updated || "Last Updated"}</p>
                        <p className="text-foreground font-medium">{formatDate(ticketData.updatedAt)}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
        >
          <Plus className="h-5 w-5" />
          <span>{locales.tickets?.tracking?.open_support_ticket || "Open Support Ticket"}</span>
        </motion.button>

        {/* Create Ticket Modal */}
        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(ticketId) => {
            setTicketReferenceNumber(ticketId);
            setIsToastOpen(true);
          }}
        />

        {/* Success Toast */}
        <Toast
          isOpen={isToastOpen}
          onClose={() => setIsToastOpen(false)}
          message={locales.tickets?.toast?.success_message || "Ticket created successfully!"}
          referenceNumber={ticketReferenceNumber}
        />

        {/* Attachment Preview Modal */}
        {previewModal.isOpen && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePreviewModal}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Close button */}
                <button
                  onClick={closePreviewModal}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal content */}
                {previewModal.isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full"
                      />
                      <span className="text-muted-foreground">
                        {locales.ui?.loading_preview || "Loading preview..."}
                      </span>
                    </div>
                  </div>
                ) : previewModal.attachment ? (
                  <div>
                    {/* Header with file info */}
                    <div className="p-6 border-b border-border">
                      <h3 className="font-semibold text-foreground truncate text-lg">
                        {previewModal.attachment.originalName}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {previewModal.attachment.contentType} • {formatFileSize(previewModal.attachment.sizeInBytes)}
                      </p>
                    </div>

                    {/* Preview content */}
                    <div className="p-6">
                      {previewModal.attachment.contentType.startsWith("image/") ? (
                        <img
                          src={previewModal.url}
                          alt={previewModal.attachment.originalName}
                          className="w-full h-auto max-h-[60vh] object-contain rounded-lg mx-auto"
                        />
                      ) : previewModal.attachment.contentType.startsWith("video/") ? (
                        <video
                          src={previewModal.url}
                          className="w-full h-auto max-h-[60vh] rounded-lg mx-auto"
                          controls
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : previewModal.attachment.contentType.startsWith("audio/") ? (
                        <div className="flex items-center justify-center p-8">
                          <audio
                            controls
                            src={previewModal.url}
                            className="w-full max-w-md"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-12">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                              <FileText className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground mb-4">
                              {locales.ui?.preview_not_available || "Preview not available for this file type"}
                            </p>
                            <a
                              href={previewModal.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                              <Download className="w-4 h-4" />
                              {locales.ui?.download_file || "Download File"}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </PageLayout>
  );
}

