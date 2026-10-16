import { notFound } from "next/navigation";
import { getPost } from "@/lib/wp";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1
        className="text-3xl font-bold mb-4"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      <article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </main>
  );
}