import fs from "fs/promises";
import { parse } from "markdown-wasm";
import { minify } from "@swc/html";

const [template, markdown] = await Promise.all([
  fs.readFile("template.html", "utf-8"),
  fs.readFile("README.md", "utf-8"),
  fs.cp("public", "dist", { recursive: true }).catch(() => {}),
]);
let result = template;
const now = new Date();
const props = {
  year: now.getFullYear(),
  date: now.toISOString(),
  content: parse(markdown),
};

for (const [key, value] of Object.entries(props)) {
  result = result.replace(new RegExp(`{${key}}`, "g"), value);
}

const { code } = await minify(Buffer.from(result), {
  collapseWhitespaces: "smart",
  removeComments: true,
});

await fs.writeFile("dist/index.html", code);
