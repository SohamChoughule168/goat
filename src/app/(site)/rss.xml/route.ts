import { insights } from "@/content/insights";
import { site } from "@/content/site";

export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const items = insights
    .map(
      (i) =>
        `\n  <item>\n    <title>${escapeXml(i.title)}</title>\n    <link>${site.url}/insights/${i.slug}/</link>\n    <description>${escapeXml(i.excerpt)}</description>\n    <pubDate>${new Date(`${i.date}T00:00:00+05:30`).toUTCString()}</pubDate>\n    <guid>${site.url}/insights/${i.slug}/</guid>\n  </item>`
    )
    .join("");

  const latest = insights[0];
  const lastBuildDate = latest
    ? `\n    <lastBuildDate>${new Date(`${latest.date}T00:00:00+05:30`).toUTCString()}</lastBuildDate>`
    : "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(site.name)} Insights</title><link>${site.url}/insights/</link><description>Practical notes on websites, admissions systems and growth for coaching institutes, schools and edtech teams.</description><language>en-IN</language>${lastBuildDate}\n    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>${items}\n</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
