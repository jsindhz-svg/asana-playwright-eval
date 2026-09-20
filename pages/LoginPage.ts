import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly headerBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[type="text"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.getByRole('button', { name: /sign in|submit|login/i });
    this.headerBanner = page.getByRole('banner').getByRole('heading', { name: 'Web Application' });
  }

  async navigate() {
    await this.page.goto('/');
  }

  async login(username: string = 'admin', password: string = 'password123') {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await expect(this.headerBanner).toBeVisible({ timeout: 10000 });
  }
}