"use client";
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="flex-shrink-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGvKjyp-rb03_BvEKUZ4Hi51GAD10BOYDvU1DR6lznHmx1LmDtj_xSWM0aW7lk4f0vHqxn_gXHB7Fh0Un29FKzkI8XnRhcKhy6g3sv3PjeAuO5ngfMBshvvm8Cb_pWau5PASH1WRuYiTYFn1jsX26F_K1XYOU443MWj4pX7-5971IbxjoaekbzQJNNciB0hWtFlNkE6KrUNwKYhFL4AEjfT37mnRIPCbtecytWjmB81hgG-cs12T61_jaOzeuKLrvGPdae_hDygPJM"
          alt="Assistant avatar"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Assistant
          </span>
        </div>

        <div className="max-w-lg px-4 py-3 rounded-2xl bg-muted text-foreground rounded-bl-md">
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
