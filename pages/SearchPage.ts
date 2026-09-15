import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly pickupLocationInput: Locator;
  readonly locationDropdownOptions: Locator;
  readonly pickupDateInput: Locator;
  readonly returnDateInput: Locator;
  readonly searchButton: Locator;
  readonly driverAgeDropdownTrigger: Locator;
  readonly driverAgeOtherRadio: Locator;
  readonly driverAgeOtherInput: Locator;
  readonly acceptCookiesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pickupLocationInput = page.locator('#pickupLocation');
    this.locationDropdownOptions = page.locator('li[role="listitem option"]');
    this.pickupDateInput = page.locator('#pickupDate');
    this.returnDateInput = page.locator('#returnDate');
    this.searchButton = page.locator('[data-auto-id="searchCarsSearchButton"]');
    this.driverAgeDropdownTrigger = page.locator('[data-auto-id="compactAgeTypeSelect"]');
    this.driverAgeOtherRadio = page
      .locator('#ct-compact-age-type-listboxdriverAgeDropdown')
      .getByText('Other');
    this.driverAgeOtherInput = page.locator('#ageTextInput-searchcars');
    this.acceptCookiesButton = page.locator('[data-testid="cookieAccept"]');
  }

  async selectPickupLocation(searchText: string, optionText: string) {
    await this.pickupLocationInput.click();
    await this.pickupLocationInput.fill(searchText);
    await this.locationDropdownOptions
      .filter({ hasText: optionText })
      .click();
  }

  async selectDate(fieldLocator: Locator, targetDate: Date) {
    await fieldLocator.click();
    const formattedDate = targetDate.toISOString().split('T')[0];
    await this.page
      .locator(`td[data-date-formatted="${formattedDate}"]`)
      .click();
  }

  async setDriverAge(age: number){
    await this.driverAgeDropdownTrigger.click();
    await this.driverAgeOtherRadio.click();
    await this.driverAgeOtherInput.fill(age.toString());
  }

  async acceptCookies(){
    await this.acceptCookiesButton.click();
  }


  async searchCar(
    searchText: string,
    optionText: string,
    pickupDate: Date,
    returnDate: Date,
    age: number
    

  ) {

    await this.selectPickupLocation(searchText, optionText);

    await this.selectDate(this.pickupDateInput, pickupDate);

    await this.selectDate(this.returnDateInput, returnDate);

    await this.setDriverAge(age);

    await this.searchButton.click();
  }
}
