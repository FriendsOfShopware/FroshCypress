describe('Account: Register as new customer', function () {
    
    it('register using account menu', function () {
        cy.visit(Cypress.env('homeUrl'));
        cy.get('.account--link').click();
        cy.get('.account--menu-container').should('be.visible');
        cy.get('.navigation--register > .blocked--link').click();

        // Login
        cy.get('.register--content').should('be.visible');
        cy.get('#register_personal_customer_type').select('Private customer');
        cy.get('#salutation').select('Ms');
        cy.get('#firstname').type('Meri');
        cy.get('#lastname').type('Woodech');
        cy.get('#register_personal_email').type('acan@example.com');
        cy.get('#register_personal_password').type('shopware');
        cy.get('#street').type('Street');
        cy.get('#zipcode').type('12345');
        cy.get('#city').type('City');
        cy.get('#country').select('Deutschland');
        cy.get('#dpacheckbox').click();
        cy.get('#register--form').submit();

        // Checkout / Confirm
        cy.get('.account--welcome .panel--title').contains('Welcome');
    });

    afterEach(function () {
        return cy.getCustomerByEmail('acan@example.com').then((result) => {
            return cy.apiDelete('customers', result)
        });
    });
});
