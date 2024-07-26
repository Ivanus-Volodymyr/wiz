describe('template spec', () => {
  it('passes', () => {
    cy.visit(`${Cypress.env('FRONT_URL')}/login`);

    cy.get('h1').should('be.visible').and('have.text', 'Welcome, sign into your account');
  });
});
