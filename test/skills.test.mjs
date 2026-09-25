import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { operationsOf } from "../dist/spec.js";

const root = new URL("../", import.meta.url);
const spec = JSON.parse(await readFile(new URL("spec/openapi.json", root), "utf8"));
const operations = new Map(operationsOf(spec).map((operation) => [operation.command, operation]));
const BUILT_IN = new Set(["config", "help", "spec", "list", "version"]);

async function markdownFiles() {
  const skills = await readdir(new URL("skills/", root));
  const workflows = await readdir(new URL("docs/workflows/", root));
  return [
    "AGENTS.md",
    "README.md",
    ...skills.map((name) => `skills/${name}/SKILL.md`),
    ...workflows.map((name) => `docs/workflows/${name}`),
  ];
}

function invocations(text) {
  return [...text.matchAll(/`dydt ([a-z-]+)([^`]*)`/g)].map((match) => ({
    command: match[1],
    options: [...match[2].matchAll(/--([A-Za-z_]+)/g)].map((option) => option[1]),
  }));
}

test("every documented command and option exists in the API spec", async () => {
  const problems = [];
  for (const file of await markdownFiles()) {
    const text = await readFile(new URL(file, root), "utf8");
    for (const { command, options } of invocations(text)) {
      if (BUILT_IN.has(command)) continue;
      const operation = operations.get(command);
      if (!operation) {
        problems.push(`${file}: unknown command ${command}`);
        continue;
      }
      const names = new Set(operation.parameters.map((param) => param.name));
      for (const option of options) {
        if (option === "raw" || option === "help") continue;
        if (!names.has(option)) problems.push(`${file}: ${command} has no --${option}`);
      }
    }
  }
  assert.deepEqual(problems, []);
});

test("every skill has a name matching its folder and a description", async () => {
  for (const name of await readdir(new URL("skills/", root))) {
    const text = await readFile(new URL(`skills/${name}/SKILL.md`, root), "utf8");
    const front = text.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(front, `${name} has frontmatter`);
    assert.match(front[1], new RegExp(`^name: ${name}$`, "m"));
    const description = front[1].match(/^description: (.+)$/m)?.[1] ?? "";
    assert.ok(description.length > 80 && description.length <= 1024, `${name} description length`);
  }
});
