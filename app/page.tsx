import Link from "next/link";
import { getPosts } from "@/lib/wp";

export default async function Home() {
  const posts = await getPosts();
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {posts.map((post: any) => (
        <article key={post.id} className="mb-6">
          <Link href={`/posts/${post.slug}`}>
            <h2
              className="text-xl font-semibold"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </Link>
          <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        </article>
      ))}
    </main>
  );
}