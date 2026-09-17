import { Page, Locator } from '@playwright/test';

export class DriverInfoPage {
  readonly page: Page;
  
  readonly coverageIndicators: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.coverageIndicators = {
      
      Basic: page.locator('[data-auto-id="insuranceUpsellPanelHeaderText"]'),
      
      Premium: page.locator('.ct-line-item-type--insurance').first(),
    };
  }


}
