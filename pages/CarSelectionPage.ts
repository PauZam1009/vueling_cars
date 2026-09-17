import { Page, Locator, expect } from '@playwright/test';

export class CarSelectionPage {
  readonly page: Page;
  readonly suvCards: Locator;
  readonly detailsContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.suvCards = page.locator('[data-car-group="suv"]');
    
    this.detailsContinueButton = page.locator('[data-auto-id="btnPaymentFooter"]');
  }

  async waitForSuvResults() {
    
    await expect(async () => {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(this.suvCards.first()).toBeAttached();
    }).toPass({ timeout: 20000 });
  }

  async selectFirstSuv() {
    const suv = this.suvCards.first();
    await suv.scrollIntoViewIfNeeded();
   
    await suv.click();
  }

  async confirmCarSelection() {
    
    await this.detailsContinueButton.click();
  }
}
