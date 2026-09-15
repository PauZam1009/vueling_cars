import { test, expect } from "@playwright/test";
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

    test('Basic fare selection', async ({ page }) => {
        // caso 1
        await test.step('The search page loads correctly', async () => {

            await page.goto('/');
            const searchPage = new SearchPage(page);
            await searchPage.acceptCookies();
            await expect(page).toHaveURL(/cars\.vueling\.com/);
            await expect(searchPage.pickupLocationInput).toBeVisible();
        });

        
        

    });

    test('Premium fare selection', async ({ page }) => {
        // caso 2
    });

});


