import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { contrast } from "@/lib/contrast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

type Mode = "light" | "dark";

function parseBlocks(css: string) {
  function block(marker: string) {
    const start = css.indexOf(marker);
    const open = css.indexOf("{", start);
    const close = css.indexOf("}", open);
    const out: Record<string, string> = {};
    for (const m of css.slice(open + 1, close).matchAll(/--color-([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)) {
      out[m[1]] = m[2];
    }
    return out;
  }
  return {
    light: block(':root, [data-theme="light"]'),
    dark: block('[data-theme="dark"]'),
  };
}

const { light, dark } = parseBlocks(
  readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8")
);

function ContrastChip({ fg, bg }: { fg: string; bg: string }) {
  const ratio = contrast(fg, bg);
  const pass = ratio >= 4.5;
  return (
    <span
      className={
        "inline-flex items-center rounded-[var(--radius-xs)] px-1.5 py-0.5 font-mono text-[length:var(--text-micro)] " +
        (pass ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900")
      }
    >
      {ratio.toFixed(2)}:1
    </span>
  );
}

function RampTable({ mode }: { mode: Mode }) {
  const tokens = mode === "light" ? light : dark;
  const pairs: [string, string, number][] = [
    ["text", "bg", 4.5],
    ["text-muted", "surface", 4.5],
    ["text-subtle", "bg", 4.5],
    ["accent", "bg", 4.5],
    ["accent-fg", "accent", 4.5],
    ["accent on accent-subtle", "accent-subtle", 4.5],
    ["border-interactive", "surface", 3.0],
    ["focus-ring on bg", "bg", 3.0],
    ["success on surface", "surface", 4.5],
    ["warning on surface", "surface", 4.5],
    ["danger on surface", "surface", 4.5],
  ];
  return (
    <div className="overflow-x-auto rounded-md border border-[color:var(--color-border)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[color:var(--color-border)]">
            <th className="p-2 text-left font-medium">Swatch</th>
            <th className="p-2 text-left font-medium">Token</th>
            <th className="p-2 text-left font-medium">Hex</th>
            <th className="p-2 text-left font-medium">Pairing contrast</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tokens).map(([name, hex]) => (
            <tr key={name} className="border-b border-[color:var(--color-border-hairline)]">
              <td className="p-2">
                <span
                  className="inline-block h-6 w-10 rounded-[var(--radius-xs)] border border-[color:var(--color-border-hairline)]"
                  style={{ background: hex }}
                  aria-hidden="true"
                />
              </td>
              <td className="p-2 font-mono text-[length:var(--text-micro)]">--color-{name}</td>
              <td className="p-2 font-mono text-[length:var(--text-micro)]">{hex}</td>
              <td className="p-2">
                {(() => {
                  const pair = pairs.find(([fg]) => fg === name);
                  if (!pair)
                    return <span className="text-muted-foreground">—</span>;
                  return (
                    <ContrastChip fg={hex} bg={tokens[pair[1]]} />
                  );
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="shell space-y-16 py-16">
      <header className="space-y-3">
        <p className="micro">Internal · v3 design system</p>
        <h1 className="display">Primitives, states, scales.</h1>
        <div className="theme-seg-static micro">Toggle theme from the header control.</div>
      </header>

      {/* TYPE SCALE */}
      <section aria-label="Type scale" className="space-y-4">
        <h2 className="micro">Type scale · ratio 1.333</h2>
        {(
          [
            ["display", "--text-display"],
            ["h1", "--text-h1"],
            ["h2", "--text-h2"],
            ["h3", "--text-h3"],
            ["body-lg", "--text-body-lg"],
            ["body", "--text-body"],
            ["small", "--text-small"],
            ["caption", "--text-caption"],
          ] as const
        ).map(([name, varName]) => (
          <div key={name} className="flex items-baseline gap-6 border-b py-3">
            <span className="micro w-24 shrink-0">{name}</span>
            <span style={{ fontSize: `var(${varName})`, letterSpacing: "var(--track-body)" }}>
              The quick brown fox
            </span>
          </div>
        ))}
      </section>

      {/* SPACING */}
      <section aria-label="Spacing scale" className="space-y-3">
        <h2 className="micro">Spacing · 4px base</h2>
        <div className="space-y-1.5">
          {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="micro w-16 shrink-0">space-{i}</span>
              <span
                className="h-3 rounded-[2px] bg-[color:var(--color-accent-subtle)]"
                style={{ width: `calc(var(--space-${i}) * 4)` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </section>

      {/* BUTTONS */}
      <section aria-label="Buttons" className="space-y-4">
        <h2 className="micro">Buttons · variants × sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button data-size="sm" size="sm">
            Small
          </Button>
          <Button data-size="md">Medium</Button>
          <Button data-size="lg" size="lg">
            Large
          </Button>
        </div>
      </section>

      {/* INPUTS */}
      <section aria-label="Inputs" className="grid max-w-xl gap-5">
        <div className="space-y-2">
          <Label htmlFor="ds-input">Input</Label>
          <Input id="ds-input" placeholder="you@company.com" />
          <p className="text-sm text-[color:var(--color-danger)]">Error message goes here.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ds-textarea">Textarea</Label>
          <Textarea id="ds-textarea" rows={3} placeholder="Project details…" />
        </div>
        <div className="space-y-2">
          <label className="micro">Select</label>
          <Select defaultValue="build">
            <SelectTrigger id="ds-select" className="w-full">
              <SelectValue placeholder="Choose…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="build">Build</SelectItem>
              <SelectItem value="grow">Grow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked /> Checkbox
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroup defaultValue="a" className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="a" /> A
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="b" /> B
              </label>
            </RadioGroup>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch defaultChecked /> Switch
          </label>
        </div>
      </section>

      {/* CARD + BADGE + TABLE */}
      <section aria-label="Card, badge, table" className="grid max-w-2xl gap-6">
        <div className="rounded-md border p-6 shadow-sm" style={{ background: "var(--color-surface)" }}>
          <p className="micro">Card · lit top edge</p>
          <p className="mt-2 font-medium text-[color:var(--color-text)]">Surface raised card</p>
          <p className="muted mt-1 text-sm">
            Depth comes from surface steps, hairlines and lit edges — not shadows on dark.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="secondary">Secondary</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Service</TableHead>
              <TableHead className="text-right">Timeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Web Development</TableCell>
              <TableCell className="tabular-nums">4–6 weeks</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mobile App Development</TableCell>
              <TableCell className="tabular-nums">8–12 weeks</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* TABS + DIALOG + POPOVER + TOOLTIP */}
      <section aria-label="Overlays and tabs" className="max-w-2xl space-y-6">
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">Tab one</TabsTrigger>
            <TabsTrigger value="two">Tab two</TabsTrigger>
          </TabsList>
          <TabsContent value="one" className="pt-4 text-sm text-muted-foreground">
            Tab one content.
          </TabsContent>
          <TabsContent value="two" className="pt-4 text-sm text-muted-foreground">
            Tab two content.
          </TabsContent>
        </Tabs>
        <p className="micro">Dialog, popover and tooltip demos live inside real pages (Phase 3).</p>
      </section>

      {/* COLOUR RAMPS */}
      <section aria-label="Colour ramps" className="space-y-10">
        <h2 className="micro">Colour ramps · live computed contrast</h2>
        <RampTable mode="light" />
        <RampTable mode="dark" />
      </section>
    </main>
  );
}



