"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SupportTicketService } from "@/lib/api";
import { useVerificationStore } from "@/app/store/useVerificationStore";
import { useSubmittedTicketStore } from "@/app/store/useSubmittedTicketStore";
import { useAttachmentStore } from "./useAttachmentStore";
import { TusService } from "@/components/filehub/tus";
import { env } from "next-runtime-env";
import { useLocalesStore } from "@/app/store/useLocalesStore";

const verificationSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 characters")
    .max(6, "Verification code must be 6 characters"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function VerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    ticketId,
    verifiedTicketData,
    setIsVerified,
    setVerificationError,
    verificationError,
  } = useVerificationStore();
  const { setSubmittedTicket } = useSubmittedTicketStore();
  const attachments = useAttachmentStore((state) => state.attachments);
  const locales = useLocalesStore((state) => state.locales);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerificationFormData) => {
    if (!ticketId) return;

    setIsSubmitting(true);
    setVerificationError(null);

    try {
      const response = await SupportTicketService.verifyTicket({
        code: data.code,
      });

      // Upload attachments using FileHub TUS if available
      if (attachments.length > 0 && response.data?.fileHubUploadKey) {
        const tusUploadUrl = env("NEXT_PUBLIC_TUS_URL");
        if (!tusUploadUrl) {
          throw new Error("TUS upload URL is not set");
        }
        const tusService = new TusService(tusUploadUrl);

        for (const file of attachments) {
          const upload = await tusService.upload({
            file,
            uploadKey: response.data?.fileHubUploadKey!,
          });
          upload.start();
        }
      } else if (attachments.length > 0) {
        console.warn(
          "Attachments present but no fileHubUploadKey provided. Skipping upload."
        );
      }

      const ticketData = response.data?.ticket;

      // Store complete ticket data with reference code

      if (!ticketData) {
        throw new Error("Failed to verify ticket");
      }
      const verifiedTicketData = {
        ticketId: ticketData.id,
        code: ticketData.code,
        subject: ticketData.subject,
        status: ticketData.status,
        guestName: ticketData.guestName,
        guestPhone: ticketData.guestPhone,
        guestEmail: ticketData.guestEmail,
      };

      const { setVerifiedTicketData } = useVerificationStore.getState();
      setVerifiedTicketData(verifiedTicketData);

      // Also update submitted ticket store
      const verifiedTicket = {
        message: "Ticket verified successfully",
        ticketId: ticketData.code, // Use code as reference
        verificationEmailSent: true,
      };
      setSubmittedTicket(verifiedTicket);
      setIsVerified(true);
      // Don't reset verification here - let the parent component handle it
    } catch (error: any) {
      console.error("Error verifying ticket:", error);

      setVerificationError(locales.ui?.invalid_verification_code || "");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!ticketId || !verifiedTicketData?.guestEmail) return;

    try {
      // This would typically be a separate endpoint for resending codes
      // For now, we'll just clear the error
      setVerificationError(null);
    } catch (error) {
      console.error("Error resending code:", error);
      setVerificationError(
        "Failed to resend verification code. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-card-foreground mb-2">
          {locales.ui?.verify_your_ticket || "Verify Your Ticket"}
        </h3>
        <p className="text-muted-foreground">
          {locales.ui?.verification_code_sent ||
            "We've sent a verification code to your email address"}{" "}
          {verifiedTicketData?.guestEmail}.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {locales.ui?.verification_code || "Verification Code"}
          </label>
          <input
            type="text"
            id="code"
            {...register("code")}
            maxLength={6}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background text-center text-lg tracking-widest ${errors.code ? "border-destructive" : "border-border"
              } transition-colors animate-fade-in`}
            placeholder="000000"
          />
          {verificationError && (
            <p className="mt-1 text-sm text-red-600">{verificationError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 animate-fade-in"
        >
          {isSubmitting
            ? locales.ui?.verifying || "Verifying..."
            : locales.ui?.verify_ticket || "Verify Ticket"}
        </button>
      </form>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={handleResendCode}
          className="text-sm text-primary hover:text-primary/80 underline transition-colors"
        >
          {locales.ui?.didnt_receive_code || "Didn't receive the code?"}{" "}
          {locales.ui?.resend || "Resend"}
        </button>
      </div>
    </div>
  );
}
