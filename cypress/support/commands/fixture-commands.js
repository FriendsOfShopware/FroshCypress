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
        return cy.apiCreate({
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
    return cy.apiSearchByName({
        endpoint: endpoint,
        value: name
    }).then((result) => {
        return cy.apiDelete(endpoint, result)
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
        return cy.apiCreate({
            endpoint: endpoint,
            data: result
        })
    })
});

/**
 * Creates an entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name getCustomerByEmail
 * @function
 * @param {Object} data - Necessary  for the API request
 */
Cypress.Commands.add("getCustomerByEmail", (email) => {
    const filters = {
        filter: {
            email: email
        },
        limit: 1
    };

    return cy.apiSearchRequest(
        'GET',
        `/api/customers`,
        filters
    ).then((responseData) => {
        console.log('result :', responseData.body.data);
        return responseData.body.data[0].id;
    });
});

/**
 * Creates an entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name getProductById
 * @function
 * @param {Object} data - Necessary  for the API request
 */
Cypress.Commands.add("getProductById", (data) => {
    return cy.apiRequest(
        'GET',
        `/api/${data.endpoint}/${data.id}?considerTaxInput=true&language=2`
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
        return cy.apiRequest(
            'GET',
            `/api/${data.endpoint}/${customer.number}?useNumberAsId=true`
        ).then((result) => {
            console.log('result :', result);
            return cy.apiDelete(data.endpoint, result.body.data.id)
        })
    })
});
