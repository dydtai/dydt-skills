import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { sharedBlock, withRules } from "../scripts/sync-rules.mjs";
import { operationsOf } from "../dist/spec.js";
import { streamsOf } from "../dist/streams.js";

const root = new URL("../", import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));
const operations = new Map(operationsOf(await readJson("spec/openapi.json")).map((op) => [op.command, op]));
const streams = new Map(streamsOf(await readJson("spec/asyncapi.json")).map((stream) => [stream.id, stream]));
const BUILT_IN = new Set(["config", "help", "spec", "list", "version"]);
const WATCH_OPTIONS = new Set(["seconds", "max-events"]);
const skillNames = await readdir(new URL("skills/", root));

async function skillFiles(name) {
  const dir = new URL(`skills/${name}/`, root);
  const references = existsSync(new URL("references/", dir)) ? await readdir(new URL("references/", dir)) : [];
  return ["SKILL.md", ...references.map((file) => `references/${file}`)].map((file) => `skills/${name}/${file}`);
}

async function documentedFiles() {
  const files = ["AGENTS.md", "README.md"];
  for (const name of skillNames) files.push(...(await skillFiles(name)));
  return files;
}

function invocations(text) {
  return [...text.matchAll(/`dydt ([a-z][a-z-]*)((?: [^`]*)?)`/g)].map((match) => {
    const words = match[2].trim().split(/\s+/).filter(Boolean);
    return {
      command: match[1],
      target: words.slice(0, 1).find((word) => /^[a-z_]+$/.test(word)),
      options: [...match[2].matchAll(/--([A-Za-z_-]+)/g)].map((option) => option[1]),
    };
  });
}

function checkOptions(problems, where, known, options) {
  for (const option of options) {
    if (option === "raw" || option === "help") continue;
    if (!known.has(option)) problems.push(`${where} has no --${option}`);
  }
}

test("every documented command, stream, and option exists in the API specs", async () => {
  const problems = [];
  for (const file of await documentedFiles()) {
    const text = await readFile(new URL(file, root), "utf8");
    for (const { command, target, options } of invocations(text)) {
      if (BUILT_IN.has(command)) continue;
      if (command === "watch") {
        if (!target) continue;
        const stream = streams.get(target);
        if (!stream) {
          problems.push(`${file}: unknown stream ${target}`);
          continue;
        }
        const known = new Set([...stream.fields.map((field) => field.name), ...WATCH_OPTIONS]);
        checkOptions(problems, `${file}: watch ${target}`, known, options);
        continue;
      }
      const operation = operations.get(command);
      if (!operation) {
        problems.push(`${file}: unknown command ${command}`);
        continue;
      }
      checkOptions(problems, `${file}: ${command}`, new Set(operation.parameters.map((param) => param.name)), options);
    }
  }
  assert.deepEqual(problems, []);
});

test("every skill has a name matching its folder and a routing description", async () => {
  for (const name of skillNames) {
    const text = await readFile(new URL(`skills/${name}/SKILL.md`, root), "utf8");
    const front = text.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(front, `${name} has frontmatter`);
    assert.match(front[1], new RegExp(`^name: ${name}$`, "m"));
    const description = front[1].match(/^description: (.+)$/m)?.[1] ?? "";
    assert.ok(description.length > 80 && description.length <= 1024, `${name} description length`);
  }
});

test("skills are self-contained once installed on their own", async () => {
  const problems = [];
  for (const name of skillNames) {
    for (const file of await skillFiles(name)) {
      const text = await readFile(new URL(file, root), "utf8");
      if (/AGENTS\.md|docs\//.test(text)) problems.push(`${file} points outside its skill folder`);
      for (const [, link] of text.matchAll(/\]\(([^)#]+)\)/g)) {
        if (/^https?:/.test(link)) continue;
        if (!existsSync(new URL(link, new URL(file, root)))) problems.push(`${file} links to missing ${link}`);
      }
    }
  }
  assert.deepEqual(problems, []);
});

test("every skill carries the current shared rules", async () => {
  const block = await sharedBlock();
  for (const name of skillNames) {
    const text = await readFile(new URL(`skills/${name}/SKILL.md`, root), "utf8");
    assert.equal(withRules(text, block), text, `${name}: run npm run sync-rules`);
  }
});

test("every API operation is used by at least one skill", async () => {
  let text = "";
  for (const name of skillNames) text += await readFile(new URL(`skills/${name}/SKILL.md`, root), "utf8");
  const unused = [...operations.keys()].filter((command) => !text.includes(`\`dydt ${command}`));
  assert.deepEqual(unused, []);
});
