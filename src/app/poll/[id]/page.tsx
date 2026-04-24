import PollPageClient from "./PollPageClient";

export function generateStaticParams() {
  return [];
}

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  return <PollPageClient params={params} />;
}