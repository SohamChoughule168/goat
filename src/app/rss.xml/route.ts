import { insights } from "@/content/insights";
import { site } from "@/content/site";

export function GET() {
  const items = insights
    .map(
      (i) =>
        `\n  <item>\n    <title>${i.title}</title>\n    <link>${site.url}/insights/${i.slug}</link>\n    <description>${i.excerpt}</description>\n    <pubDate>${new Date(i.date).toUTCString()}</pubDate>\n    <guid>${site.url}/insights/${i.slug}</guid>\n  </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${site.name} Insights</title><link>${site.url}/insights</link><description>Notes from the workbench</description>${items}\n</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
