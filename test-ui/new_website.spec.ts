import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.is.muni.cz/?lang=cs");
});
test("verify czech and english version", async ({ page }) => {
  await expect(
    page.locator("[aria-label='Informační systém Masarykovy univerzity']"),
  ).toBeVisible();
  await page.click("[href='./?lang=en']");
  await expect(
    page.locator("[aria-label='Masaryk University Information System']"),
  ).toBeVisible();
});
test("login with invalid credentials", async ({ page }) => {
  await page.click("[aria-label='Přihlášení do IS MU']");
  await page.waitForURL("https://muni.islogin.cz/login/*");
  await page.fill("[name='credential_0']", "invalid");
  await page.fill("[name='credential_1']", "invalid");
  await page.click("[type='submit']");
  await expect(page.locator(".chyba")).toBeInViewport();
});
test("find a course", async ({ page }) => {
  await page.click("[aria-label='Vyhledávání']");
  await expect(page.locator("#is_search")).toBeVisible();
  await page.fill("[name='search']", "PV252");
  await page.click("[value='Vyhledat']");
  await page
    .locator("text=Frontend Web Development and User Experience")
    .first()
    .click();
  expect(page.url()).toContain(
    "https://is.muni.cz/predmet/fi/podzim2024/PV252",
  );
});
test("find a book", async ({ page }) => {
  await page.goto("https://is.muni.cz/?lang=en");
  await page.locator("text=Textbooks").click();
  await page
    .getByPlaceholder("Zadejte hledaný výraz, název, nebo autora")
    .fill("Úvod do informatiky");
  await page.click("[value=Vyhledat]");
  await expect(page.locator(".autori")).toContainText("Hliněný, Petr");
});
