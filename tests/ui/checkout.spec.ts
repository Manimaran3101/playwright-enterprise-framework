import { test, expect } from '@fixtures/index';
import { STORAGE_STATE } from '@config/auth';

test.describe('Checkout', { tag: ['@e2e', '@regression'] }, () => {
  test.use({ storageState: STORAGE_STATE });

  test('signed-in user buys a product and the invoice is recorded', async ({
    productsApi,
    authApi,
    invoicesApi,
    savedUser,
    productPage,
    checkoutPage,
  }) => {
    const product = await productsApi.firstPurchasable();
    const quantity = 2;
    const expectedTotal = product.price * quantity;

    await test.step('Add product to cart', async () => {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart(quantity);
      await expect(productPage.header.cartQuantity).toHaveText(String(quantity));
      await productPage.header.openCart();
    });

    await test.step('Cart shows the right line and total', async () => {
      await expect(checkoutPage.productTitles).toHaveText([product.name]);
      await expect(checkoutPage.total).toHaveText(`$${expectedTotal.toFixed(2)}`);
      await checkoutPage.proceedFromCart();
    });

    await test.step('Sign-in is skipped for a signed-in user', async () => {
      await checkoutPage.proceedAsSignedIn();
    });

    await test.step('Billing address is prefilled from the profile', async () => {
      const { address } = savedUser;
      // Only the user's own inputs are checked: for NL addresses the app's postcode
      // lookup replaces street and city with the official ones for that postcode.
      await expect(checkoutPage.billing.country).toHaveValue(address.country);
      await expect(checkoutPage.billing.postalCode).toHaveValue(address.postal_code);
      await expect(checkoutPage.billing.city).not.toBeEmpty();
      await checkoutPage.proceedFromBillingAddress();
    });

    await test.step('Pay cash on delivery and confirm', async () => {
      await checkoutPage.pay('cash-on-delivery');
      await expect(checkoutPage.paymentSuccessMessage).toHaveText('Payment was successful');
      await checkoutPage.confirmOrder();
    });

    const invoiceNumber =
      await test.step('Order confirmation shows an invoice number', async () => {
        await expect(checkoutPage.orderConfirmation).toContainText('Thanks for your order!');
        await expect(checkoutPage.invoiceNumber).toHaveText(/^INV-\d+$/);
        return (await checkoutPage.invoiceNumber.textContent())!.trim();
      });

    await test.step('Backend has the invoice with the right total', async () => {
      const { access_token } = await authApi.login(savedUser.email, savedUser.password);
      invoicesApi.withToken(access_token);

      await expect
        .poll(async () => (await invoicesApi.findByNumber(invoiceNumber))?.total, {
          message: `invoice ${invoiceNumber} should appear in /invoices`,
        })
        .toBeCloseTo(expectedTotal, 2);
    });
  });
});
