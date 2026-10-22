import { test, expect } from '@fixtures/index';

test.describe('Shopping cart', { tag: '@regression' }, () => {
  test('adding a product updates the cart badge and cart totals', async ({
    productsApi,
    productPage,
    cartPage,
  }) => {
    // Arrange through the API: pick a real, purchasable product instead of hard-coding one.
    const product = await productsApi.firstPurchasable();
    const quantity = 2;

    await productPage.gotoProduct(product.id);
    await expect(productPage.name).toHaveText(product.name);

    await productPage.addToCart(quantity);

    await expect(productPage.toast).toContainText('Product added to shopping cart');
    await expect(productPage.header.cartQuantity).toHaveText(String(quantity));

    await productPage.header.openCart();

    await expect(cartPage.productTitles).toHaveText([product.name]);
    await expect(cartPage.productQuantities).toHaveValue(String(quantity));
    await expect(cartPage.total).toHaveText(`$${(product.price * quantity).toFixed(2)}`);
  });
});
