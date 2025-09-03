"use client";
import React from "react";

interface WelcomeSectionProps {
  title: string;
  description: string;
  className?: string;
}

export default function WelcomeSection({ 
  title, 
  description, 
  className = "" 
}: WelcomeSectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}
