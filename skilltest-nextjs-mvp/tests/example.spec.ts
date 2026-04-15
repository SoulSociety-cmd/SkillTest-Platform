import { test, expect } from '@playwright/test';

test('calculator todo test', async ({ page }) => {
  await page.goto('/test/calculator');
  await page.fill('textarea[placeholder*=\"code\"]', `function calculate(a, op, b) {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
  }`);
  await page.click('button:has-text(\"Run Tests\")');
  await expect(page.locator('[class*=\"emerald\"]')).toBeVisible();
});

