import { expect, test, type Page } from '@playwright/test';

const disableMotion = async (page: Page) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        transition: none !important;
        animation: none !important;
        caret-color: transparent !important;
      }
    `,
  });
};

test.beforeEach(async ({ page }) => {
  await page.goto('/visual-regression.html');
  await disableMotion(page);
});

test('matches key component surfaces in light theme', async ({ page }) => {
  await expect(page.locator('[data-visual="actions"]')).toHaveScreenshot('actions-light.png');
  await expect(page.locator('[data-visual="form-fields"]')).toHaveScreenshot('form-fields-light.png');
  await expect(page.locator('[data-visual="selection-controls"]')).toHaveScreenshot('selection-controls-light.png');
  await expect(page.locator('[data-visual="surfaces"]')).toHaveScreenshot('surfaces-light.png');
  await expect(page.locator('[data-visual="edge-cases"]')).toHaveScreenshot('edge-cases-light.png');
});

test('matches key component surfaces in dark theme', async ({ page }) => {
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-ds-theme', 'dark');
  });

  await expect(page.locator('[data-visual="actions"]')).toHaveScreenshot('actions-dark.png');
  await expect(page.locator('[data-visual="form-fields"]')).toHaveScreenshot('form-fields-dark.png');
  await expect(page.locator('[data-visual="selection-controls"]')).toHaveScreenshot('selection-controls-dark.png');
  await expect(page.locator('[data-visual="surfaces"]')).toHaveScreenshot('surfaces-dark.png');
  await expect(page.locator('[data-visual="edge-cases"]')).toHaveScreenshot('edge-cases-dark.png');
});
