"use client";
import React from "react";
import { History } from "lucide-react";

interface RecentQuestion {
  id: string;
  question: string;
  timestamp: Date;
}

interface RecentQuestionsProps {
  questions: RecentQuestion[];
  onSelectQuestion: (question: string) => void;
  className?: string;
}

export default function RecentQuestions({ 
  questions, 
  onSelectQuestion, 
  className = "" 
}: RecentQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <History className="h-4 w-4" />
        Recent Questions
      </h3>
      <div className="space-y-2">
        {questions.slice(0, 3).map((question) => (
          <button
            key={question.id}
            onClick={() => onSelectQuestion(question.question)}
            className="group w-full rounded-md p-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title={`Ask: ${question.question}`}
          >
            <span className="line-clamp-1">{question.question}</span>
            <span className="text-xs text-muted-foreground/70">
              {new Date(question.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
