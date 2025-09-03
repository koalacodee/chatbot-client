"use client";

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
    <button
      onClick={() => handleSelectCategory(categoryId)}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
        selectedCategoryId === categoryId
          ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
          : "bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {name}
    </button>
  );
}
