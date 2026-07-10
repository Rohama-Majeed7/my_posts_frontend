import { test, expect } from "@playwright/test";

test("should register new user and login successfully ", async ({ page }) => {
  await page.goto("https://my-posts-frontend.vercel.app/");

  const uniqueEmail = `testuser${Date.now()}@example.com`;

  await page.getByLabel("Full Name").fill("John Doe");
  await page.getByLabel("Email").fill(uniqueEmail);
  await page.getByLabel("Password").fill("Test@1234");

  await page.getByRole("button", { name: "Create Account" }).click();

  // Wait for toast
  await expect(page.getByText("sign up successfully")).toBeVisible({
    timeout: 15000,
  });

  // If app redirects after showing toast, uncomment below:
  await expect(page).toHaveURL(/login/, { timeout: 10000 });

  await page.getByLabel("Email").fill(uniqueEmail);
  await page.getByLabel("Password").fill("Test@1234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("login successfully")).toBeVisible();
  await expect(page).toHaveURL(/profile/);
  await page.getByRole("link", { name: "Logout" }).click();

  await expect(page).toHaveURL(/login/);
});