import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
test("find-watman", async ({ page }) => {
  await expect(page.getByAltText("This is watman")).toBeInViewport();
});
test("find-site-c", async ({ page }) => {
  await expect(page.locator("#site-c")).not.toBeInViewport();
});
test("click on site-a and check notifications", async ({ page }) => {
  await page.click("#site-a");
  await expect(page.locator(".uk-notification")).toContainText(
    "Going to factorials in 3s...",
  );
  await expect(page.locator(".uk-notification")).toContainText(
    "Going to factorials in 2s...",
  );
  await expect(page.locator(".uk-notification")).toContainText(
    "Going to factorials in 1s...",
  );
  //wait for 3 seconds
  await page.waitForTimeout(3000);
  expect(page.url()).toBe("http://127.0.0.1:8080/site_a.html");
});
test("click on site-b and check notifications", async ({ page }) => {
  await page.click("#site-b");
  await expect(page.locator(".uk-notification")).toContainText(
    "Going to fibonacci in 3s...",
  );
  await expect(page.locator(".uk-notification")).toContainText(
    "Going to fibonacci in 2s...",
  );
  await expect(page.locator(".uk-notification")).toContainText(
    "Going to fibonacci in 1s...",
  );
  await page.waitForTimeout(3000);
  expect(page.url()).toBe("http://127.0.0.1:8080/site_b.html");
});
