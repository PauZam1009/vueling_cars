import { Page, Locator } from '@playwright/test';

export class CarSelectionPage {
  readonly page: Page;
  readonly carouselItems: Locator;
  readonly bookButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.carouselItems = page.locator('.ct-cars-carousel-car');
    this.bookButton = page.locator('[data-auto-id="bookButton"]');
  }

  async selectFirstSuv() {
    await this.carouselItems
      .filter({ hasText: 'SUV' })
      .first()
      .click();
  }

  async confirmCarSelection(): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup');
    await this.bookButton.first().click();
    const newPage = await popupPromise;
    return newPage;
  }
}