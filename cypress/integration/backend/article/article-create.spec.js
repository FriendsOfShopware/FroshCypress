
import utils from './../../../support/helper/utils';
import ProductPageObject from "./../../../support/pages/module/sw-product.page-object";

describe('Product: Create with image', function () {

    beforeEach(function () {
        return cy.login('demo').then(() => {
            return cy.log('demo')
        })
    });

    it('create a product with an image', function () {
        const page = new ProductPageObject();

        cy.clickMenuItem('Artikel', 'Anlegen');
        cy.get('.x-window-header-text').contains('Artikeldetails : Neuer Artikel');
        cy.get('input[name=supplierId]').should('be.visible');
        cy.get('input[name=supplierId]').type('TestenderHerstellerTestet');
        cy.get('input[name=name]').typeAndCheck('Artikel-Freude');
        page.setPrice('10');

        cy.xpath(utils.XPathBuilder.getButtonXpathByLabel('Artikel speichern')).click();
        cy.wait(2000);
        cy.xpWaitForText('Erfolgreich');
    });

    afterEach(function () {
        return cy.removeFixtureByName('Product name', 'articles').then(() => {
            return cy.removeFixtureByName('TestenderHerstellerTestet', 'manufacturers')
        })
    });
});
