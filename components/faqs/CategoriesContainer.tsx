"use client";

import { ViewAllMainDepartments200ResponseDataInner } from "@/utils/api/generated";
import { DepartmentService } from "@/utils/api/index";
import { useEffect, useState } from "react";
import PublicCategory from "./PublicCateogry";
import { useSubDepartmentsStore } from "@/app/store/useSubDepartmentsStore";
import { useDepartmentPairsStore } from "@/app/store/useDepartmentPairsStore";
import { motion } from "framer-motion";

export default function CategoriesContainer() {
  const [categories, setCategories] = useState<
    ViewAllMainDepartments200ResponseDataInner[]
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const { setSubDepartments, clearSubDepartments } = useSubDepartmentsStore();
  const { setDepartmentPair } = useDepartmentPairsStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await DepartmentService.viewAllMainDepartments();
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    selectedCategoryId
      ? DepartmentService.viewAllSubDepartments(selectedCategoryId).then(
          (res) => {
            setSubDepartments(res.data.data);
          }
        )
      : clearSubDepartments();
  }, [selectedCategoryId]);

  const handleSetSelectedCategory = (id: string | null) => {
    setSelectedCategoryId(id);
    setDepartmentPair(id, null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Background glow effect */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl -z-10"
      />

      <div className="flex flex-wrap justify-center gap-3 mb-12 relative">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSetSelectedCategory(null)}
          className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
            !selectedCategoryId
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
              : "bg-card/80 text-card-foreground border border-border/50 hover:bg-accent/80 hover:border-accent/50 hover:shadow-md backdrop-blur-sm"
          }`}
        >
          All Topics
        </motion.button>
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          >
            <PublicCategory
              name={category.name}
              selectedCategoryId={selectedCategoryId}
              categoryId={category.id}
              handleSelectCategory={handleSetSelectedCategory}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
