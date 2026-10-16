import crypto from "node:crypto";

const API = process.env.WP_API_URL!;
let testCookie = "";

// InfinityFree's challenge page contains 3 hex values (key, iv, ciphertext)
function solveChallenge(html: string): string | null {
  const parts = [...html.matchAll(/toNumbers\("([0-9a-f]+)"\)/g)].map((m) => m[1]);
  if (parts.length < 3) return null;
  const [key, iv, data] = parts.map((h) => Buffer.from(h, "hex"));
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  decipher.setAutoPadding(false);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("hex");
}

async function wpFetch(path: string) {
  const url = `${API}${path}${path.includes("?") ? "&" : "?"}i=1`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        ...(testCookie ? { Cookie: `__test=${testCookie}` } : {}),
      },
    });
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      const solved = solveChallenge(text);
      if (!solved) throw new Error("Blocked by host: " + text.slice(0, 200));
      testCookie = solved;
    }
  }
  throw new Error("Could not pass the InfinityFree check");
}

export async function getPosts() {
  return wpFetch("/posts?_embed");
}

export async function getPost(slug: string) {
  const posts = await wpFetch(`/posts?slug=${slug}&_embed`);
  return posts[0] ?? null;
}