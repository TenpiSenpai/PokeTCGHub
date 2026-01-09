/**
 * E2E tests for homepage
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page title contains "Poke TCG Hub"
    await expect(page).toHaveTitle(/Poke TCG Hub/);
  });

  test('should display header navigation', async ({ page }) => {
    await page.goto('/');

    // Check for navigation elements
    const enMenu = page.getByRole('button', { name: /Upcoming EN Releases/i });
    const jpMenu = page.getByRole('button', { name: /Upcoming JP Releases/i });

    await expect(enMenu).toBeVisible();
    await expect(jpMenu).toBeVisible();
  });

  test('should toggle EN releases dropdown', async ({ page }) => {
    await page.goto('/');

    const enMenu = page.getByRole('button', { name: /Upcoming EN Releases/i });

    // Click to open
    await enMenu.click();

    // Check that menu items are visible
    const perfectOrder = page.getByRole('menuitem', { name: /Perfect Order/i });
    await expect(perfectOrder).toBeVisible();

    // Click again to close
    await enMenu.click();
    await expect(perfectOrder).not.toBeVisible();
  });

  test('should navigate to card set page', async ({ page }) => {
    await page.goto('/');

    // Open EN menu
    const enMenu = page.getByRole('button', { name: /Upcoming EN Releases/i });
    await enMenu.click();

    // Click on a set
    const perfectOrder = page.getByRole('menuitem', { name: /Perfect Order/i });
    await perfectOrder.click();

    // Should navigate to the set page
    await expect(page).toHaveURL(/\/sets\/en\/perfect-order/);
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab to EN menu
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Skip logo
    await page.keyboard.press('Tab'); // Focus on EN menu

    // Open with Enter
    await page.keyboard.press('Enter');

    // Check menu is open
    const perfectOrder = page.getByRole('menuitem', { name: /Perfect Order/i });
    await expect(perfectOrder).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(perfectOrder).not.toBeVisible();
  });
});
