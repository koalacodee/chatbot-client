"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DepartmentService, SupportTicketService } from "@/utils/api/index";
import api from "@/utils/api";
import { ViewAllSubDepartments200ResponseDataInner } from "@/utils/api/generated";
import { useTicketHistoryStore } from "@/app/store/useTicketHistoryStore";
import { useVerificationStore } from "@/app/store/useVerificationStore";
import { useAttachmentStore } from "./useAttachmentStore";
import { useAttachmentsStore } from "@/app/store/useAttachmentsStore";

// Define the Zod schema for form validation
const ticketSchema = z.object({
  mainCategory: z.string().min(1, "Please select a main topic"),
  subDepartment: z.string().optional(),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must not exceed 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  guestName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  guestPhone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must not exceed 15 characters")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  guestEmail: z.email("Please enter a valid email address"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface Category {
  id: string;
  name: string;
}

export default function TicketForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableSubDepts, setAvailableSubDepts] = useState<
    ViewAllSubDepartments200ResponseDataInner[]
  >([]);
  const attachments = useAttachmentStore((state) => state.attachments);
  const setAttachments = useAttachmentStore((state) => state.setAttachments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setTickets = useTicketHistoryStore((state) => state.setTickets);
  const setTicketAttachments = useAttachmentsStore(
    (state) => state.setAttachments
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      mainCategory: "",
      subDepartment: "",
      subject: "",
      description: "",
      guestName: "",
      guestPhone: "",
      guestEmail: "",
    },
  });

  const selectedCategoryId = watch("mainCategory");
  const phone = watch("guestPhone");

  // Fetch categories and sub-departments from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch main departments (categories)
        const categoriesResponse =
          await DepartmentService.viewAllMainDepartments();
        const categoriesData = categoriesResponse.data.data || [];

        // Map API response to our Category interface
        const mappedCategories = categoriesData.map((cat: any) => ({
          id: cat.id || cat._id,
          name: cat.name,
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("Failed to load departments. Please try again later.");

        // Fallback to empty arrays if API fails
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter sub-departments based on selected category
  useEffect(() => {
    if (selectedCategoryId) {
      DepartmentService.viewAllSubDepartments(selectedCategoryId).then(
        (val) => {
          setAvailableSubDepts(val.data.data);
          setValue("subDepartment", ""); // Reset sub-department when category changes
        }
      );
    } else {
      setAvailableSubDepts([]);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    const phoneResult = ticketSchema.shape.guestPhone.safeParse(phone);

    if (phoneResult.success) {
      const fetchTickets = async () => {
        const tickets = await SupportTicketService.getTicketHistory(phone);
        setTickets(tickets.data.data.tickets);
        setTicketAttachments(tickets.data.data.attachments);
      };
      fetchTickets();
    }
  }, [phone]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      // Debug: Log the request payload
      const requestPayload = {
        subject: data.subject,
        description: data.description,
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        guestEmail: data.guestEmail,
        departmentId: data.subDepartment || data.mainCategory,
      };
      console.log("Sending createSupportTicket request:", requestPayload);

      // Use direct axios call to ensure all data is sent
      const response = await api.post("/support-tickets", {
        subject: data.subject,
        description: data.description,
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        guestEmail: data.guestEmail,
        departmentId: data.subDepartment || data.mainCategory,
        attach: attachments.length > 0,
      });
      console.log("Response from createSupportTicket:", response.data);

      // Store ticket data for verification instead of showing success
      const { setTicketData, setIsVerifying } = useVerificationStore.getState();
      setTicketData(response.data.data.ticketId, data.guestEmail);
      setIsVerifying(true);

      // Reset form after successful submission
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          alert("File size must not exceed 10MB");
          return;
        }
      }
      setAttachments(Array.from(files));
      console.log("Attachments:", attachments);
    }
  };

  const removeAttachment = () => {
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md animate-fade-in">
        <p className="text-destructive">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 text-sm bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors animate-slide-in"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center p-4 animate-fade-in">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">
            Loading departments...
          </span>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
            <label
              htmlFor="mainCategory"
              className="md:text-right text-sm font-medium text-slate-700"
            >
              Main Topic
            </label>
            <div>
              <select
                id="mainCategory"
                {...register("mainCategory")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.mainCategory ? "border-destructive" : "border-border"
                } transition-colors animate-fade-in`}
                disabled={loading}
              >
                <option value="" disabled>
                  {loading ? "Loading..." : "Select a main topic..."}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.mainCategory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mainCategory.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
            <label
              htmlFor="subDepartment"
              className="md:text-right text-sm font-medium text-slate-700"
            >
              Specific Issue
            </label>
            <div>
              <select
                id="subDepartment"
                {...register("subDepartment")}
                className={`w-full px-3 py-2 border ${
                  errors.mainCategory ? "border-destructive" : "border-border"
                } rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background transition-colors animate-fade-in`}
                disabled={!selectedCategoryId || availableSubDepts.length === 0}
              >
                <option value="" disabled>
                  {availableSubDepts.length > 0
                    ? "Select a specific issue..."
                    : "No specific issue required"}
                </option>
                {availableSubDepts.map((subDept) => (
                  <option key={subDept.id} value={subDept.id}>
                    {subDept.name}
                  </option>
                ))}
              </select>
              {errors.subDepartment && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.subDepartment.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
            <label
              htmlFor="guestName"
              className="md:text-right text-sm font-medium text-slate-700"
            >
              Full Name
            </label>
            <div>
              <input
                type="text"
                id="guestName"
                {...register("guestName")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.guestName ? "border-destructive" : "border-border"
                } transition-colors animate-fade-in`}
                placeholder="Enter your full name"
              />
              {errors.guestName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.guestName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
            <label
              htmlFor="guestEmail"
              className="md:text-right text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <div>
              <input
                type="email"
                id="guestEmail"
                {...register("guestEmail")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.guestEmail ? "border-destructive" : "border-border"
                } transition-colors animate-fade-in`}
                placeholder="Enter your email address"
              />
              {errors.guestEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.guestEmail.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
            <label
              htmlFor="guestPhone"
              className="md:text-right text-sm font-medium text-slate-700"
            >
              Phone Number
            </label>
            <div>
              <input
                type="tel"
                id="guestPhone"
                {...register("guestPhone")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.guestPhone ? "border-destructive" : "border-border"
                } transition-colors animate-fade-in`}
                placeholder="Enter your phone number"
              />
              {errors.guestPhone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.guestPhone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
            <label
              htmlFor="subject"
              className="md:text-right text-sm font-medium text-slate-700"
            >
              Subject
            </label>
            <div>
              <input
                type="text"
                id="subject"
                {...register("subject")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.subject ? "border-destructive" : "border-border"
                } transition-colors animate-fade-in`}
                placeholder="e.g., Issue with my order"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.subject.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] md:items-start gap-2 md:gap-4">
            <label
              htmlFor="description"
              className="md:text-right md:pt-2 text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <div>
              <textarea
                id="description"
                rows={4}
                {...register("description")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.description ? "border-destructive" : "border-border"
                } transition-colors animate-fade-in`}
                placeholder="Describe your issue in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] md:items-start gap-2 md:gap-4">
            <label
              htmlFor="attachment"
              className="md:text-right md:pt-2 text-sm font-medium text-slate-700"
            >
              Attachment
              <span className="block text-xs text-slate-500 leading-tight">
                (Optional, max 10MB)
              </span>
            </label>
            <div>
              <input
                type="file"
                id="attachment"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors animate-fade-in"
              />
              {attachments && (
                <div className="mt-2 flex items-center justify-between p-2 bg-secondary rounded-md text-sm border border-border animate-slide-in">
                  <p className="text-foreground truncate pr-2">
                    {attachments.length > 0
                      ? `Attachments: ${attachments.length}`
                      : "No attachments"}
                  </p>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="text-destructive hover:text-destructive/80 font-bold text-lg flex-shrink-0 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4">
            <div className="md:col-start-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 animate-fade-in"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
