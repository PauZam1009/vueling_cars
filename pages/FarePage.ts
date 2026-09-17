import { Page, Locator } from '@playwright/test';

export class FarePage {
  readonly page: Page;
  readonly fareButtons: Record<string, Locator>;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fareButtons = {
      Basic: page.locator('#limitedOption'),
      Premium: page.locator('#premiumOption'),
    };
    
    this.continueButton = page.locator('[data-auto-id="axaCardOptionCtnBtn"] [role="button"]');
  }

  async selectFare(fareType: string) {
    const radio = this.fareButtons[fareType];
    if (!radio) {
      throw new Error(`Unknown fare type: ${fareType}`);
    }
    await radio.click();
    await this.continueButton.click();
  }
}
