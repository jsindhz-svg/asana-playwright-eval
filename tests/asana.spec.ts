import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TaskBoardPage } from '../pages/TaskBoardPage';
import testCases from './data/testCases.json';

test.describe('Asana Task Board Verification', () => {
  let loginPage: LoginPage;
  let taskBoardPage: TaskBoardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    taskBoardPage = new TaskBoardPage(page);

    await loginPage.goto();
    await loginPage.login();
  });

  for (const testCase of testCases) {
    test(`[Case ${testCase.id}] Verify "${testCase.task}" in "${testCase.column}" under "${testCase.project}"`, async () => {
      await taskBoardPage.selectProject(testCase.project);
      await taskBoardPage.verifyTaskInColumn(
        testCase.column,
        testCase.task,
        testCase.tags
      );
    });
  }
});