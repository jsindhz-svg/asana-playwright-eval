import { expect, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username?: string, password?: string) {
    const user = username || process.env.ASANA_USERNAME || 'admin';
    const pass = password || process.env.ASANA_PASSWORD || 'password123';

    await this.page.fill('input[name="username"], input[type="email"], #username', user);
    await this.page.fill('input[name="password"], input[type="password"], #password', pass);
    await this.page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")');

    // Decoupled auth state check
    await expect(this.page).not.toHaveURL(/\/login$/i);
    const mainContainer = this.page
      .getByRole('main')
      .or(this.page.locator('#app, #root, .main-content'))
      .first();
    await expect(mainContainer).toBeVisible({ timeout: 10000 });
  }
}