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
 * Login
 * @memberOf Cypress.Chainable#
 * @name login
 * @function
 * @param {Object} userType - The type of the user logging in
 */
Cypress.Commands.add("login", (userType) => {
    const types = {
        demo: {
            name: 'demo',
            pass: 'demo'
        }
    };
    const user = types[userType];

    cy.visit('/backend');
    cy.get('.x-container h1').contains('Shopware Backend Login');

    cy.get('input[name="username').type(user.name).should('have.value', user.name);
    cy.get('input[name="password').type(user.pass).should('have.value', user.pass);
    cy.get('.x-btn-center').click();

    cy.get('.x-main-logo-container').should('be.visible');
});

/**
 * Click context menu in order to cause a desired action
 * @memberOf Cypress.Chainable#
 * @name clickMenuItem
 * @function
 * @param {String} mainMenuId - Id of the Main Menu item
 * @param {String} subMenuId - Id of the sub menu item
 */
Cypress.Commands.add('clickMenuItem', (mainMenuItem, subMenuItem = null) => {
    const mainMenuItemPath = utils.xp.reset().child('span', [{
        target: '@text',
        condition: mainMenuItem
    }], 1).getXpath();

    cy.get('.shopware-menu').should('be.visible');
    cy.wait(2000); // Chai seems to be broken in connection with xpath
    cy.xpath(mainMenuItemPath).click();

    // We're dealing with a sub menu entry, so we have to find this and click it
    if (subMenuItem) {
        const subMenuItemLinkPath = utils.xp.reset().child('span', [{
            target: '~text',
            condition: subMenuItem
        }]).getXpath();

        cy.xpath(subMenuItemLinkPath).click();
    }
});
