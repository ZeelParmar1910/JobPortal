import { expect, test } from "@playwright/test";

test("login, board render, and dashboard toggle", async ({ page }) => {
  await page.route("**/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ access_token: "fake-token", token_type: "bearer" }),
    });
  });

  await page.route("**/applications", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 7,
            company: "Northwind",
            role: "Frontend Intern",
            track: "Frontend",
            status: "Applied",
            notes: "Playwright test record",
            date_applied: "2026-08-03",
            created_at: "2026-08-03T00:00:00",
          },
        ]),
      });
      return;
    }

    await route.fulfill({ status: 204, body: "" });
  });

  await page.route("**/applications/*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 7,
        company: "Northwind",
        role: "Frontend Intern",
        track: "Frontend",
        status: "Interview",
        notes: "Playwright test record",
        date_applied: "2026-08-03",
        created_at: "2026-08-03T00:00:00",
      }),
    });
  });

  await page.route("**/analytics/summary", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        total_applications: 1,
        total_responses: 1,
        response_rate: 100,
        by_track: { Frontend: 1 },
        by_status: { Applied: 1 },
      }),
    });
  });

  await page.goto("/");

  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin123");
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Application Pipeline" })).toBeVisible();
  await expect(page.getByText("Northwind")).toBeVisible();

  await page.getByRole("button", { name: "Dashboard" }).click();
  await expect(page.getByRole("heading", { name: "Applications by Track" })).toBeVisible();
  await expect(page.getByText("Response Rate")).toBeVisible();
});
