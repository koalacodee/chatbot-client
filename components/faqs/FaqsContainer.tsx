"use client";
import { useFaqsStore } from "@/app/store/useFaqsStore";
import FaqItem from "./FaqItem";
import { useDepartmentPairsStore } from "@/app/store/useDepartmentPairsStore";
import { useEffect } from "react";
import { FAQService } from "@/utils/api/index";
import { useAttachmentsStore } from "@/app/store/useAttachmentsStore";
import { motion } from "framer-motion";
import { useFaqTranslationStore } from "@/app/store/useFaqTranslationStore";

export default function FaqsContainer() {
  const { setFaqs, faqs } = useFaqsStore();
  const { mainDepartmentId, subDepartmentId } = useDepartmentPairsStore();
  const { appendAttachments } = useAttachmentsStore();
  const { setFaqTranslations } = useFaqTranslationStore();

  useEffect(() => {
    FAQService.viewAll(
      undefined,
      undefined,
      subDepartmentId ?? mainDepartmentId ?? undefined
    ).then((res) => {
      setFaqs(res.data.data.faqs);
      appendAttachments(res.data.data.attachments);
      setFaqTranslations(res.data.data.translations);
    });
  }, [mainDepartmentId, subDepartmentId]);

  return (
    <>
      {faqs.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative space-y-4 bg-card/80 p-8 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-border/20 backdrop-blur-sm"
        >
          {/* Background glow effect */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl -z-10"
          />
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <FaqItem {...faq} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative text-center py-16 px-8 bg-card/80 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-border/20 backdrop-blur-sm"
        >
          {/* Background glow effect */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl -z-10"
          />
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xl font-semibold text-card-foreground"
          >
            No FAQs found
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-muted-foreground mt-2"
          >
            There are no FAQs for this topic. Try selecting a different filter.
          </motion.p>
        </motion.div>
      )}
    </>
  );
}
