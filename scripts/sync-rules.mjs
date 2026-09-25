import { readdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const START = "<!-- shared-rules:start -->";
const END = "<!-- shared-rules:end -->";

export async function sharedBlock() {
  const rules = await readFile(new URL("scripts/shared-rules.md", root), "utf8");
  return `${START}\n${rules.trim()}\n${END}`;
}

export function withRules(skill, block) {
  const start = skill.indexOf(START);
  const end = skill.indexOf(END);
  if (start === -1 || end === -1) throw new Error("missing shared-rules markers");
  return skill.slice(0, start) + block + skill.slice(end + END.length);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const block = await sharedBlock();
  for (const name of await readdir(new URL("skills/", root))) {
    const file = new URL(`skills/${name}/SKILL.md`, root);
    const skill = await readFile(file, "utf8");
    await writeFile(file, withRules(skill, block));
  }
  console.log("shared rules synced into every skill");
}
