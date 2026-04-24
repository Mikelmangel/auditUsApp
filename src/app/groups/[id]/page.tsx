import GroupPageClient from "./GroupPageClient";

export function generateStaticParams() {
  return [];
}

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  return <GroupPageClient params={params} />;
}