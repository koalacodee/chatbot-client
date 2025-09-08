import ShareCategory from "./components/ShareCategory";

export default async function SharedDepartmentPage({
  searchParams,
}: {
  searchParams: Promise<{ key: string }>;
}) {
  const params = await searchParams;
  const key = params.key;

  return <ShareCategory shareKey={key} />;
}
