import utils from '../../../support/helper/utils';
import ProductPageObject from "../../../support/pages/module/sw-product.page-object";

describe('Product: Create with image', function () {

    beforeEach(function () {
        return cy.login('demo').then(() => {
            return cy.log('demo')
        })
    });

    it('create a product with an image', function () {
        const page = new ProductPageObject();

        cy.clickMenuItem('Items', 'Create');
        cy.get('.x-window-header-text').contains('Item details: new item');
        cy.wait(2000);
        cy.get('input[name=supplierId]').should('be.visible');
        cy.get('input[name=supplierId]').type('Pokemon');
        cy.get('input[name=name]').typeAndCheck('Charmeleon');
        page.setPrice('10');

        cy.xpath(utils.XPathBuilder.getButtonXpathByLabel('Save item')).click();
        cy.wait(2000);
        cy.xpWaitForText('Successful');
    });

    afterEach(function () {
        cy.task('registerToCleanup', {endpoint: 'articles', field: 'name', value: 'Charmeleon'});
        cy.task('registerToCleanup', {endpoint: 'manufacturers', field: 'supplier.name', value: 'Pokemon'});
        cy.task('rollbackFixtures');
    });
});
