describe('User Login', () => {
  it('User should be able to login with correct credentials', () => {
    cy.loginByApi();
    cy.visit('/')
  })
})