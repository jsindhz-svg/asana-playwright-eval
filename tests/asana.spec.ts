import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TaskBoardPage } from '../pages/TaskBoardPage';
import testCases from './data/testCases.json';

test.describe('Asana Task Verification - Data Driven Suite', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
  });

  for (const scenario of testCases) {
    test(`Test Case ${scenario.id}: Verify "${scenario.task}" under ${scenario.project}`, async ({ page }) => {
      const boardPage = new TaskBoardPage(page);

      // 1. Switch to project view
      await boardPage.selectProject(scenario.project);

      // 2. Verify task existence and associated tags within its column
      await boardPage.verifyTaskAndTags(scenario.column, scenario.task, scenario.tags);
    });
  }
});