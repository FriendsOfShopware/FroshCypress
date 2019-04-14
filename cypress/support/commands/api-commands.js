/**
 * Handling API requests
 * @memberOf Cypress.Chainable#
 * @name apiRequest
 * @function
 */
Cypress.Commands.add("apiRequest", (method, url, requestData = {}) => {
    const requestConfig = {
        auth: {
            username: 'demo',
            password: 'oNdfbFVdp4QErvVKMZnI5ydpD4xxDoq9rt5pZJKB'
        },
        method: method,
        url: url,
        body: requestData.data
    };

    return cy.request(requestConfig).then((response) => {
        if (response.body.data) {
            const responseBodyObj = response.body.data;

            if (Array.isArray(responseBodyObj.data) && responseBodyObj.data.length <= 1) {
                return responseBodyObj.data[0];
            }
            return responseBodyObj.data;
        }
        return response;
    });
});

/**
 * Handling API requests customised on search tasks
 * @memberOf Cypress.Chainable#
 * @name apiSearchRequest
 * @function
 */
Cypress.Commands.add("apiSearchRequest", (method, url, requestData = {}) => {
    const requestConfig = {
        auth: {
            username: 'demo',
            password: 'oNdfbFVdp4QErvVKMZnI5ydpD4xxDoq9rt5pZJKB'
        },
        method: method,
        url: url,
        body: requestData
    };

    return cy.request(requestConfig).then((response) => {
        if (response.body) {
            const responseBodyObj = response.body.data;

            if (Array.isArray(responseBodyObj.data) && responseBodyObj.data.length <= 1) {
                return responseBodyObj.data[0];
            }
            return responseBodyObj.data;
        }
        return response;
    });
});

/**
 * Creates an entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name apiCreate
 * @function
 * @param {Object} data - Necessary  for the API request
 */
Cypress.Commands.add("apiCreate", (data) => {
    return cy.apiRequest(
        'POST',
        `/api/${data.endpoint}`,
        data
    )
});

/**
 * Search for an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name apiSearchByName
 * @function
 * @param {Object} data - Necessary data for the API request
 */
Cypress.Commands.add("apiSearchByName", (data) => {
    const filters = {
        filter: {
            name: data.value
        },
        limit: 1
    };

    return cy.apiSearchRequest(
        'GET',
        `/api/${data.endpoint}`,
        filters
    ).then((responseData) => {
        return responseData.body.data[0].id;
    });
});

/**
 * Search for an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name apiDelete
 * @function
 * @param {String} endpoint - API endpoint for the request
 * @param {String} id - Id of the entity to be deleted
 */
Cypress.Commands.add("apiDelete", (endpoint, id) => {
    return cy.apiRequest(
        'DELETE',
        `/api/${endpoint}/${id}`
    ).then((responseData) => {
        return responseData;
    });
});

/**
 * Updates an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name apiUpdate
 * @function
 * @param {String} endpoint - API endpoint for the request
 * @param {String} id - Id of the entity to be updated
 * @param {Object} data - Necessary data for the API request
 */
Cypress.Commands.add("apiUpdate", (endpoint, id, data) => {
    return cy.apiRequest('PATCH', `/api/${endpoint}/${id}`, data).then((responseData) => {
        return responseData;
    });
});

