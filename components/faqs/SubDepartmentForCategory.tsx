"use client";

export default function SubDepartmentForCategory({
  subDept,
  selectedSubDepartment,
  setSelectedSubDepartment,
}: {
  subDept: { id: string; name: string };
  selectedSubDepartment: string | null;
  setSelectedSubDepartment: (id: string) => void;
}) {
  return (
    <button
      key={subDept.id}
      onClick={() => setSelectedSubDepartment(subDept.id)}
      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
        selectedSubDepartment === subDept.id
          ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
          : "bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {subDept.name}
    </button>
  );
}
