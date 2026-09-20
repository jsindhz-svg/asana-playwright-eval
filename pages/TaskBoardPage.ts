import { Page, Locator, expect } from '@playwright/test';

/**
 * Escapes special regex characters to prevent syntax errors on dynamic strings.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class TaskBoardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
  * Navigates to or selects a project button by its accessible name prefix.
   */
  async selectProject(projectName: string) {
    const escapedName = escapeRegExp(projectName);
    const projectTab = this.page
      .getByRole('navigation')
      .getByRole('button', {
        name: new RegExp(`^\\s*${escapedName}\\b`, 'i'),
      })
      .first();

    await expect(projectTab).toBeVisible({ timeout: 15000 });
    await projectTab.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => undefined);
  }

  /**
   * Locates the individual column container holding the header and its task cards.
   * Matches titles starting with the column name (e.g., "To Do" or "To Do (2)").
   */
  getColumnLocator(columnName: string): Locator {
    const escapedName = escapeRegExp(columnName);
    const headingRegex = new RegExp(`^\\s*${escapedName}\\b`, 'i');

    return this.page
      .locator('section, article, [data-testid*="column"], [class*="column"], [class*="col"], div')
      .filter({
        has: this.page
          .locator('h1, h2, h3, h4, h5, h6, header, [role="heading"], span, div')
          .filter({ hasText: headingRegex }),
      })
      .filter({
        hasNot: this.page.locator('[data-testid*="board"], [class*="board"], [class*="grid"], [class*="columns"], main'),
      })
      .first();
  }

  /**
   * Locates a task card container within the specified column.
   */
  getTaskCardLocator(columnName: string, taskName: string): Locator {
    const column = this.getColumnLocator(columnName);

    return column
      .locator('article, li, div, [role="listitem"], [data-testid*="card"], [class*="card"], [class*="task"]')
      .filter({
        hasText: new RegExp(escapeRegExp(taskName), 'i'),
      })
      .first();
  }

  /**
   * Verifies that a task exists inside the specified column and contains all expected tags.
   */
  async verifyTaskInColumn(columnName: string, taskName: string, expectedTags: string[]) {
    const taskCard = this.getTaskCardLocator(columnName, taskName);

    await expect(taskCard).toBeVisible({ timeout: 10000 });

    for (const tag of expectedTags) {
      const exactTagRegex = new RegExp(`^\\s*${escapeRegExp(tag)}\\s*$`, 'i');
      const tagLocator = taskCard
        .locator('span, div, p, badge, [class*="tag"], [class*="badge"], [data-testid*="tag"]')
        .filter({ hasText: exactTagRegex })
        .first();

      await expect(tagLocator).toBeVisible({ timeout: 5000 });
    }
  }

  /**
   * Helper to click on a task card inside a specific column.
   */
  async clickTask(columnName: string, taskName: string) {
    const taskCard = this.getTaskCardLocator(columnName, taskName);
    await expect(taskCard).toBeVisible({ timeout: 10000 });
    await taskCard.click();
  }
}