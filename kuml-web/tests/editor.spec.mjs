import { expect, test } from '@playwright/test';

test('editor accepts kUML and renders without a CodeMirror extension error', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');

  const editor = page.locator('#editor .cm-content');
  await expect(editor).toBeVisible();

  await editor.click();
  await page.keyboard.insertText(`
    classDiagram(name = "Smoke") {
      classOf(name = "Alpha")
    }
  `);

  await expect(page.locator('#preview svg')).toBeVisible();
  expect(pageErrors.join('\n')).not.toContain('Unrecognized extension value in extension set');
});
