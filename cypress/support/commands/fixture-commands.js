const createUuid = require('uuid/v4');

/**
 * Search for an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createDefaultFixture
 * @function
 * @param {String} fixtureName - Fixture name
 * @param {String} endpoint - API endpoint name
 */
Cypress.Commands.add("createDefaultFixture", (fixtureName, endpoint) => {
    return cy.fixture(fixtureName).then((json) => {
        return cy.apiCreate({
            endpoint: endpoint || fixtureName,
            data: json
        })
    });
});

/**
 * Search for an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createBatchDefaultFixture
 * @function
 * @param {String} fixtureName - Fixture name
 * @param {String} endpoint - API endpoint name
 */
Cypress.Commands.add("createBatchDefaultFixture", (fixtureName, endpoint) => {
    return cy.fixture(fixtureName).then((json) => {
        console.log(json);
        return cy.apiRequest(
            'PUT',
            `/api/${endpoint}/`,
            {
                data: json
            }
        )
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
        searchField: options.searchField || 'name',
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
        `/api/${data.endpoint}/${data.id}?considerTaxInput=true`
    )
});

/**
 * Creates an entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name removeFixture
 * @function
 * @param {String} fixtureName - Fixture name
 * @param {String} endpoint - API endpoint name
 */
Cypress.Commands.add("removeFixture", (fixtureName, endpoint) => {
    cy.fixture(fixtureName).then((data)  => {
        return cy.apiRequest(
            'GET',
            `/api/${endpoint}/${data.key}?useNumberAsId=true`
        ).then((result) => {
            return cy.apiDelete(endpoint, result.body.data.id)
        })
    })
});


/**
 * Creates an entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name removeBatchFixture
 * @function
 * @param {String} fixtureName - Fixture name
 * @param {String} endpoint - API endpoint name
 */
Cypress.Commands.add("removeBatchFixture", (fixtureName, endpoint) => {
    let promisify = (request) => {
        return new Promise(((resolve, reject) => {
            request.then(res => {
                resolve(res);
            });
        }))
    };

    cy.fixture(fixtureName).then((data)  => {
        let promises = [];
        data.forEach(item => {
            promises.push(promisify(cy.apiRequest(
                'GET',
                `/api/${endpoint}/${item.key}?useNumberAsId=true`
            )));
        });

        return Promise.all(promises).then(resultSets => {
            console.log(resultSets);
            let promises = [];
            resultSets.forEach(item => {
                console.log(item);
               promises.push(promisify(cy.apiDelete(endpoint, item.body.data.id)));
            });

            return Promise.all(promises);
        });
    })
});
