import { execSync } from "node:child_process";

const vc =
  "C:/Users/soham/AppData/Local/npm-cache/_npx/67eb4586ca667318/node_modules/vercel/dist/index.js";
const out = execSync(`node "${vc}" ls goat --json`, {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
const arr = JSON.parse(out).deployments;
for (const d of arr.slice(0, 10)) {
  console.log(
    new Date(d.createdAt).toISOString(),
    "|",
    d.state,
    "|",
    d.meta && d.meta.githubCommitRef,
    "|",
    (d.meta && d.meta.githubCommitSha || "").slice(0, 7),
    "|",
    d.url
  );
}
