import { test, expect, Page } from "@playwright/test";
import { SearchPage } from "../pages/SearchPage";
import { CarSelectionPage } from "../pages/CarSelectionPage";
import { FarePage } from "../pages/FarePage";
import { DriverInfoPage } from "../pages/DriverInfoPage";
import testData from '../fixtures/testData.json';

test.describe('Car Rental - Fare Selection', () => {

  test.beforeAll(async () => {
    console.log("Starting the suite");

  });

  test.afterAll(async () => {
    console.log("Finishing the Suite");

  });

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();

  });

  test.afterEach(async ({ page, context }) => {
    const pages = context.pages();
    for (const p of pages.slice(1)) {
      await p.close();
    }

  });

  test('Basic fare selection', async ({ page, context }) => {
    let searchPage: SearchPage;
    let carSelectionPage: CarSelectionPage;
    let newPage: Page;

    await test.step('The search page loads correctly', async () => {
      await page.goto('/');
      searchPage = new SearchPage(page);
      await searchPage.acceptCookies();

      await expect(page).toHaveURL(/cars\.vueling\.com/);
      await expect(searchPage.pickupLocationInput).toBeVisible();

    });

    await test.step('Search for a car', async () => {
      const pickupDate = new Date();
      pickupDate.setDate(pickupDate.getDate() + 3);

      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 5);

      await searchPage.searchCar(
        testData.pickupLocation,
        testData.pickupLocationOption,
        pickupDate,
        returnDate,
        testData.driverAge
      );

    });

    await test.step('Select the first SUV', async () => {
      carSelectionPage = new CarSelectionPage(page);

      await expect(
        carSelectionPage.carouselItems.filter({ hasText: 'SUV' }).first()
      ).toBeVisible();

      await carSelectionPage.selectFirstSuv();

      newPage = await carSelectionPage.confirmCarSelection();

    });

    await test.step('Select Basic Plan and verify coverage', async () => {

      const currentPage = context.pages()[context.pages().length - 1];
      const farePage = new FarePage(currentPage);

      await expect(farePage.basicFareButton).toBeVisible();

      await farePage.selectFare("Basic");

      await currentPage.waitForURL(/details-with-payment/);

      const driverInfoPage = new DriverInfoPage(currentPage);
      const coverageText = await driverInfoPage.getCoverageText();

      await expect(coverageText).toBe("Limited");
      await currentPage.pause();

    });
    
  });
});