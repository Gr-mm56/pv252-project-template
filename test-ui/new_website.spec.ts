import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";

//page performance is abysmal, some tests fail due to timeout

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.metal-archives.com");
  await page.waitForURL("https://www.metal-archives.com/");
});
test("find existing band", async ({ page }) => {
  await page.fill("#searchQueryBox", "Keldian");
  await page.click(".btn_submit");
  await page.waitForURL("https://www.metal-archives.com/bands/Keldian/89938");
  expect(page.url()).toContain("https://www.metal-archives.com/bands/Keldian");
});
test("submit empty search", async ({ page }) => {
  await page.click(".btn_submit");
  await page.waitForURL("https://www.metal-archives.com/search**");
  expect(page.url()).toContain("https://www.metal-archives.com/search");
  await page.waitForSelector("text=Please enter at least one keyword");
  await expect(page.locator("#content_wrapper")).toContainText(
    "Please enter at least one keyword",
  );
});
test("find non-existing band", async ({ page }) => {
  await page.fill("#searchQueryBox", "564658");
  await page.click(".btn_submit");
  await page.waitForURL("https://www.metal-archives.com/search**");
  expect(page.url()).toContain("https://www.metal-archives.com/search");
  await page.waitForSelector("text=No matches found.");
  await expect(page.locator("#content_wrapper")).toContainText(
    "No matches found.",
  );
});
test("registration", async ({ page }) => {
  await page.click("[href='https://www.metal-archives.com/user/signup']");
  await page.waitForURL("https://www.metal-archives.com/user/signup");
  await expect(page.locator("#username")).toBeVisible();
  await expect(page.locator("#password1")).toBeVisible();
  await expect(page.locator("#password2")).toBeInViewport();
  await expect(page.locator("#email")).toBeInViewport();
});
test("use advanced search ", async ({ page }) => {
  await page.click("text=Advanced search");
  await page.waitForURL("https://www.metal-archives.com/search/advanced/*");
  await page.click("[href='#albums']");
  await expect(page.locator(".searchFilterTitle").nth(1)).toContainText(
    "Search for releases",
  );
  await page.fill("#releaseTitle", "With Doom We Come");
  await page.click("[value='Perform search']:visible");
  await expect(page.locator("#searchResultsAlbum")).toContainText("Summoning");
});
