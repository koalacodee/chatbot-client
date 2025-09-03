"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";

const verificationSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface VerificationCodeFormProps {
  onSubmit: (data: VerificationFormData) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
  submissionsError?: string;
}

export default function VerificationCodeForm({
  onSubmit,
  isLoading = false,
  className = "",
  submissionsError,
}: VerificationCodeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-4 ${className}`}
    >
      <div className="space-y-2">
        <label htmlFor="code" className="text-sm font-medium text-foreground">
          Verification Code
        </label>
        <input
          {...register("code")}
          id="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-center tracking-widest ${
            errors.code
              ? "border-destructive focus:border-destructive"
              : "border-input"
          }`}
          placeholder="000000"
          aria-invalid={errors.code ? "true" : "false"}
          aria-describedby={errors.code ? "code-error" : undefined}
        />
        {(submissionsError || errors.code) && (
          <p
            id="code-error"
            className="text-sm text-destructive flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {submissionsError || errors?.code?.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
