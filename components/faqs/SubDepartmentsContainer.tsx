"use client";
import { useSubDepartmentsStore } from "@/app/store/useSubDepartmentsStore";
import SubDepartmentForCategory from "./SubDepartmentForCategory";
import { useState } from "react";
import { useDepartmentPairsStore } from "@/app/store/useDepartmentPairsStore";

export default function SubDepartmentsContainer() {
  const { subDepartments } = useSubDepartmentsStore();
  const [selectedSubDepartment, setSelectedSubDepartment] = useState<
    string | null
  >(null);
  const { setSubDepartmentId } = useDepartmentPairsStore();

  const handleSetSelectedSubDepartment = (id: string | null) => {
    setSelectedSubDepartment(id);
    setSubDepartmentId(id);
  };

  return (
    <>
      {subDepartments.length > 0 && (
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2 mb-8 p-4 bg-secondary/50 border border-border rounded-lg animate-fade-in">
          <button
            onClick={() => handleSetSelectedSubDepartment(null)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              selectedSubDepartment === null
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
    </>
  );
}
