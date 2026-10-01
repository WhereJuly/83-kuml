import { expect, test } from '@playwright/test';

test('editor accepts kUML and renders without a CodeMirror extension error', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  let renderRequests = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === '/api/render') {
      renderRequests += 1;
    }
  });

  await page.goto('/');

  const editorThemeSelect = page.locator('#editor-theme-select');
  const editorView = page.locator('#editor .cm-editor');
  await expect(editorThemeSelect).toHaveValue('light');
  await expect(editorView).toHaveCSS('background-color', 'rgb(255, 255, 255)');

  const editor = page.locator('#editor .cm-content');
  try {
    await expect(editor).toBeVisible();
  } catch (error) {
    const browserErrors = pageErrors.length === 0 ? '(none captured)' : pageErrors.join('\n');
    throw new Error(
      `CodeMirror editor did not initialize.\nBrowser page errors:\n${browserErrors}\n\nOriginal assertion:\n${error.message}`,
    );
  }

  await editor.click();
  await page.keyboard.insertText(`
    classDiagram(name = "Smoke") {
      classOf(name = "Alpha")
    }
  `);

  await expect(page.locator('#preview svg')).toBeVisible();

  const renderRequestsBeforeThemeSwitch = renderRequests;

  await editorThemeSelect.selectOption('dark');
  await expect(editorThemeSelect).toHaveValue('dark');
  await expect(editorView).toHaveCSS('background-color', 'rgb(13, 17, 23)');
  await expect(editor).toContainText('classDiagram');
  await expect(page.locator('#preview svg')).toBeVisible();

  await editorThemeSelect.selectOption('light');
  await expect(editorThemeSelect).toHaveValue('light');
  await expect(editorView).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(editor).toContainText('classDiagram');
  await expect(page.locator('#preview svg')).toBeVisible();

  expect(renderRequests).toBe(renderRequestsBeforeThemeSwitch);
  expect(pageErrors).toEqual([]);
});
