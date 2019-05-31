let currentArticle = '';

describe('Checkout: Run checkout in various ways', function () {
    beforeEach(function () {
        // return cy.createBatchDefaultFixture('random_products', 'articles').then(() => {
            return cy.createDefaultFixture('product', 'articles').then(result => {
                return cy.getProductById({
                    endpoint: 'articles',
                    id: result.body.data.id,
                    options: {
                        considerTaxInput: true
                    }
                }).then(productResult => {
                    console.log(productResult);
                    currentArticle = {
                        id: productResult.body.data.id,
                        name: productResult.body.data.name,
                        gross: productResult.body.data.mainDetail.prices[0].price,
                        grossRound: productResult.body.data.mainDetail.prices[0].price.toFixed(2),
                        net: productResult.body.data.mainDetail.prices[0].net
                    };

                    return Promise.all([
                        cy.createDefaultFixture('customers', 'customers'),
                        cy.rebuildIndex()
                    ]);
                });
            });
        // });
    });

    it('run checkout with logging in in the prcess', function () {
        cy.visit('/');

        // Detail
        cy.get('input[name=sSearch]').type(currentArticle.name.substr(0, currentArticle.name.length - 1));
        cy.get('.main-search--results .entry--name').contains(currentArticle.name);
        cy.get('.main-search--results .list--entry:nth-of-type(1)').click();
        cy.get('.product--title').contains(currentArticle.name);
        cy.get('.buybox--button').click();

        // Off canvas
        cy.get('.ajax--cart').should('be.visible');
        cy.get('.item--name').contains(currentArticle.name);
        cy.get('.item--price').contains(currentArticle.grossRound);
        cy.get('.button--open-basket').click();

        // Checkout
        cy.get('.column--product .content--title').contains(currentArticle.name);
        cy.get('.column--total-price').contains(currentArticle.grossRound);
        cy.get('.actions--bottom .btn--checkout-proceed').click();

        // Login
        cy.get('.register--content').should('be.visible');
        cy.get('input[name=email]').type('test@example.de');
        cy.get('input[name=password]').type('shopware');
        cy.get('form[name=sLogin]').submit();

        // Checkout / Confirm
        cy.get('.tos--panel > .panel--title').contains('Terms, conditions and cancellation policy');
        cy.get('.content--title').contains(currentArticle.name);
        cy.get('.table--tr > .column--total-price').contains(currentArticle.grossRound);

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
            cy.get('.table--tr > .column--total-price').contains(currentArticle.grossRound);
        }
    });

    afterEach(function () {
        return Promise.all([
            cy.removeFixture('customers', 'customers'),
            cy.removeFixture('product', 'articles'),
            cy.removeBatchFixture('random_products', 'articles')
        ]);
    });
});
