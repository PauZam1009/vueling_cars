import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly acceptCookiesButton: Locator;
  readonly pickupLocationTrigger: Locator;
  readonly pickupLocationModalInput: Locator;
  readonly locationDropdownOptions: Locator;
  readonly datesTrigger: Locator;
  readonly driverAgeGroupContainer: Locator;
  readonly searchButton: Locator;

  
  private static readonly AGE_GROUPS: { maxAge: number; label: string }[] = [
    { maxAge: 29, label: '18 - 29' },
    { maxAge: 69, label: '30 - 69' },
    { maxAge: Infinity, label: '70+' },
  ];

  constructor(page: Page) {
    this.page = page;
    this.acceptCookiesButton = page.locator('[data-testid="cookieAccept"]');
    
    this.pickupLocationTrigger = page.getByRole('button', { name: /pick-up location/i });
    this.pickupLocationModalInput = page.locator('#search-cars-pickup-modal-input');
    
    this.locationDropdownOptions = page.locator('li.ct-location-list-item');
    this.datesTrigger = page.locator('[data-auto-id="inputPickupDate"]');
    this.driverAgeGroupContainer = page.locator('[data-auto-id="ageGroupSelectContainer"]');
    this.searchButton = page.locator('[data-auto-id="btnSearch"]');
  }

  async acceptCookies() {
    
    try {
      await this.acceptCookiesButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.acceptCookiesButton.click();
    } catch {
      
    }
  }

  async selectPickupLocation(searchText: string, optionText: string) {
    await this.pickupLocationTrigger.click();
    await this.pickupLocationModalInput.fill(searchText);
    await this.locationDropdownOptions.filter({ hasText: optionText }).first().click();
  }

  private dayLocator(date: Date): Locator {
    const key = `day-${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
    return this.page.locator(`[data-auto-id="${key}"]`);
  }

  async selectDateRange(pickupDate: Date, returnDate: Date) {
    await this.datesTrigger.click();
    await this.dayLocator(pickupDate).click();
    await this.dayLocator(returnDate).click();
  }

  async setDriverAge(age: number) {
    const group = SearchPage.AGE_GROUPS.find(({ maxAge }) => age <= maxAge)!;
    await this.driverAgeGroupContainer.locator(`[aria-label="${group.label}"]`).click();
  }

  async searchCar(
    searchText: string,
    optionText: string,
    pickupDate: Date,
    returnDate: Date,
    age: number
  ) {
    await this.selectPickupLocation(searchText, optionText);
    await this.selectDateRange(pickupDate, returnDate);
    await this.setDriverAge(age);
    await this.searchButton.click();
  }
}
