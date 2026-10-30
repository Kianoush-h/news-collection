import fs from "fs";
import path from "path";

/**
 * IndexNow: tell Bing, Yandex, Seznam, Naver (and anyone else on the
 * protocol) about a new or changed URL the moment it exists, instead of
 * waiting for a crawl. The key is a plain text file in /public whose name is
 * the key itself; the engines fetch it once to prove we own the host.
 *
 * Google does not take IndexNow; it gets the sitemap through Search Console.
 */
const HOST = "www.crisiswatch.ca";

function readKey(): string | null {
  try {
    const dir = path.join(process.cwd(), "public");
    const f = fs.readdirSync(dir).find((n) => /^[0-9a-f]{32}\.txt$/.test(n));
    return f ? f.replace(/\.txt$/, "") : null;
  } catch {
    return null;
  }
}

export async function pingIndexNow(urls: string[]): Promise<void> {
  const key = readKey();
  if (!key || urls.length === 0) return;
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation: `https://${HOST}/${key}.txt`,
        urlList: urls,
      }),
    });
    console.log(`[IndexNow] ${urls.length} url(s) -> ${res.status}`);
  } catch (e) {
    console.error("[IndexNow] failed:", e instanceof Error ? e.message : e);
  }
}
