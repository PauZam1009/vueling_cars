import { Page, Locator } from '@playwright/test';

export class FarePage {
  readonly page: Page;
  readonly basicFareButton: Locator;
  readonly premiumFareButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.basicFareButton = page.locator('[data-auto-id="btnBookWithoutInsurance1"]');
    this.premiumFareButton = page.locator('[data-auto-id="btnBookWithInsurance1"]');
  }

  async selectFare(fareType: 'Basic' | 'Premium') {
    if(fareType === 'Basic'){
        await this.basicFareButton.click();
    } else{
        await this.premiumFareButton.click();
    }
  }
}