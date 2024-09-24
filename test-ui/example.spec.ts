import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";

test("find-watman", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByAltText("This is watman")).toBeInViewport();
});
test("find-site-c", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#site-c")).toBeInViewport();
});
