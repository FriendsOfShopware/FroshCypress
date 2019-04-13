const createUuid = require('uuid/v4');

/**
 * Search for an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createDefaultFixture
 * @function
 * @param {String} endpoint - API endpoint for the request
 * @param {Object} [options={}] - Options concerning deletion
 */
Cypress.Commands.add("createDefaultFixture", (endpoint) => {
    return cy.fixture(endpoint).then((json) => {
        return cy.createViaAdminApi({
            endpoint: endpoint,
            data: json
        })
    });
});

/**
 * Search for an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name removeFixtureByName
 * @function
 * @param {String} name - Name of the fixture to be deleted
 * @param {String} endpoint - API endpoint for the request
 * @param {Object} [options={}] - Options concerning deletion [options={}]
 */
Cypress.Commands.add("removeFixtureByName", (name, endpoint, options = {}) => {
    return cy.searchViaAdminApi({
        endpoint: endpoint,
        data: {
            field: options.identifier ? options.identifier : 'name',
            value: name
        }
    }).then((result) => {
        return cy.deleteViaAdminApi(endpoint, result.id)
    })
});

/**
 * Search for an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createProductFixture
 * @function
 * @param {String} endpoint - API endpoint for the request
 * @param {Object} [options={}] - Options concerning creation
 */
Cypress.Commands.add("createProductFixture", (endpoint, options = {}) => {
    let json = {};
    let manufacturerId = '';
    let categoryId = '';

    return cy.fixture(endpoint).then((result) => {
        json = result;

        return cy.createDefaultFixture('category')
    }).then((result) => {
        categoryId = result;

        return cy.searchViaAdminApi({
            endpoint: 'product-manufacturer',
            data: {
                field: 'name',
                value: options.manufacturerName
            }
        })
    }).then((result) => {
        manufacturerId = result.id;

        return cy.searchViaAdminApi({
            endpoint: 'tax',
            data: {
                field: 'name',
                value: options.taxName
            }
        })
    }).then((result) => {
        return Object.assign({}, {
            taxId: result.id,
            manufacturerId: manufacturerId,
            categoryId: categoryId
        }, json);
    }).then((result) => {
        return cy.createViaAdminApi({
            endpoint: endpoint,
            data: result
        })
    })
});
