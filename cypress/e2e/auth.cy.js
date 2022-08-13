describe('User Login', () => {
  it('User should be able to login with correct credentials', () => {
    const [username, password] = [Cypress.env("username"), Cypress.env("password")];

    cy.loginByApi(username, password);
    cy.visit('/');
  })
})