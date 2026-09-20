import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly mainContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[type="email"], #username');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")');
    this.mainContainer = page.getByRole('main').or(page.locator('#app, #root, .main-content')).first();
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

    await expect(this.page).not.toHaveURL(/\/login$/i);
    await expect(this.mainContainer).toBeVisible({ timeout: 10000 });
  }
}