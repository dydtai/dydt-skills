import { writeFile } from "node:fs/promises";

const DOCUMENTS = [
  ["openapi", "https://dydt.ai/openapi.json"],
  ["asyncapi", "https://dydt.ai/asyncapi.json"],
];

for (const [name, url] of DOCUMENTS) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  const document = await response.json();
  await writeFile(new URL(`../spec/${name}.json`, import.meta.url), `${JSON.stringify(document, null, 2)}\n`);
  console.log(`spec/${name}.json from ${url}`);
}
