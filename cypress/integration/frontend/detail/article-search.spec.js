let currentArticle = '';

describe('Detail: Find article and open it', function () {

    beforeEach(function () {
        return cy.getRandomProductInformationForCheckout().then((result) => {
            currentArticle = result;
        })
    });

    it('create a product with an image', function () {
        cy.visit('/en');

        // Search
        cy.get('input[name=sSearch]').type(currentArticle.name);
        cy.get('.main-search--results .entry--name').contains(currentArticle.name);
        cy.get('.main-search--results .list--entry:nth-of-type(1)').click();

        // Detail
        cy.get('.product--title').contains(currentArticle.name);
        cy.get('.price--content').contains(currentArticle.grossRound);
    });
});
