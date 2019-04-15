const GeneralPageObject = require('../sw-general.page-object');
const utils = require('./../../helper/utils');

export default class ProductPageObject extends GeneralPageObject {
    constructor() {
        super();

        this.elements = {
            ...this.elements,
            ...{
                articleWindow: utils.XPathBuilder.getWindowXpathByTitle('Item details: new item'),
                priceInput: 'input[name=price]'
            }
        };
    }

    /**
     * Sets the basic price of a product, graduated prices yet excluded
     *
     * @param {String} value
     */
    setPrice(value) {
        const el = this.elements;

        const productPriceRow = utils.xp
            .reset(el.articleWindow)
            .child('div', [{
                target: '@text',
                condition: 'Arbitrary'
            }])
            .getXpath();

        const productPriceField = utils.xp
            .reset(productPriceRow)
            .ancestor('tr[1]')
            .child('td[3]')
            .child('div[1]')
            .getXpath();

        cy.xpath(productPriceField).click();
        cy.get(el.priceInput).should('be.visible');
        cy.get(el.priceInput).type(value);
        cy.get(el.priceInput).type('{enter}');
        cy.xpath(productPriceField).contains(`${value}.00`)
    }

    /**
     * Upload and chooses the image for the product
     *
     * @param {String} path
     */
    setImage(path) {
        const mediaUploadButtonFieldPath = utils.xp
            .reset()
            .child('span', [{
                target: 'text',
                condition: 'Eigene Medien hinzufügen'
            }])
            .ancestor('div[1]')
            .descendant('input[1]')
            .getXpath();
        const addImage = utils.xp.reset().child('span', [{
            target: 'text',
            condition: 'Bild hinzufügen'
        }]).getXpath();
        const imageName = utils.xp.reset().child('img', [{
            target: '~title',
            condition: 'test_image'
        }]).getXpath();
        const addSelectedImage = utils.xp.reset().child('span', [{
            target: 'text',
            condition: 'Auswahl übernehmen'
        }]).getXpath();

        cy.xpOpenTab('Bilder');
        cy.xpWaitForPanelHeaderVisible('Zugewiesene Bilder');
        cy.xpath(addImage).click();
        cy.get('.x-mask-loading').should('be.visible');
        cy.get('.x-mask-loading').should('not.exist');
        cy.xpWaitForWindowTitleVisible('Medienauswahl');
        cy.get('.x-form-file-input').should('be.visible');
        cy.type(mediaUploadButtonFieldPath, utils.resolvePath(path));
        cy.xpath(imageName).click();
        cy.wait(2000);
        cy.get('.inner-thumb').should('be.visible');
        cy.get('.x-item-selected').should('be.visible');
        cy.xpath(addSelectedImage).click();
        cy.get('.preview').should('be.visible');
    }
}
