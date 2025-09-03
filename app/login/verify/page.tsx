"use client";
import React, { useState } from "react";
import VerificationCodeForm from "@/components/VerificationCodeForm";
import { GuestService } from "@/utils/api/index";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function LoginVerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  const handleVerification = async (data: { code: string }) => {
    setIsLoading(true);
    setError(undefined);

    // Mock console log for verification data
    console.log("Login verification code submitted:", data);

    // Simulate API call
    try {
      await GuestService.verifyGuestLogin({ code: data.code });
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data.data;
        console.log(errorData);
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
            Verify your login
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the 6-digit verification code sent to your email
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
