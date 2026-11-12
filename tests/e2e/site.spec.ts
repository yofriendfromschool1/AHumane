import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("marketing site", () => {
  test("home page renders the hero and key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Humanize your writing");
    await expect(page.getByText("Why AHumane?")).toBeVisible();
    await expect(page.getByText("One price: $0")).toBeVisible();
    await expect(page.getByText("Frequently asked questions")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
    await page.getByRole("button", { name: "Close menu" }).last().click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
  });

  test("pricing is free and has no paywall", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Everything. $0.");
    const zeros = await page.getByText("$0", { exact: true }).count();
    expect(zeros).toBeGreaterThanOrEqual(3);
  });

  test("blog index and article render", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("sounds human");
    await page.getByRole("link", { name: /Introducing AHumane/ }).first().click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Introducing AHumane");
    await expect(page.getByRole("heading", { name: "Model-first, with a local fallback" })).toBeVisible();
  });

  test("demo login reaches the studio", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill("writer@example.com");
    await page.getByRole("button", { name: "Continue with email" }).click();
    await page.waitForURL("**/studio");
    await expect(page.getByText("What are we writing today?")).toBeVisible();
  });
});

test.describe("tools", () => {
  test("humanizer runs a pro pass and shows scores", async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/studio/humanizer");
    await page.waitForTimeout(1500);
    const deep = page.locator('input[type="checkbox"]').first();
    if (await deep.count()) {
      if (await deep.isChecked()) await deep.uncheck();
    }
    await page.getByRole("button", { name: "Sample", exact: true }).click();
    await page.getByRole("button", { name: "Humanize", exact: true }).click();
    await expect(page.getByText(/facts kept/)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText("Review (", { exact: false })).toBeVisible();
    const text = await page.locator("textarea[aria-label='Text to humanize']").inputValue();
    expect(text.length).toBeGreaterThan(100);
  });

  test("detector scans a sample and explains the result", async ({ page }) => {
    await page.goto("/ai-detector");
    await page.getByRole("button", { name: "ChatGPT-style" }).click();
    await page.getByRole("button", { name: "Scan for AI" }).click();
    await expect(page.getByText("Likely AI", { exact: true })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("heading", { name: "Signal breakdown" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sentence heat-map" })).toBeVisible();
  });

  test("documents save locally", async ({ page }) => {
    await page.goto("/studio/documents");
    await page.getByRole("button", { name: "New document" }).first().click();
    await page.locator("textarea[aria-label='Document text']").fill("A local draft that should survive a reload.");
    await page.getByRole("button", { name: /Save/ }).click();
    await expect(page.getByText("All changes saved")).toBeVisible();
    await page.reload();
    await expect(page.getByText("A local draft that should survive a reload.")).toBeVisible();
  });
});

test.describe("accessibility", () => {
  for (const route of ["/", "/pricing", "/ai-humanizer"]) {
    test(`no serious axe violations on ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const serious = results.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      );
      expect(serious, JSON.stringify(serious.map((v) => v.id), null, 2)).toEqual([]);
    });
  }
});
