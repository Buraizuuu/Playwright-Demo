import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/dashboard/index');
  }

  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/asda/);
    await expect(this.heading).toBeVisible();
  }
}
