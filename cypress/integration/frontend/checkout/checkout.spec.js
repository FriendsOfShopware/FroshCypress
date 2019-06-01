let currentArticle = '';

describe('Checkout: Run checkout in various ways', function () {
    beforeEach(function () {
        cy.task('applyFixture', {fixtureName: 'customers', endpoint: 'customers'});
        cy.task('applyFixture', {fixtureName: 'random_products', endpoint: 'articles'});
        cy.task('applyFixture', {fixtureName: 'product', endpoint: 'articles'}, {
            timeout: 5000
        }).then(data => {
            currentArticle = data;
        });
        cy.task('rebuildIndex');
    });

    it('run checkout with logging in in the prcess', function () {
        cy.visit('/');

        // Detail
        cy.get('input[name=sSearch]').type(currentArticle.name);
        cy.get('.main-search--results .entry--name').contains(currentArticle.name);
        cy.get('.main-search--results .list--entry:nth-of-type(1)').click();
        cy.get('.product--title').contains(currentArticle.name);
        cy.get('.buybox--button').click();

        // Off canvas
        cy.get('.ajax--cart').should('be.visible');
        cy.get('.item--name').contains(currentArticle.name);
        cy.get('.item--price').contains(currentArticle.mainDetail.prices[0].price);
        cy.get('.button--open-basket').click();

        // Checkout
        cy.get('.column--product .content--title').contains(currentArticle.name);
        cy.get('.column--total-price').contains(currentArticle.mainDetail.prices[0].price);
        cy.get('.actions--bottom .btn--checkout-proceed').click();

        // Login
        cy.get('.register--content').should('be.visible');
        cy.get('input[name=email]').type('test@example.de');
        cy.get('input[name=password]').type('shopware');
        cy.get('form[name=sLogin]').submit();

        // Checkout / Confirm
        cy.get('.tos--panel > .panel--title').contains('Terms, conditions and cancellation policy');
        cy.get('.content--title').contains(currentArticle.name);
        cy.get('.table--tr > .column--total-price').contains(currentArticle.mainDetail.prices[0].price);

        /*
        * As real orders will be created and must not be removed, we don't enable finishing checkout by default.
        * If you allow orders to be created, just set the variable 'checkoutAllowed' to 'true'
        * in your cypress.env.json file.
        * */
        if (Cypress.env('checkoutAllowed')) {
            cy.get('#sAGB').click();
            cy.get('.main--actions > .btn').click();

            // Finish
            cy.get('.finish--teaser > .panel--title').contains('Thank you');
            cy.get('.content--title').contains(currentArticle.name);
            cy.get('.table--tr > .column--total-price').contains(currentArticle.mainDetail.prices[0].price);
        }
    });

    afterEach(function () {
        cy.task('rollbackFixtures');
    });
});
