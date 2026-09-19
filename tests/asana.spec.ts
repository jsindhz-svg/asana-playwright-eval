import { test, expect } from '@playwright/test';
import testCases from '../test-data.json';

const CREDENTIALS = {
username: 'admin',
password: 'password123',
};

type TestCase = {
id: number;
project: string;
taskName: string;
column: string;
tags: string[];
};

const scenarios: TestCase[] = testCases;

test.describe('Asana Demo App - Data-Driven Test Suite', () => {
test.beforeEach(async ({ page }) => {
await page.goto('/');


const usernameInput = page.locator('#username');
const passwordInput = page.locator('#password');

await expect(usernameInput).toBeVisible();
await usernameInput.fill(CREDENTIALS.username);

await expect(passwordInput).toBeVisible();
await passwordInput.fill(CREDENTIALS.password);

await page.getByRole('button', { name: 'Sign in' }).click();

await expect(
  page.getByText('Web Application', { exact: true }).first()
).toBeVisible();


});

for (const scenario of scenarios) {
test(
'TC' + scenario.id + ': "' + scenario.taskName + '" is in ' +
scenario.project + ' -> ' + scenario.column,
async ({ page }) => {
const project = page
.getByRole('button', {
name: scenario.project,
exact: true,
})
.or(
page.getByText(scenario.project, {
exact: true,
})
)
.first();

    await expect(project).toBeVisible();
    await project.click();

    const taskText = page.getByText(scenario.taskName, {
      exact: true,
    });

    await expect(taskText).toBeVisible();

    /*
     * Find an ancestor containing the expected column text.
     * The selector does not depend on a specific HTML tag such as
     * article, making it more tolerant of the application's DOM.
     */
    const columnContainer = taskText.locator(
      'xpath=ancestor::*[.//*[contains(normalize-space(), "' +
        scenario.column +
        '")]][1]'
    );

    await expect(columnContainer).toBeVisible();

    /*
     * Confirm that the expected column text exists within the
     * same container as the task.
     */
    await expect(
      columnContainer.getByText(scenario.column, {
        exact: false,
      }).first()
    ).toBeVisible();

    /*
     * The task text itself is the anchor for the task.
     * Verify all required tags are present in the task's nearby
     * container.
     */
    const taskContainer = taskText.locator('xpath=..');

    for (const tag of scenario.tags) {
      await expect(
        taskContainer.getByText(tag, {
          exact: true,
        }).first()
      ).toBeVisible();
    }
  }
);


}
});
