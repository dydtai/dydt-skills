import { writeFile } from "node:fs/promises";

const SPEC_URL = "https://dydt.ai/openapi.json";

const response = await fetch(SPEC_URL, { headers: { Accept: "application/json" } });
if (!response.ok) throw new Error(`${SPEC_URL} returned HTTP ${response.status}`);
const spec = await response.json();
const operations = Object.values(spec.paths).filter((item) => item.get).length;
await writeFile(new URL("../spec/openapi.json", import.meta.url), `${JSON.stringify(spec, null, 2)}\n`);
console.log(`spec/openapi.json: ${operations} operations from ${SPEC_URL}`);
