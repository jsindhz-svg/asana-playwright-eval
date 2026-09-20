import { Page, expect } from '@playwright/test';

export class TaskBoardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectProject(projectName: string) {
    // Click project link from sidebar or navigation
    const projectButton = this.page.getByRole('button', { name: new RegExp(projectName, 'i') })
      .or(this.page.getByRole('link', { name: new RegExp(projectName, 'i') }))
      .or(this.page.locator(`text="${projectName}"`));

    await projectButton.first().click();
  }

  async verifyTaskAndTags(columnName: string, taskTitle: string, tags: string[]) {
    // Match column heading allowing optional task count in parentheses e.g. "To Do (3)"
    const columnHeaderRegex = new RegExp(`^${columnName}(\\s*\\(.*\\))?$`, 'i');

    // Locate column container by filtering for the heading
    const column = this.page.locator('div, section')
      .filter({ has: this.page.getByRole('heading', { name: columnHeaderRegex }).or(this.page.locator('h1, h2, h3, h4, h5').filter({ hasText: columnHeaderRegex })) });

    await expect(column.first()).toBeVisible({ timeout: 10000 });

    // Locate the specific task card containing the task title
    const taskCard = column
      .locator('div, article, [class*="card"], [class*="task"]')
      .filter({ hasText: taskTitle })
      .first();

    await expect(taskCard).toBeVisible();

    // Verify each expected tag exists inside the task card
    for (const tag of tags) {
      const tagElement = taskCard.locator('span, div, p, [class*="tag"], [class*="badge"]')
        .filter({ hasText: new RegExp(`^${tag}$`, 'i') });
      await expect(tagElement.first()).toBeVisible();
    }
  }
}