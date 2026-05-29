import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly quickLaunchWidget: Locator;
  readonly myActionsWidget: Locator;
  readonly employeeDistributionWidget: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.quickLaunchWidget = page.getByText('Quick Launch');
    this.myActionsWidget = page.getByText('My Actions');
    this.employeeDistributionWidget = page.getByText('Employee Distribution by Sub Unit');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/dashboard/index');
  }

  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.heading).toBeVisible();
  }

  async verifyWidgetsVisible(): Promise<void> {
    await expect(this.quickLaunchWidget).toBeVisible();
    await expect(this.myActionsWidget).toBeVisible();
    await expect(this.employeeDistributionWidget).toBeVisible();
  }
}
