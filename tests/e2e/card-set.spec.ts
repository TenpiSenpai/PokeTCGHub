/**
 * E2E tests for card set pages
 */

import { test, expect } from '@playwright/test';

test.describe('Card Set Page', () => {
  test('should display card list', async ({ page }) => {
    await page.goto('/sets/jp/nihil_zero');

    // Wait for cards to load
    await page.waitForSelector('[role="list"]', { timeout: 10000 });

    // Check that cards are displayed
    const cards = page.locator('.card-list [role="listitem"]');
    const count = await cards.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should display type navigation', async ({ page }) => {
    await page.goto('/sets/jp/nihil_zero');

    // Check for type navigation
    const nav = page.getByRole('navigation', { name: /Card type navigation/i });
    await expect(nav).toBeVisible();

    // Check for specific type links
    const grassLink = page.getByRole('link', { name: /Grass/i });
    await expect(grassLink).toBeVisible();
  });

  test('should navigate to card type section', async ({ page }) => {
    await page.goto('/sets/jp/nihil_zero');

    // Wait for page to load
    await page.waitForSelector('[role="list"]', { timeout: 10000 });

    // Click on a type link
    const fireLink = page.getByRole('link', { name: /Fire/i });
    await fireLink.click();

    // Should scroll to the fire type section
    // Check that URL has the hash
    await expect(page).toHaveURL(/#type-R/);
  });

  test('should display card details', async ({ page }) => {
    await page.goto('/sets/jp/nihil_zero');

    // Wait for cards to load
    await page.waitForSelector('[role="list"]', { timeout: 10000 });

    // Find first card article
    const firstCard = page.locator('article').first();
    await expect(firstCard).toBeVisible();

    // Check that it has required elements
    await expect(firstCard.locator('img')).toBeVisible();
  });

  test('should handle loading state', async ({ page }) => {
    await page.goto('/sets/jp/nihil_zero');

    // Should show loading initially
    const loading = page.getByText(/Loading cards/i);

    // Loading should eventually disappear
    await expect(loading).not.toBeVisible({ timeout: 10000 });
  });

  test('should handle error state', async ({ page }) => {
    // Navigate to non-existent set
    await page.goto('/sets/en/nonexistent_set');

    // Should show error message
    const error = page.getByRole('alert');
    await expect(error).toBeVisible({ timeout: 10000 });
    await expect(error).toContainText(/error/i);
  });

  test('should lazy load images', async ({ page }) => {
    await page.goto('/sets/jp/nihil_zero');

    // Wait for cards to load
    await page.waitForSelector('[role="list"]', { timeout: 10000 });

    // Check that images have loading attribute
    const images = page.locator('img');
    const firstImage = images.first();

    // Image should have data-url attribute (lazy loading)
    await expect(firstImage).toHaveAttribute('data-url');
  });
});
