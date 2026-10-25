import path from 'node:path';
import { test, expect } from '@fixtures/index';
import { buildUser } from '@data/factories/user.factory';
import { caption, GifRecorder } from './gif-recorder';

// Records docs/demo/checkout-demo.gif for the README. Run: npm run demo:record
test('record checkout demo', async ({
  page,
  authApi,
  productsApi,
  invoicesApi,
  loginViaApi,
  homePage,
  productPage,
  checkoutPage,
}) => {
  test.setTimeout(180_000);

  // Before recording: new user via API, logged in with the token.
  const user = buildUser();
  await authApi.register(user);
  const token = await loginViaApi(user);
  const term = 'pliers';
  const product = (await productsApi.search(term)).data.find((p) => p.in_stock && !p.is_rental);
  if (!product) throw new Error(`No purchasable "${term}" product to demo`);

  await homePage.goto();
  await expect(homePage.products.names.first()).toBeVisible();

  const recorder = new GifRecorder(page);
  await recorder.start();
  const pause = (ms = 1200) => page.waitForTimeout(ms);

  await caption(page, '① User created & logged in via API — no UI login');
  await pause(1800);

  await caption(page, '② Search the catalogue');
  await homePage.searchInput.pressSequentially(term, { delay: 90 });
  await homePage.searchSubmit.click();
  await expect(homePage.searchCaption).toContainText(term);
  await pause();

  await caption(page, `③ Open "${product.name}"`);
  await homePage.products.openProduct(product.name);
  await expect(productPage.name).toHaveText(product.name);
  await caption(page, '④ Add 2 to the cart');
  await pause(900);
  await productPage.addToCart(2);
  await expect(productPage.header.cartQuantity).toHaveText('2');
  await pause();

  await productPage.header.openCart();
  await caption(page, '⑤ Checkout · cart total checked');
  await expect(checkoutPage.total).toHaveText(`$${(product.price * 2).toFixed(2)}`);
  await pause();
  await checkoutPage.proceedFromCart();

  await caption(page, '⑥ Already signed in');
  await pause(900);
  await checkoutPage.proceedAsSignedIn();

  await caption(page, '⑦ Billing address prefilled from profile');
  await expect(checkoutPage.billing.postalCode).toHaveValue(user.address.postal_code);
  await pause();
  await checkoutPage.proceedFromBillingAddress();

  await caption(page, '⑧ Pay — cash on delivery');
  await pause(900);
  await checkoutPage.pay('cash-on-delivery');
  await expect(checkoutPage.paymentSuccessMessage).toBeVisible();
  await pause(900);
  await checkoutPage.confirmOrder();

  await expect(checkoutPage.invoiceNumber).toHaveText(/^INV-\d+$/);
  const invoiceNumber = (await checkoutPage.invoiceNumber.textContent())!.trim();
  await expect
    .poll(async () => (await invoicesApi.withToken(token).findByNumber(invoiceNumber))?.total)
    .toBeCloseTo(product.price * 2, 2);
  await caption(page, `✓ ${invoiceNumber} confirmed in the backend via API`);
  await pause(600);

  const out = path.join(__dirname, '..', '..', 'docs', 'demo', 'checkout-demo.gif');
  const { frames, bytes } = await recorder.stop(out);
  console.log(`Demo GIF: ${frames} frames, ${(bytes / 1024 / 1024).toFixed(2)} MB → ${out}`);
});
