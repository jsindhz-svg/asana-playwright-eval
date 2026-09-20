import { expect, Locator, Page } from '@playwright/test';

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class TaskBoardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectProject(projectName: string) {
    const safeName = escapeRegExp(projectName);
    const projectButton = this.page
      .locator('button, a, div[role="button"], h1, h2, h3, h4, span')
      .filter({ hasText: new RegExp(safeName, 'i') })
      .first();

    await expect(projectButton).toBeVisible({ timeout: 10000 });
    await projectButton.click();
  }

  /**
   * Tightly scopes the specific column container by matching the exact column header.
   */
  getColumnLocator(columnName: string): Locator {
    const safeName = escapeRegExp(columnName);
    const headerRegex = new RegExp(`^\\s*${safeName}(\\s*\\(\\d+\\))?\\s*$`, 'i');

    const columnHeading = this.page
      .locator('h1, h2, h3, h4, h5, h6, .column-header, [class*="header"]')
      .filter({ hasText: headerRegex });

    // Targets the immediate column block without matching outer wrappers like "board-columns"
    return this.page
      .locator('section, article, [class*="board-col"], [class*="column"]:not([class*="wrapper"]):not([class*="container"])')
      .filter({ has: columnHeading })
      .first();
  }

  async verifyTaskInColumn(columnName: string, taskTitle: string, expectedTags: string[] = []) {
    let column = this.getColumnLocator(columnName);

    // Strict scoped fallback matching column header + task card together
    if (!(await column.isVisible({ timeout: 3000 }).catch(() => false))) {
      const safeCol = escapeRegExp(columnName);
      const safeTask = escapeRegExp(taskTitle);
      column = this.page
        .locator('div, section')
        .filter({ has: this.page.locator('h1, h2, h3, h4, h5, h6, span').filter({ hasText: new RegExp(safeCol, 'i') }) })
        .filter({ has: this.page.locator('div, span, p, h3, h4').filter({ hasText: new RegExp(safeTask, 'i') }) })
        .first();
    }

    await expect(column).toBeVisible({ timeout: 10000 });

    const safeTask = escapeRegExp(taskTitle);
    const taskCard = column
      .locator('.task-card, .card, [class*="card"], [class*="task"], div')
      .filter({ hasText: new RegExp(safeTask, 'i') })
      .first();

    await expect(taskCard).toBeVisible({ timeout: 10000 });

    for (const tag of expectedTags) {
      const safeTag = escapeRegExp(tag);
      const tagElement = taskCard
        .locator('.tag, .badge, [class*="tag"], [class*="badge"], span')
        .filter({ hasText: new RegExp(`^\\s*${safeTag}\\s*$`, 'i') })
        .first();

      await expect(tagElement).toBeVisible({ timeout: 5000 });
    }
  }
}