import {
  Content,
  fetchOneEntry,
  getBuilderSearchParams,
} from "@builder.io/sdk-react-nextjs";
import { builderApiKey } from "@/lib/builder";
import { notFound } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";

export const revalidate = 60; // ISR – odśwież treść co 60 s

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function BuilderCatchAllPage({
  params,
  searchParams,
}: PageProps) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const urlPath = "/" + resolvedParams.slug.join("/");

    // Handle Builder.io API calls with error handling
    let content;
    try {
      content = await fetchOneEntry({
        model: "page",
        apiKey: builderApiKey,
        options: getBuilderSearchParams(resolvedSearchParams),
        userAttributes: { urlPath },
      });
    } catch (error) {
      console.error("Builder.io fetch error:", error);
      // Return notFound instead of throwing error for better UX
      return notFound();
    }

    if (!content) return notFound();

    return (
      <ErrorBoundary>
        <Content model="page" apiKey={builderApiKey} content={content} />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Builder.io page error:", error);
    return notFound();
  }
}
