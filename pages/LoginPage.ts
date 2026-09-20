import { expect, Locator, Page } from '@playwright/test';

function getCredential(name: string, providedValue?: string): string {
  const value = providedValue ?? process.env[name];

  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in the environment or pass it explicitly to login().` +
        ' See .env.example for expected values.'
    );
  }

  return value;
}

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
    const user = getCredential('ASANA_USERNAME', username);
    const pass = getCredential('ASANA_PASSWORD', password);

    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();

    await expect(this.page).not.toHaveURL(/\/login$/i, { timeout: 15000 });
    await expect(this.mainContainer).toBeVisible({ timeout: 10000 });
  }
}