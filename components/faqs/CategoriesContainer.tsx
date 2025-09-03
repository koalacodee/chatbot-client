"use client";

import { ViewAllMainDepartments200ResponseDataInner } from "@/utils/api/generated";
import { DepartmentService } from "@/utils/api/index";
import { useEffect, useState } from "react";
import PublicCategory from "./PublicCateogry";
import { useSubDepartmentsStore } from "@/app/store/useSubDepartmentsStore";
import { useDepartmentPairsStore } from "@/app/store/useDepartmentPairsStore";

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
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <button
        onClick={() => handleSetSelectedCategory(null)}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
          !selectedCategoryId
            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
            : "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80"
        }`}
      >
        All Topics
      </button>
      {categories.map((category) => (
        <PublicCategory
          key={category.id}
          name={category.name}
          selectedCategoryId={selectedCategoryId}
          categoryId={category.id}
          handleSelectCategory={handleSetSelectedCategory}
        />
      ))}
    </div>
  );
}
