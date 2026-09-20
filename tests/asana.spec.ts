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

    await test.step('login to the application', async () => {
      await loginPage.goto();
      await loginPage.login("admin", "password123");
    });
  });

  for (const testCase of testCases) {
    test(`[Case ${testCase.id}] Verify "${testCase.task}" in "${testCase.column}" under "${testCase.project}"`, async () => {
      await test.step(`select project ${testCase.project}`, async () => {
        await taskBoardPage.selectProject(testCase.project);
      });

      await test.step(`verify task ${testCase.task} in ${testCase.column}`, async () => {
        await taskBoardPage.verifyTaskInColumn(
          testCase.column,
          testCase.task,
          testCase.tags
        );
      });
    });
  }
});