import { Page, Locator, expect } from '@playwright/test';

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class TaskBoardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to or selects a project tab/nav item by name (e.g., "Web Application", "Mobile Application").
   */
  async selectProject(projectName: string) {
    const projectTab = this.page
      .locator('button, a, div, h1, h2, h3, [role="tab"], [role="button"]')
      .filter({ hasText: new RegExp(`^\\s*${escapeRegExp(projectName)}\\s*$`, 'i') })
      .first();

    await projectTab.click();
  }

  /**
   * Locates a column container by searching for its header text.
   */
  getColumnLocator(columnName: string): Locator {
    return this.page
      .locator('div, section, main, [role="region"]')
      .filter({
        has: this.page
          .getByRole('heading', { name: new RegExp(columnName, 'i') })
          .or(this.page.locator('h1, h2, h3, h4, h5, h6, span, div').getByText(new RegExp(`^\\s*${escapeRegExp(columnName)}\\s*$`, 'i'))),
      })
      .first();
  }

  /**
   * Locates a task card inside a specific column by matching its text content.
   */
  getTaskCardLocator(columnName: string, taskName: string): Locator {
    const column = this.getColumnLocator(columnName);

    return column
      .locator('div, article, li, [role="listitem"]')
      .filter({ hasText: new RegExp(escapeRegExp(taskName), 'i') })
      .last();
  }

  /**
   * Verifies that a task exists within a specified column and displays all expected tags.
   */
  async verifyTaskInColumn(columnName: string, taskName: string, expectedTags: string[]) {
    const taskCard = this.getTaskCardLocator(columnName, taskName);

    // Assert the task card itself is visible
    await expect(taskCard).toBeVisible({ timeout: 10000 });

    // Verify each expected tag is visible within the task card
    for (const tag of expectedTags) {
      const tagLocator = taskCard
        .locator('span, div, p, badge, [class*="tag"], [class*="badge"]')
        .getByText(new RegExp(escapeRegExp(tag), 'i'))
        .first();

      await expect(tagLocator).toBeVisible({ timeout: 5000 });
    }
  }

  /**
   * Clicks on a task card.
   */
  async clickTask(columnName: string, taskName: string) {
    const taskCard = this.getTaskCardLocator(columnName, taskName);
    await taskCard.click();
  }
}