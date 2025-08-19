//khai báo thư viện
const { test, expect } = require('@playwright/test');
const markDoneFileIn = require('./apiMarkDoneFileIn');
require('dotenv').config();

const selectStatus = async (status = "", page) => {
  // Bước: Click vào combobox "Select Tracking Status"
    await page.locator("//div[contains(@class, 'ant-select-selector') and .//span[text()='Select Tracking Status']]").click();
    await page.waitForTimeout(1000);
    await page.locator(`//div[contains(@class,'ant-select-item-option') and @title='${status}']`).click();
}

function assertRequiredEnv() {
  const required = ['TKT_EMAIL', 'TKT_PASS'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing ${key} in environment. Add it to .env or set the variable before running tests.`);
    }
  }
}

test.describe('Auth', () => {
  test('Login TKT Staging', async ({ page }) => {
    test.setTimeout(120000);
    assertRequiredEnv();
    //Login vào TKT

    await page.goto('/login');

    const usernameInput = page.locator("//input[@type='email']");
    const passwordInput = page.locator("//input[@type='password']");
    const loginButton = page.locator("//button[.//span[text()='Submit']]");

    await expect(usernameInput).toBeVisible();

    await usernameInput.fill(process.env.TKT_EMAIL);//nhập Email
    await passwordInput.fill(process.env.TKT_PASS);//nhập password
    await loginButton.click();//click vào button login
    await page.waitForTimeout(2000)


    // Bước: Click vào Export Tracking
    await page.locator("//span[contains(@class,'Polaris-Navigation__Text') and normalize-space(text())='Export Tracking']").click();

    // // Bước: Click vào button Upload
    // await page.locator("//button[.//span[normalize-space(text())='Upload']]").click();

    // // Bước: Click vào button Select CSV file
    // const [fileChooser] = await Promise.all([
    //   page.waitForEvent('filechooser'),
    //   page.locator("//button[.//span[normalize-space(text())='Select CSV file']]").click()
    // ]);

    // // Bước: Chọn file CSV từ máy tính để upload
    // await fileChooser.setFiles(`c:/Users/USER/Downloads/${process.env.File_name}`); // Đổi đường dẫn file cho phù hợp
    // await page.waitForTimeout(2000); // Chờ một chút để file được chọn
    // // Bước: Click vào button Upload sau khi đã chọn file
    // await page.getByRole('button', { name: 'Upload', exact: true }).click();
   await page.waitForTimeout(2000)
    // Bước: Click vào ô input "Find by File name" để nhập search
    const searchInput = page.locator("//input[@placeholder='Find by File name']");
    await searchInput.click();
    // Ví dụ: nhập từ khóa tìm kiếm
    await searchInput.fill(process.env.Filter_file_name);
    await page.waitForTimeout(2000);

    await selectStatus("Created", page);

    // // Bước: Click vào button Cancel (iconOnly)
    // await page.locator("//button[contains(@class,'Polaris-Button--iconOnly') and .//span[@role='img' and @aria-label='close']]").first().click();

    // // Bước: Click vào button Ok (ant-btn-primary)
    // await page.locator("//button[contains(@class,'ant-btn-primary') and .//span[normalize-space(text())='Ok']]").click();

    await page.waitForTimeout(1000);
    await searchInput.click();
    // Ví dụ: nhập từ khóa tìm kiếm
    await searchInput.fill("");
    // Bước: Click vào icon clear (close-circle) trong combobox
    const buttonClearFilterStatus = page.locator("//span[contains(@class,'ant-select-clear')]//span[@role='img' and @aria-label='close-circle']");
    await buttonClearFilterStatus.click();
    await page.waitForTimeout(1000);

    //Filter by "Completed"
    await selectStatus("Completed", page);

    await page.waitForTimeout(1000);
    await buttonClearFilterStatus.click();

    //Filter by "Cancelled"
    // await selectStatus("Cancelled", page);
    // await page.locator("//button[contains(@class,'Polaris-Button--iconOnly') and .//span[@role='img' and @aria-label='reload']]").first().click();
    // await page.waitForTimeout(3000);
    //  // Bước: Click vào button Ok (ant-btn-primary)
    // await page.locator("//button[contains(@class,'ant-btn-primary') and .//span[normalize-space(text())='Ok']]").click();

    // await page.waitForTimeout(2000);
    await selectStatus("Cancelled", page);
    // Xóa 1 file name
    await page.waitForTimeout(3000);
    await page.locator("//button[contains(@class,'Polaris-Button--iconOnly') and .//span[@role='img' and @aria-label='delete']]").first().click();
    await page.waitForTimeout(3000);
     // Bước: Click vào button Ok (ant-btn-primary)
    await page.locator("//button[contains(@class,'ant-btn-primary') and .//span[normalize-space(text())='Ok']]").click();

    await page.pause()
  });
});
