//const utils = require('../../../support/helpers/utils');

describe('Product: Create with image', function () {

    beforeEach(function () {
        return cy.login('demo').then(() => {
           return cy.log('demo')
        })
    });

    it('create a product with an image', function () {
        cy.clickMenuItem('Artikel', 'Anlegen')
    });

    afterEach(function () {
        //return cy.removeFixtureByName('Product name', 'articles')
    });
});
