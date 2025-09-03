"use client";
import { useFaqsStore } from "@/app/store/useFaqsStore";
import FaqItem from "./FaqItem";
import { useDepartmentPairsStore } from "@/app/store/useDepartmentPairsStore";
import { useEffect } from "react";
import { FAQService } from "@/utils/api/index";

export default function FaqsContainer() {
  const { setFaqs, faqs } = useFaqsStore();
  const { mainDepartmentId, subDepartmentId } = useDepartmentPairsStore();

  useEffect(() => {
    FAQService.viewAll(
      undefined,
      undefined,
      subDepartmentId ?? mainDepartmentId ?? undefined
    ).then((res) => setFaqs(res.data.data));
  }, [mainDepartmentId, subDepartmentId]);

  return (
    <>
      {faqs.length > 0 ? (
        <div className="space-y-3 bg-card p-6 rounded-lg shadow-lg border border-border">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} {...faq} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-card rounded-lg shadow-lg border border-border">
          <h3 className="text-xl font-semibold text-card-foreground">
            No FAQs found
          </h3>
          <p className="text-muted-foreground mt-2">
            There are no FAQs for this topic. Try selecting a different filter.
          </p>
        </div>
      )}
    </>
  );
}
