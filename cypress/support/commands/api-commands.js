/**
 * Authenticate towards the Shopware API
 * @memberOf Cypress.Chainable#
 * @name authenticate
 * @function
 */
Cypress.Commands.add("authenticate", () => {
    return cy.request(
        'POST',
        '/api',
        {
            grant_type: Cypress.env('grant') ? Cypress.env('grant') : 'password',
            client_id: Cypress.env('client_id') ? Cypress.env('client_id') : 'administration',
            scopes: Cypress.env('scope') ? Cypress.env('scope') : 'write',
            username: Cypress.env('username') ? Cypress.env('username') : 'admin',
            password: Cypress.env('password') ? Cypress.env('password') : 'shopware'
        }).then((responseData) => {
        return {
            access: responseData.body.access_token,
            refresh: responseData.body.refresh_token,
            expiry: Math.round(+new Date() / 1000) + responseData.body.expires_in
        };
    });
});

/**
 * Switches administration UI locale to EN_GB
 * @memberOf Cypress.Chainable#
 * @name setLocaleToEnGb
 * @function
 */
Cypress.Commands.add("setLocaleToEnGb", () => {
    cy.authenticate().then(() => {
        return cy.window().then((win) => {
            win.localStorage.setItem('sw-admin-locale', 'en-GB');
        })
    })
});

/**
 * Logs in silently using Shopware API
 * @memberOf Cypress.Chainable#
 * @name loginViaApi
 * @function
 */
Cypress.Commands.add("loginViaApi", () => {
    return cy.authenticate().then((result) => {
        return cy.window().then((win) => {
            win.localStorage.setItem('bearerAuth', JSON.stringify(result));
            // Return bearer token
            return localStorage.getItem('bearerAuth');
        }, [result], (data) => {
            if (!data.value) {
                cy.login('admin');
            }
        }).then(() => {
            cy.visit('/admin');
        });
    });
});

/**
 * Handling API requests
 * @memberOf Cypress.Chainable#
 * @name requestAdminApi
 * @function
 */
Cypress.Commands.add("requestAdminApi", (method, url, requestData = {}) => {
    const requestConfig = {
        auth: {
            username: 'demo', // process.env.user,
            password: '8mnq6vav02p3buc8h2q4q6n137' // process.env.api_key
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

Cypress.Commands.add("searchRequestAdminApi", (method, url, requestData = {}) => {
    const requestConfig = {
        auth: {
            username: 'demo', // process.env.user,
            password: '8mnq6vav02p3buc8h2q4q6n137' // process.env.api_key
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
 * @name createViaAdminApi
 * @function
 * @param {Object} data - Necessary  for the API request
 */
Cypress.Commands.add("createViaAdminApi", (data) => {
    return cy.requestAdminApi(
        'POST',
        `/api/${data.endpoint}`,
        data
    )
});

/**
 * Search for an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name searchViaAdminApi
 * @function
 * @param {Object} data - Necessary data for the API request
 */
Cypress.Commands.add("searchViaAdminApi", (data) => {
    const filters = {
        filter: [{
            name: data.value
        }],
        limit: 1
    };

    return cy.searchRequestAdminApi(
        'GET',
        `/api/${data.endpoint}`,
        filters
    ).then((responseData) => {
        console.log('responseData search :', responseData.body.data.id);
        return responseData.body.data[0].id;
    });
});

/**
 * Search for an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name deleteViaAdminApi
 * @function
 * @param {String} endpoint - API endpoint for the request
 * @param {String} id - Id of the entity to be deleted
 */
Cypress.Commands.add("deleteViaAdminApi", (endpoint, id) => {
    return cy.requestAdminApi(
        'DELETE',
        `/api/${endpoint}/${id}`
    ).then((responseData) => {
        console.log('responseData delete :', responseData);
        return responseData;
    });
});

/**
 * Updates an existing entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name updateViaAdminApi
 * @function
 * @param {String} endpoint - API endpoint for the request
 * @param {String} id - Id of the entity to be updated
 * @param {Object} data - Necessary data for the API request
 */
Cypress.Commands.add("updateViaAdminApi", (endpoint, id, data) => {
    return cy.requestAdminApi('PATCH', `/api/${endpoint}/${id}`, data).then((responseData) => {
        return responseData;
    });
});

