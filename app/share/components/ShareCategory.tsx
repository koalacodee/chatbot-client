"use client";
import FaqItem from "@/components/faqs/FaqItem";
import SubDepartmentForCategory from "@/components/faqs/SubDepartmentForCategory";
import SupportTicketCTA from "@/components/ui/SupportTicketCTA";
import { ViewAllSubDepartments200ResponseDataInner } from "@/utils/api/generated/models";
import { DepartmentService, FAQService } from "@/utils/api/index";
import { useEffect, useState } from "react";

export default function ShareCategory({ shareKey }: { shareKey: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subDepartments, setSubDepartments] = useState<
    ViewAllSubDepartments200ResponseDataInner[]
  >([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [selectedSubDepartment, setSelectedSubDepartment] = useState<
    string | null
  >(null);

  // Fetch sub-departments for shared department
  const fetchSubDepartments = async (key: string) => {
    try {
      const response =
        await DepartmentService.getSubDepartmentsForSharedDepartment(key);
      const subDepartments = response.data.data || [];
      setSubDepartments(subDepartments);
      return subDepartments;
    } catch (err) {
      console.error("Error fetching sub-departments:", err);
      throw new Error("Failed to load sub-departments");
    }
  };

  // Fetch FAQs for shared department
  const fetchSharedDepartmentFaqs = async (key: string) => {
    try {
      const response = await FAQService.getFAQsOfSharedDepartment(key);
      const faqs = response.data.data || [];
      setFaqs(faqs);
      return faqs;
    } catch (err) {
      console.error("Error fetching shared department FAQs:", err);
      throw new Error("Failed to load FAQs");
    }
  };

  // Fetch FAQs for sub-department of shared department
  const fetchSubDepartmentFaqs = async (subId: string, key: string) => {
    try {
      const response =
        await FAQService.getFAQsOfSubDepartmentOfSharedDepartment(subId, key);
      const faqs = response.data.data || [];
      setFaqs(faqs);
      return faqs;
    } catch (err) {
      console.error("Error fetching sub-department FAQs:", err);
      throw new Error("Failed to load sub-department FAQs");
    }
  };

  useEffect(() => {
    if (!shareKey) {
      setError("No access key provided");
      setLoading(false);
      return;
    }

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Clear previous data
        setSubDepartments([]);
        setFaqs([]);
        setSelectedSubDepartment(null);

        // Load initial data
        await Promise.all([
          fetchSubDepartments(shareKey),
          fetchSharedDepartmentFaqs(shareKey),
        ]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [shareKey]);

  // Handle sub-department selection
  useEffect(() => {
    if (!shareKey) return;

    const loadSubDepartmentFaqs = async () => {
      if (selectedSubDepartment) {
        // Fetch FAQs for selected sub-department
        await fetchSubDepartmentFaqs(selectedSubDepartment, shareKey);
      } else {
        // Fetch FAQs for the main shared department
        await fetchSharedDepartmentFaqs(shareKey);
      }
    };

    loadSubDepartmentFaqs();
  }, [selectedSubDepartment, shareKey]);

  const handleSetSelectedSubDepartment = (id: string | null) => {
    setSelectedSubDepartment(id);
  };

  if (!shareKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            No access key provided in the URL.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading department data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            How can we help you?
          </h1>
          <p className="text-muted-foreground">
            Browse our comprehensive FAQ section to find answers and get
            assistance.
          </p>
        </div>

        <SupportTicketCTA />

        <div className="space-y-8">
          {/* Sub-departments container */}
          {subDepartments.length > 0 && (
            <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2 mb-8 p-4 bg-secondary/50 border border-border rounded-lg animate-fade-in">
              <button
                onClick={() => handleSetSelectedSubDepartment(null)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${selectedSubDepartment === null
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                    : "bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                All
              </button>
              {subDepartments.map((subDept) => (
                <SubDepartmentForCategory
                  key={subDept.id}
                  subDept={subDept}
                  selectedSubDepartment={selectedSubDepartment}
                  setSelectedSubDepartment={handleSetSelectedSubDepartment}
                />
              ))}
            </div>
          )}

          {/* FAQs container */}
          {faqs.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-3 bg-card p-6 rounded-lg shadow-lg border border-border">
              {faqs.map((faq) => (
                <FaqItem key={faq.id} {...faq} />
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center py-12 px-6 bg-card rounded-lg shadow-lg border border-border">
              <h3 className="text-xl font-semibold text-card-foreground">
                No FAQs found
              </h3>
              <p className="text-muted-foreground mt-2">
                There are no FAQs for this topic. Try selecting a different
                filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
