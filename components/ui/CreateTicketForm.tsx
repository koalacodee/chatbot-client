"use client";
import React, { useState } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";

interface CreateTicketFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    department: string;
    priority: string;
  }) => Promise<void>;
  departments: { id: string; name: string }[];
  isLoading?: boolean;
  className?: string;
}

export default function CreateTicketForm({ 
  onSubmit, 
  departments, 
  isLoading = false,
  className = "" 
}: CreateTicketFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    priority: "medium" as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      newErrors.description = "Question is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Question must be at least 10 characters";
    }
    
    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Question <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
            errors.description ? "border-destructive focus:border-destructive" : "border-input"
          }`}
          placeholder="Please type your question here"
          rows={4}
          maxLength={1000}
          aria-invalid={errors.description ? "true" : "false"}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formData.description.length}/1000</span>
        </div>
        {errors.description && (
          <p id="description-error" className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="department" className="text-sm font-medium text-foreground">
          Department <span className="text-destructive">*</span>
        </label>
        <select
          id="department"
          value={formData.department}
          onChange={(e) => handleInputChange("department", e.target.value)}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            errors.department ? "border-destructive focus:border-destructive" : "border-input"
          }`}
          aria-invalid={errors.department ? "true" : "false"}
          aria-describedby={errors.department ? "department-error" : undefined}
        >
          <option value="">Select a department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.department && (
          <p id="department-error" className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.department}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit Question
          </>
        )}
      </button>
    </form>
  );
}
