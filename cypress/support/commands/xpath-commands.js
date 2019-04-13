// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const utils = require('./../../support/helper/utils');

/**
 * Click context menu in order to cause a desired action
 * @memberOf Cypress.Chainable#
 * @name xpTypeAndCheck
 * @function
 * @param {String} label - Id of the Main Menu item
 * @param {String} value - Id of the sub menu item
 * @param {Boolean} [clearField=false] - Id of the sub menu item
 */
Cypress.Commands.add('xpTypeAndCheck', (label, value, clearField = false) => {
    const xpath = utils.XPathBuilder.getFormElementXpathByLabel(label);
    console.log('xpath :', xpath);

    cy.get('.x-article-base-field-set').should('be.visible');
    clearField ? cy.xpath(xpath).clear() : null;

    cy.xpath(xpath).type(value);
    cy.xpath(xpath).invoke('val').should('eq', value);
});

/**
 * Wait for a notification to appear and check its message
 * @memberOf Cypress.Chainable#
 * @name xpOpenTab
 * @function
 * @param {String} message - The message to look for
 * @param {Object}  [options={}] - Options concerning the notification
 */
Cypress.Commands.add('xpOpenTab', (title) => {
    const xpath = utils.xp.reset()
        .child('span', [{
            target: '@text',
            condition: title
        }, {
            target: '~class',
            condition: 'x-tab-inner'
        }]).getXpath();

    cy.get('.x-tab-bar-body').should('be.visible');
    cy.xpath(xpath).click();
});

/**
 * Wait for a notification to appear and check its message
 * @memberOf Cypress.Chainable#
 * @name xpWaitForPanelHeaderVisible
 * @function
 * @param {String} message - The message to look for
 * @param {Object}  [options={}] - Options concerning the notification
 */
Cypress.Commands.add('xpWaitForPanelHeaderVisible', (title) => {
    const xpath = utils.xp.reset()
        .child('span', [{
            target: '@text',
            condition: title
        }, {
            target: '~class',
            condition: 'x-panel-header-text'
        }]).getXpath();

    cy.get('.x-panel-header-text-container').should('be.visible');
    cy.xpath(xpath).contains(title);
});

/**
 * Wait for a notification to appear and check its message
 * @memberOf Cypress.Chainable#
 * @name xpWaitForWindowTitleVisible
 * @function
 * @param {String} message - The message to look for
 * @param {Object}  [options={}] - Options concerning the notification
 */
Cypress.Commands.add('xpWaitForWindowTitleVisible', (title) => {
    const xpath = utils.XPathBuilder.getWindowXpathByTitle(title);
    cy.xpath(xpath);
});

/**
 * Wait for a notification to appear and check its message
 * @memberOf Cypress.Chainable#
 * @name xpWaitForText
 * @function
 * @param {String} message - The message to look for
 * @param {Object}  [options={}] - Options concerning the notification
 */
Cypress.Commands.add('xpWaitForText', (text, exactMatch = false) => {
    // Removing leading and trailing whitespaces
    let xpath = exactMatch ? `//*/text()[normalize-space(.)='${text}']/parent::*` : `//*[contains(text(), '${text}')]`;
    cy.xpath(xpath).contains(text);
});
