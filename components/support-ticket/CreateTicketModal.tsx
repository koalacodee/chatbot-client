"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Upload, XCircle, Loader2 } from "lucide-react";
import { DepartmentService, SupportTicketService } from "@/utils/api/index";
import api from "@/utils/api";
import {
  ViewAllSubDepartments200ResponseDataInner,
  ViewAllMainDepartments200ResponseDataInner,
} from "@/utils/api/generated";
import { motion, AnimatePresence } from "framer-motion";
import { useVerificationStore } from "@/app/store/useVerificationStore";
import { useAttachmentStore } from "./useAttachmentStore";
import VerificationForm from "./VerificationForm";
import { useLocalesStore } from "@/app/store/useLocalesStore";

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

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (ticketId: string) => void;
  sharedDepartment?: ViewAllMainDepartments200ResponseDataInner | null;
  sharedSubDepartments?: ViewAllSubDepartments200ResponseDataInner[] | null;
}

export default function CreateTicketModal({
  isOpen,
  onClose,
  onSuccess,
  sharedDepartment,
  sharedSubDepartments,
}: CreateTicketModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableSubDepts, setAvailableSubDepts] = useState<
    ViewAllSubDepartments200ResponseDataInner[]
  >([]);
  const attachments = useAttachmentStore((state) => state.attachments);
  const setAttachments = useAttachmentStore((state) => state.setAttachments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isVerifying, isVerified, verifiedTicketData, resetVerification } =
    useVerificationStore();
  const locales = useLocalesStore((state) => state.locales);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
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

  // Reset verification state when modal opens (fresh start)
  useEffect(() => {
    if (isOpen) {
      resetVerification();
      setSubmitError(null);
    }
  }, [isOpen, resetVerification]);

  // Reset local form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Only reset local state, not verification state
      reset();
      setAttachments([]);
      setSubmitError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, reset]);

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          // If we have a shared department, use it directly
          if (sharedDepartment) {
            const deptId = sharedDepartment.id || (sharedDepartment as any)._id;
            const deptName = sharedDepartment.name || "";

            const mappedCategories = [
              {
                id: deptId,
                name: deptName,
              },
            ];
            setCategories(mappedCategories);

            // Set the main category value to the shared department
            if (deptId) {
              setValue("mainCategory", deptId, { shouldValidate: false });
            }

            setLoading(false);
            return;
          }

          // Otherwise, fetch all categories normally
          const categoriesResponse =
            await DepartmentService.viewAllMainDepartments();
          const categoriesData = categoriesResponse.data.data || [];
          const mappedCategories = categoriesData.map((cat: any) => ({
            id: cat.id || cat._id,
            name: cat.name,
          }));
          setCategories(mappedCategories);
        } catch (error) {
          console.error("Error fetching departments:", error);
          setError(
            locales.tickets?.form?.errors?.failed_to_load_departments ||
              "Failed to load departments. Please try again later."
          );
          setCategories([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, sharedDepartment, setValue]);

  // Filter sub-departments based on selected category
  useEffect(() => {
    if (isOpen) {
      // If we have a shareKey, use it to fetch sub-departments for the shared department
      if (sharedSubDepartments && sharedDepartment) {
        setAvailableSubDepts(sharedSubDepartments);
        setValue("subDepartment", "");
        setValue("mainCategory", sharedDepartment.id);
      } else if (selectedCategoryId) {
        // Normal flow: fetch sub-departments for the selected category
        DepartmentService.viewAllSubDepartments(selectedCategoryId).then(
          (val) => {
            setAvailableSubDepts(val.data.data);
            setValue("subDepartment", "");
            setValue("mainCategory", selectedCategoryId);
          }
        );
      } else {
        setAvailableSubDepts([]);
      }
    } else {
      setAvailableSubDepts([]);
    }
  }, [
    selectedCategoryId,
    isOpen,
    setValue,
    sharedSubDepartments,
    sharedDepartment,
  ]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await api.post("/support-tickets", {
        subject: data.subject,
        description: data.description,
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        guestEmail: data.guestEmail,
        departmentId: data.subDepartment || data.mainCategory,
        attach: attachments.length > 0,
      });

      // Store ticket data for verification (same as TicketForm)
      const { setTicketData, setIsVerifying } = useVerificationStore.getState();
      setTicketData(response.data.data.ticketId, data.guestEmail);
      setIsVerifying(true);

      // Reset form after successful submission
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Error submitting ticket:", error);
      setSubmitError(
        error.response?.data?.message ||
          locales.tickets?.form?.errors?.failed_to_create_ticket ||
          "Failed to create ticket. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          alert("File size must not exceed 10MB");
          return;
        }
      }
      setAttachments(Array.from(files));
    }
  };

  const removeAttachment = () => {
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Watch for verification success
  useEffect(() => {
    if (isVerified && verifiedTicketData && isOpen) {
      // Show toast with reference number FIRST
      if (onSuccess) {
        onSuccess(verifiedTicketData.code);
      }
      // Close modal after a tiny delay to ensure parent state is set
      const timer = setTimeout(() => {
        onClose();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVerified, verifiedTicketData, isOpen, onSuccess, onClose]);

  // Reset verification state after modal closes (if it was verified)
  useEffect(() => {
    if (!isOpen && isVerified) {
      // Reset after modal is closed and verification was successful
      const timer = setTimeout(() => {
        resetVerification();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVerified, resetVerification]);

  const handleClose = () => {
    if (!isSubmitting && !isVerifying) {
      // Just close - reset will happen in useEffect when isOpen becomes false
      onClose();
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Dialog.Title className="text-2xl font-bold text-foreground">
                  {isVerifying
                    ? locales.tickets?.modal?.verify_title ||
                      "Verify Your Ticket"
                    : locales.tickets?.modal?.create_title ||
                      "Create Support Ticket"}
                </Dialog.Title>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting || isVerifying}
                  className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {isVerifying ? (
                    <motion.div
                      key="verification"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VerificationForm />
                    </motion.div>
                  ) : (
                    !isVerified &&
                    !isVerifying && (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        {error && (
                          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                            {error}
                          </div>
                        )}

                        {submitError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2"
                          >
                            <XCircle className="h-5 w-5 flex-shrink-0" />
                            {submitError}
                          </motion.div>
                        )}

                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">
                              {locales.tickets?.modal?.loading_departments ||
                                "Loading departments..."}
                            </span>
                          </div>
                        ) : (
                          <>
                            {/* Main Category */}
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {locales.tickets?.modal?.main_topic_label ||
                                  "Main Topic"}{" "}
                                <span className="text-destructive">*</span>
                              </label>
                              <select
                                {...register("mainCategory")}
                                className={`w-full px-4 py-3 bg-input border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors.mainCategory
                                    ? "border-destructive"
                                    : "border-border"
                                } ${
                                  sharedDepartment
                                    ? "opacity-75 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={loading || !!sharedDepartment}
                              >
                                <option value="">
                                  {locales.tickets?.modal
                                    ?.main_topic_placeholder ||
                                    "Select a main topic"}
                                </option>
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                              {errors.mainCategory && (
                                <p className="mt-1 text-sm text-destructive">
                                  {errors.mainCategory.message}
                                </p>
                              )}
                              {sharedDepartment && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  This category is locked based on the shared
                                  link
                                </p>
                              )}
                            </div>

                            {/* Sub Department */}
                            {(availableSubDepts.length > 0 ||
                              (sharedDepartment && sharedSubDepartments)) && (
                              <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                  {locales.tickets?.modal
                                    ?.specific_issue_label || "Specific Issue"}
                                </label>
                                <select
                                  {...register("subDepartment")}
                                  className={`w-full px-4 py-3 bg-input border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                    errors.subDepartment
                                      ? "border-destructive"
                                      : "border-border"
                                  }`}
                                  disabled={
                                    !selectedCategoryId && !sharedDepartment
                                  }
                                >
                                  <option value="">
                                    {locales.tickets?.modal
                                      ?.specific_issue_placeholder ||
                                      "Select a specific issue (optional)"}
                                  </option>
                                  {availableSubDepts.map((subDept) => (
                                    <option key={subDept.id} value={subDept.id}>
                                      {subDept.name}
                                    </option>
                                  ))}
                                </select>
                                {errors.subDepartment && (
                                  <p className="mt-1 text-sm text-destructive">
                                    {errors.subDepartment.message}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Guest Name */}
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {locales.tickets?.modal?.full_name_label ||
                                  "Full Name"}{" "}
                                <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="text"
                                {...register("guestName")}
                                className={`w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors.guestName
                                    ? "border-destructive"
                                    : "border-border"
                                }`}
                                placeholder={
                                  locales.tickets?.modal
                                    ?.full_name_placeholder ||
                                  "Enter your full name"
                                }
                              />
                              {errors.guestName && (
                                <p className="mt-1 text-sm text-destructive">
                                  {errors.guestName.message}
                                </p>
                              )}
                            </div>

                            {/* Guest Email */}
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {locales.tickets?.modal?.email_label ||
                                  "Email Address"}{" "}
                                <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="email"
                                {...register("guestEmail")}
                                className={`w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors.guestEmail
                                    ? "border-destructive"
                                    : "border-border"
                                }`}
                                placeholder={
                                  locales.tickets?.modal?.email_placeholder ||
                                  "Enter your email address"
                                }
                              />
                              {errors.guestEmail && (
                                <p className="mt-1 text-sm text-destructive">
                                  {errors.guestEmail.message}
                                </p>
                              )}
                            </div>

                            {/* Guest Phone */}
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {locales.tickets?.modal?.phone_label ||
                                  "Phone Number"}{" "}
                                <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="tel"
                                {...register("guestPhone")}
                                className={`w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors.guestPhone
                                    ? "border-destructive"
                                    : "border-border"
                                }`}
                                placeholder={
                                  locales.tickets?.modal?.phone_placeholder ||
                                  "Enter your phone number"
                                }
                              />
                              {errors.guestPhone && (
                                <p className="mt-1 text-sm text-destructive">
                                  {errors.guestPhone.message}
                                </p>
                              )}
                            </div>

                            {/* Subject */}
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {locales.tickets?.modal?.subject_label ||
                                  "Subject"}{" "}
                                <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="text"
                                {...register("subject")}
                                className={`w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors.subject
                                    ? "border-destructive"
                                    : "border-border"
                                }`}
                                placeholder={
                                  locales.tickets?.modal?.subject_placeholder ||
                                  "Enter ticket subject"
                                }
                              />
                              {errors.subject && (
                                <p className="mt-1 text-sm text-destructive">
                                  {errors.subject.message}
                                </p>
                              )}
                            </div>

                            {/* Description */}
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {locales.tickets?.modal?.description_label ||
                                  "Description"}{" "}
                                <span className="text-destructive">*</span>
                              </label>
                              <textarea
                                rows={4}
                                {...register("description")}
                                className={`w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${
                                  errors.description
                                    ? "border-destructive"
                                    : "border-border"
                                }`}
                                placeholder={
                                  locales.tickets?.modal
                                    ?.description_placeholder ||
                                  "Describe your issue in detail"
                                }
                              />
                              {errors.description && (
                                <p className="mt-1 text-sm text-destructive">
                                  {errors.description.message}
                                </p>
                              )}
                            </div>

                            {/* Attachments */}
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {locales.tickets?.modal?.attachments_label ||
                                  "Attachments"}
                                <span className="block text-xs text-muted-foreground font-normal mt-1">
                                  {locales.tickets?.modal
                                    ?.attachments_max_size ||
                                    "Maximum 10MB per file"}
                                </span>
                              </label>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full px-4 py-3 bg-muted hover:bg-muted/80 border border-border rounded-lg text-foreground flex items-center justify-center gap-2 transition-colors"
                              >
                                <Upload className="h-5 w-5" />
                                <span>
                                  {locales.tickets?.modal?.choose_files ||
                                    "Choose Files"}
                                </span>
                              </button>
                              {attachments.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-3 p-3 bg-muted rounded-lg border border-border flex items-center justify-between"
                                >
                                  <span className="text-sm text-foreground">
                                    {attachments.length}{" "}
                                    {locales.tickets?.modal?.files_selected ||
                                      "file(s) selected"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={removeAttachment}
                                    className="text-destructive hover:text-destructive/80 transition-colors"
                                  >
                                    <XCircle className="h-5 w-5" />
                                  </button>
                                </motion.div>
                              )}
                            </div>

                            {/* Footer Buttons */}
                            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                              <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-6 py-3 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {locales.tickets?.modal?.cancel || "Cancel"}
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {locales.tickets?.modal?.submitting ||
                                      "Submitting..."}
                                  </>
                                ) : (
                                  locales.tickets?.modal?.submit ||
                                  "Submit Ticket"
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </motion.form>
                    )
                  )}
                </AnimatePresence>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
