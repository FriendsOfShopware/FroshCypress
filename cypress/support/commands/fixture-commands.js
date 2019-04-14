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
            value: name
        }
    }).then((result) => {
        return cy.deleteViaAdminApi(endpoint, result)
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
return cy.fixture(endpoint).then((result) => {
        return cy.createViaAdminApi({
            endpoint: endpoint,
            data: result
        })
    })
});


/**
 * Creates an entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name getProductById
 * @function
 * @param {Object} data - Necessary  for the API request
 */
Cypress.Commands.add("getProductById", (data) => {
    return cy.requestAdminApi(
        'GET',
        `/api/${data.endpoint}/${data.id}?considerTaxInput=true`
    )
});

/**
 * Creates an entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name removeFixtureByNumber
 * @function
 * @param {Object} data - Necessary  for the API request
 */
Cypress.Commands.add("removeFixtureByNumber", (data) => {
    cy.fixture(data.endpoint).then((customer)  => {
        return cy.requestAdminApi(
            'GET',
            `/api/${data.endpoint}/${customer.number}?useNumberAsId=true`
        ).then((result) => {
            console.log('result :', result);
            return cy.deleteViaAdminApi(data.endpoint, result.body.data.id)
        })
    })

});
