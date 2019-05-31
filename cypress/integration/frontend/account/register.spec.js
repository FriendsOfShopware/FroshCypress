describe('Account: Register as new customer', function () {
    
    it('register using account menu', function () {
        cy.visit(Cypress.env('homeUrl'));
        cy.get('.account--link').click();
        cy.get('.account--menu-container').should('be.visible');
        cy.get('.navigation--register > .blocked--link').click();

        // Login
        cy.get('.register--content').should('be.visible');
        cy.get('#register_personal_customer_type').select('Private customer');
        cy.get('#salutation').select('Mr');
        cy.get('#firstname').type('Professor');
        cy.get('#lastname').type('Eich');
        cy.get('#register_personal_email').type('eich@pokemon.com');
        cy.get('#register_personal_password').type('shopware');
        cy.get('#street').type('Main Street');
        cy.get('#zipcode').type('12345');
        cy.get('#city').type('Alabastia');
        cy.get('#country').select('Great Britain');

        cy.get('body').then((body) => {
            if (body.find('#dpacheckbox').length > 0) {
                cy.get('#dpacheckbox').click(); 
            } 
        });

        cy.get('#register--form').submit();

        // Checkout / Confirm
        cy.get('.account--welcome .panel--title').should('be.visible');
    });

    afterEach(function () {
        return cy.removeFixtureByName('eich@pokemon.com', 'customers', {
            searchField: 'email'
        });
    });
});
