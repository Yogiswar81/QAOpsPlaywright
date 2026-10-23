const { test, expect } = require('@playwright/test');

const loginUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
const validUsername = process.env.ORANGEHRM_USERNAME || 'Admin';
const validPassword = process.env.ORANGEHRM_PASSWORD || 'admin123';

test.describe('OrangeHRM login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginUrl);
  });

  test('TC_LOGIN_001 - Login with valid credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(validUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('TC_LOGIN_002 - Login with invalid username', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('invalid-user');
    await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('TC_LOGIN_003 - Login with invalid password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(validUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill('invalid-password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('TC_LOGIN_004 - Login with both invalid credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('invalid-user');
    await page.getByRole('textbox', { name: 'Password' }).fill('invalid-password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('TC_LOGIN_005 - Login with both fields blank', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('.oxd-input-field-error-message')).toHaveCount(2);
    await expect(page.getByText('Required', { exact: true })).toHaveCount(2);
  });

  test('TC_LOGIN_006 - Login with blank username', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('.oxd-input-field-error-message')).toHaveCount(1);
    await expect(page.getByText('Required', { exact: true })).toBeVisible();
  });

  test('TC_LOGIN_007 - Login with blank password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(validUsername);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('.oxd-input-field-error-message')).toHaveCount(1);
    await expect(page.getByText('Required', { exact: true })).toBeVisible();
  });

  test('TC_LOGIN_008 - Verify password masking', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.fill('AnyPassword123');

    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC_LOGIN_009 - Verify Forgot Password navigation', async ({ page }) => {
    await page.getByText('Forgot your password?', { exact: true }).click();

    await expect(page).toHaveURL(/requestPasswordResetCode/);
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  });

  test('TC_LOGIN_010 - Verify logout functionality', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(validUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(validPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/dashboard\/index/);

    await page.locator('.oxd-userdropdown-tab').click();
    await page.getByText('Logout', { exact: true }).click();

    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});