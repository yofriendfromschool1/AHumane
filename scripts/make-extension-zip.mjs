import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const extensionDir = path.join(root, "public", "extension");
const output = path.join(root, "public", "ahumane-extension.zip");
const files = ["manifest.json", "background.js", "popup.html", "popup.js", "icon16.png", "icon48.png", "icon128.png"];

for (const file of files) {
  if (!fs.existsSync(path.join(extensionDir, file))) {
    throw new Error(`Missing extension file: ${file}`);
  }
}
if (fs.existsSync(output)) fs.rmSync(output);
execFileSync("zip", ["-q", "-j", output, ...files.map((file) => path.join(extensionDir, file))], {
  stdio: "inherit",
});
const size = fs.statSync(output).size;
console.log(`Wrote ${path.relative(root, output)} (${size} bytes)`);
