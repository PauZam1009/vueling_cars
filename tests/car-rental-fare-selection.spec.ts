import { test, expect, Page } from "@playwright/test";
import {
    SearchPage,
    CarSelectionPage,
    FarePage,
    DriverInfoPage
} from "../pages";
import testData from '../fixtures/testData.json';

let _searchPage: SearchPage;
let _carSelectionPage: CarSelectionPage;
let _farePage: FarePage;
let _driverInfoPage: DriverInfoPage;

test.describe("Car Rental - Fare Selection", () => {
    test.beforeEach(async ({ page }) => {
        _searchPage = new SearchPage(page);
        _carSelectionPage = new CarSelectionPage(page);

        await test.step('The search page loads correctly', async () => {
            await page.goto('/');
            await _searchPage.acceptCookies();

            await expect(page).toHaveURL(/cars\.vueling\.com/);
            await expect(_searchPage.pickupLocationTrigger).toBeVisible();
        });

        await test.step('Search for a car', async () => {
            const pickupDate = new Date();
            pickupDate.setDate(pickupDate.getDate() + 3);

            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 5);

            await _searchPage.searchCar(
                testData.pickupLocation,
                testData.pickupLocationOption,
                pickupDate,
                returnDate,
                testData.driverAge
            );
        });

        await test.step('Select the first SUV', async () => {
            
            await _carSelectionPage.waitForSuvResults();
            await expect(_carSelectionPage.suvCards.first()).toBeVisible();

            await _carSelectionPage.selectFirstSuv();
            
            await _carSelectionPage.confirmCarSelection();
            _farePage = new FarePage(page);
            _driverInfoPage = new DriverInfoPage(page);
        });
    });

   
    for (const { type, expectedCoverage } of testData.insurance) {
        test(`${type} fare selection`, async ({ page }) => {
            await test.step(`Select ${type} Plan and verify coverage`, async () => {
                await expect(_farePage.fareButtons[type]).toBeVisible();

                await _farePage.selectFare(type);

                await page.waitForURL(/payment/);

                await expect(_driverInfoPage.coverageIndicators[type]).toHaveText(expectedCoverage);
            });
        });
    }
});
