import { expect, Locator, Page } from '@playwright/test';

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class TaskBoardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to or selects a project application tab (e.g. "Web Application", "Mobile Application").
   */
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
   * Locates a column container by matching heading text or container attributes.
   */
  getColumnLocator(columnName: string): Locator {
    const safeName = escapeRegExp(columnName);
    const regex = new RegExp(safeName, 'i');

    // 1. Direct semantic heading inside a column container
    const columnHeading = this.page
      .locator('h1, h2, h3, h4, h5, h6, .column-header, [class*="header"]')
      .filter({ hasText: regex });

    // 2. Dedicated column container holding that header
    return this.page
      .locator('[class*="column"], [class*="board-col"], section, .bg-gray-50, .bg-slate-50')
      .filter({ has: columnHeading })
      .first();
  }

  /**
   * Verifies that a task exists under the specified column with given tags.
   */
  async verifyTaskInColumn(columnName: string, taskTitle: string, expectedTags: string[] = []) {
    let column = this.getColumnLocator(columnName);

    // Fallback if generic column wrappers aren't detected
    if (!(await column.isVisible({ timeout: 3000 }).catch(() => false))) {
      column = this.page
        .locator('div')
        .filter({ has: this.page.locator('h1, h2, h3, h4, h5, h6, span').filter({ hasText: new RegExp(escapeRegExp(columnName), 'i') }) })
        .filter({ has: this.page.locator(`text=${taskTitle}`) })
        .first();
    }

    await expect(column).toBeVisible({ timeout: 10000 });

    // Target the specific task card within the column
    const safeTask = escapeRegExp(taskTitle);
    const taskCard = column
      .locator('.task-card, .card, [class*="card"], [class*="task"], div')
      .filter({ hasText: new RegExp(safeTask, 'i') })
      .first();

    await expect(taskCard).toBeVisible({ timeout: 10000 });

    // Verify all specified tags exist inside the task card
    for (const tag of expectedTags) {
      const safeTag = escapeRegExp(tag);
      const tagElement = taskCard
        .locator('.tag, .badge, [class*="tag"], [class*="badge"], span')
        .filter({ hasText: new RegExp(safeTag, 'i') })
        .first();

      await expect(tagElement).toBeVisible({ timeout: 5000 });
    }
  }
}