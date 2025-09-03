"use client";
import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <main className="flex-1" role="main">
        {children}
      </main>
    </div>
  );
}
