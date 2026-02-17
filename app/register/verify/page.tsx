"use client";
import React, { useState } from "react";
import VerificationCodeForm from "@/components/VerificationCodeForm";
import { useGuestStore } from "@/app/store/useGuestStore";
import { AxiosError } from "axios";
import { GuestService } from "@/utils/api/index";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { guest } = useGuestStore();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);

  const handleVerification = async (data: { code: string }) => {
    setIsLoading(true);

    // Simulate API call
    try {
      await GuestService.verifyGuestRegistration({
        code: data.code,
      });
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data.data;
        if (errorData?.code == "code_incorrect") {
          setError("Code is incorrect, Please Try again");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Verify your email
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the 6-digit verification code sent to your email{" "}
            <b>{guest?.email}</b>
          </p>
        </div>

        <VerificationCodeForm
          onSubmit={handleVerification}
          isLoading={isLoading}
          submissionsError={error}
        />
      </div>
    </div>
  );
}
