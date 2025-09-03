"use client";
import React from "react";
import { Building2 } from "lucide-react";

interface Department {
  name: string;
  id: string;
}

interface DepartmentsListProps {
  departments: Department[];
  onDepartmentSelect: (id: string) => void;
  className?: string;
}

export default function DepartmentsList({
  departments,
  onDepartmentSelect,
  className = "",
}: DepartmentsListProps) {
  const [selectedDepartment, setSelectedDepartment] = React.useState<
    string | null
  >(null);

  const handleDepartmentSelect = (id: string) => {
    setSelectedDepartment(id);
    onDepartmentSelect(id);
  };

  if (departments.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-sm font-semibold text-foreground">Departments</h3>
        <p className="text-xs text-muted-foreground">
          No departments available.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-semibold text-foreground">Departments</h3>
      <div className="flex flex-row flex-wrap gap-2">
        {departments.map((department) => (
          <button
            key={department.id}
            onClick={() => handleDepartmentSelect(department.id)}
            className={`group flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              selectedDepartment === department.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
            title={`Select ${department.name} department`}
          >
            <Building2 className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
            <span className="truncate">{department.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
