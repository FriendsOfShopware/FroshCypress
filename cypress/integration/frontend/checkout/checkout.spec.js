let currentArticle = '';

describe('Checkout: Run checkout in various ways', function () {

    beforeEach(function () {
        return cy.getRandomProductInformationForCheckout().then((result) => {
            currentArticle = result;
            return cy.createDefaultFixture('customers')
        })
    });

    it('run checkout with logging in in the prcess', function () {
        cy.visit('/en');

        // Detail
        cy.get('input[name=sSearch]').type(currentArticle.name);
        cy.get('.main-search--results .entry--name').contains(currentArticle.name);
        cy.get('.main-search--results .list--entry:nth-of-type(1)').click();
        cy.get('.product--title').contains(currentArticle.name);
        cy.get('.buybox--button').click();

        // Off canvas
        cy.get('.ajax--cart').should('be.visible');
        cy.get('.item--name').contains(currentArticle.name);
        cy.get('.item--price').contains(currentArticle.grossRound);
        cy.get('.prices--articles-amount').contains(currentArticle.grossRound);
        cy.get('.button--open-basket').click();

        // Checkout
        cy.get('.column--product .content--title').contains(currentArticle.name);
        cy.get('.column--total-price').contains(currentArticle.grossRound);
        cy.get('.entry--sum').contains(currentArticle.grossRound);
        cy.get('.actions--bottom .btn--checkout-proceed').click();

        // Login
        cy.get('.register--content').should('be.visible');
        cy.get('input[name=email]').type('test@example.de');
        cy.get('input[name=password]').type('shopware');
        cy.get('form[name=sLogin]').submit();

    });

    afterEach(function () {
       // return cy.removeFixtureByNumber({
         //   endpoint: 'customers'
        //});
    });
});
