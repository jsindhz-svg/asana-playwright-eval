import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TaskBoardPage } from '../pages/TaskBoardPage';

test.describe('smoke', () => {
  test('can load the app and land on the project board', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const taskBoardPage = new TaskBoardPage(page);

    await loginPage.goto();
    await loginPage.login();
    await taskBoardPage.selectProject('Web Application');
  });
});
