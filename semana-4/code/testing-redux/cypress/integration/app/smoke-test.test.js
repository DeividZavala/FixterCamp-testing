describe('Smoke test', () => {
  beforeEach(() => {
    cy.request('PATCH', 'http://localhost:4000/cart', { products: [] });
  });
  context('Empty cart', () => {
    it('Add item to cart', () => {
      cy.intercept('PATCH', '/cart').as('addItem');
      cy.visit('/');
      cy.get('#products-container > div').first().find('button').click();
      cy.wait('@addItem');
      cy.get('#products-container > div').should('have.length', 1);
      cy.get('#cart > div').first().find('.quantity').should('have.text', '1');
    });
  });

  context('Cart with items', () => {
    beforeEach(() => {
      cy.fixture('cart').then(cart => {
        cy.request('PATCH', 'http://localhost:4000/cart', { products: cart.products });
      });
      cy.intercept('GET', '/cart').as('loadCart');
      cy.visit('/');
      cy.wait('@loadCart');
    });
    it.only('Delete Items', () => {
      cy.intercept('PATCH', '/cart').as('updateCart');
      cy.get('#cart > div').first().find('.trash').click();
      cy.wait('@updateCart');
      cy.get('#cart > div').should('have.length', 1);
      cy.get('#cart > div').first().find('.trash').click();
      cy.wait('@updateCart');
      cy.get('#cart').should('be.empty');
    });
  });
});
