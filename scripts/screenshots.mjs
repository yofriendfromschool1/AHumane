import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const base = process.env.AHUMANE_URL || "http://127.0.0.1:3210";
const outDir = path.join(process.cwd(), "docs", "screenshots");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});

const pages = [
  ["/", 1440, 1000, "home-1440"],
  ["/", 390, 844, "home-390"],
  ["/ai-humanizer", 1440, 1000, "humanizer-1440"],
  ["/ai-detector", 1440, 1000, "detector-1440"],
  ["/pricing", 1440, 1000, "pricing-1440"],
  ["/blog", 1440, 1000, "blog-1440"],
  ["/studio", 1440, 1000, "studio-1440"],
];

for (const [route, width, height, name] of pages) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(route === "/" ? 5000 : 1500);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  console.log(`${name}: ${overflow ? "OVERFLOW" : "ok"}${errors.length ? ` (${errors.length} console errors)` : ""}`);
  await page.close();
}

await browser.close();
