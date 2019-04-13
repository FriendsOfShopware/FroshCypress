describe('Product: Create with image', function () {

    beforeEach(function () {
        return cy.createDefaultFixture('articles').then(() => {
            return cy.log('demo')
        }).then(() => {
            return cy.login('demo');
        });
    });

    it('creates a product with an image', function () {

    });

    afterEach(function () {
        return cy.removeFixtureByName('Product name', 'articles')
    });
});
