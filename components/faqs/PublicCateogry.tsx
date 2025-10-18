"use client";

import { motion } from "framer-motion";

export default function PublicCategory({
  handleSelectCategory,
  name,
  selectedCategoryId,
  categoryId,
}: {
  handleSelectCategory: (id: string) => void;
  name: string;
  selectedCategoryId: string | null;
  categoryId: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleSelectCategory(categoryId)}
      className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
        selectedCategoryId === categoryId
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
          : "bg-card/80 text-card-foreground border border-border/50 hover:bg-accent/80 hover:border-accent/50 hover:shadow-md backdrop-blur-sm"
      }`}
    >
      {name}
    </motion.button>
  );
}
