"use client";
import React from "react";
import { MessageCircle, Loader2 } from "lucide-react";

export interface FAQ {
  content: string;
  id: string;
}

interface FAQSectionProps {
  questions: FAQ[];
  onSelectQuestion: (question: FAQ) => void;
  isLoading?: boolean;
  className?: string;
}

export default function FAQSection({
  questions,
  onSelectQuestion,
  isLoading = false,
  className = "",
}: FAQSectionProps) {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-sm font-semibold text-foreground">
          Quick Questions
        </h3>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-sm font-semibold text-foreground">
          Quick Questions
        </h3>
        <p className="text-xs text-muted-foreground">
          No questions available for this department.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-semibold text-foreground">Quick Questions</h3>
      <div className="space-y-2">
        {questions.slice(0, 5).map((question) => (
          <button
            key={question.id}
            onClick={() => onSelectQuestion(question)}
            className="group flex w-full items-start gap-2 rounded-md p-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title={`Ask: ${question.content}`}
          >
            <MessageCircle className="mt-0.5 h-3 w-3 flex-shrink-0 transition-transform group-hover:scale-110" />
            <span className="line-clamp-2">{question.content}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
