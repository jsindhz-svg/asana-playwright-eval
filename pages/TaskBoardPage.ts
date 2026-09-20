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
   * Navigates to or selects a project tab by exact string match.
   */
  async selectProject(projectName: string) {
    const escapedName = escapeRegExp(projectName);
    const projectTab = this.page
      .locator('button, a, div, h1, h2, h3, [role="tab"], [role="button"]')
      .filter({
        hasText: new RegExp(`^\\s*${escapedName}\\s*$`, 'i'),
      })
      .first();

    await projectTab.click();
  }

  /**
   * Locates the individual column container holding the header and its task cards.
   */
  getColumnLocator(columnName: string): Locator {
    const escapedName = escapeRegExp(columnName);
    const exactHeadingRegex = new RegExp(`^\\s*${escapedName}\\s*`, 'i');

    // Strategy 1: Look for common Kanban column container structures filtering by header text
    const columnContainer = this.page
      .locator('section, article, [class*="column"], [class*="col"], div')
      .filter({
        has: this.page.locator('h1, h2, h3, h4, h5, h6, span, div, header').filter({ hasText: exactHeadingRegex }),
      })
      .filter({
        // Prevent selecting outer layout containers that wrap all columns
        hasNot: this.page.locator('[class*="board"], [class*="grid"], [class*="columns"], main'),
      });

    return columnContainer.first();
  }

  /**
   * Locates a task card strictly within the target column.
   */
  getTaskCardLocator(columnName: string, taskName: string): Locator {
    const column = this.getColumnLocator(columnName);

    // Find the card element inside the column container
    return column
      .locator('div, article, li, [role="listitem"], [class*="card"], [class*="task"]')
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

    // Verify the task card itself is visible inside the target column
    await expect(taskCard).toBeVisible({ timeout: 10000 });

    // Verify tags inside the task card using strict exact matches
    for (const tag of expectedTags) {
      const exactTagRegex = new RegExp(`^\\s*${escapeRegExp(tag)}\\s*$`, 'i');
      const tagLocator = taskCard
        .locator('span, div, p, badge, [class*="tag"], [class*="badge"]')
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
    await taskCard.click();
  }
}