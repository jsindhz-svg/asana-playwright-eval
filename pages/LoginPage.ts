import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page
      .getByLabel(/username|email/i)
      .or(page.locator('input[name="username"], input[type="email"], input[type="text"]').first());

    this.passwordInput = page
      .getByLabel(/password/i)
      .or(page.locator('input[name="password"], input[type="password"]').first());

    this.submitButton = page
      .getByRole('button', { name: /sign in|log in|submit/i })
      .or(page.locator('button[type="submit"]').first());
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username?: string, password?: string) {
    const user = username || process.env.ASANA_USERNAME || 'admin';
    const pass = password || process.env.ASANA_PASSWORD || 'password123';

    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();

    // Content-agnostic login verification
    await expect(this.page).not.toHaveURL(/\/login$/i);
    const mainContainer = this.page.getByRole('main').or(this.page.locator('#app, #root, .main-content')).first();    await expect(mainContainer).toBeVisible({ timeout: 10000 });
  }
}