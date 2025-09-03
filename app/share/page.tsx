import ShareCategory from "./components/ShareCategory";

export default async function SharedDepartmentPage({
  searchParams,
}: {
  searchParams: Promise<{ key: string }>;
}) {
  return <ShareCategory key={(await searchParams).key} />;
}
