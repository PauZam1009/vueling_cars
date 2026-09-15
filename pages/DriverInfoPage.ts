import { Page, Locator } from '@playwright/test';

export class DriverInfoPage {
  readonly page: Page;
  readonly coverageText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.coverageText = page.locator('[data-auto-id="txtInsuranceDetails"]').first();
  }

  async getCoverageText(): Promise<string> {
    const text = await this.coverageText.innerText();

    return text;
    
  }
}