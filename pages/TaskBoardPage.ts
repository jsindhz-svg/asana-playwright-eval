import { Page, Locator, expect } from '@playwright/test';

export class TaskBoardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectProject(projectName: string) {
    const projectButton = this.page.getByRole('button', { name: new RegExp(projectName, 'i') });
    await projectButton.click();
  }

  getTaskCard(columnName: string, taskTitle: string): Locator {
    const column = this.page.locator('div')
      .filter({ has: this.page.getByRole('heading', { name: new RegExp(columnName, 'i') }) });

    return column.locator('div, article')
      .filter({ hasText: taskTitle })
      .last();
  }

  async verifyTaskAndTags(columnName: string, taskTitle: string, tags: string[]) {
  // 1. Explicitly assert the column container is visible
  const column = this.page.locator('div')
    .filter({ has: this.page.getByRole('heading', { name: new RegExp(columnName, 'i') }) });
  await expect(column.first()).toBeVisible({ timeout: 10000 });

  // 2. Identify and assert task card inside the column
  const taskCard = column.locator('div, article')
    .filter({ hasText: taskTitle })
    .last();
  await expect(taskCard).toBeVisible({ timeout: 10000 });

  // 3. Assert tags associated with this task card
  for (const tag of tags) {
    const tagElement = taskCard.locator('span, div').filter({ hasText: new RegExp(`^${tag}$`, 'i') });
    await expect(tagElement.first()).toBeVisible();
  }
}
}