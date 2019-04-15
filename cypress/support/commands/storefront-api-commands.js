/**
 * Get the sales channel Id via Admin API
 * @memberOf Cypress.Chainable#
 * @name getSalesChannelId
 * @function
 */
Cypress.Commands.add('getSalesChannelId', () => {
    return cy.authenticate().then((result) => {
        const parameters = {
            data: {
                headers: {
                    Accept: 'application/vnd.api+json',
                    Authorization: `Bearer ${result.access}`,
                    'Content-Type': 'application/json'
                },
                field: 'name',
                value: Cypress.config('salesChannelName')
            },
            endpoint: 'sales-channel'
        };

        return cy.apiSearchByName(parameters).then((data) => {
            return data.attributes.accessKey;
        });
    });
});

/**
 * Do Storefront Api Requests
 * @memberOf Cypress.Chainable#
 * @name storefrontApiRequest
 * @function
 * @param {string} HTTP-Method
 * @param {string} endpoint name
 * @param {Object} header
 * @param {Object} body
 */
Cypress.Commands.add('storefrontApiRequest', (method, endpoint, header = {}, body = {}) => {
    return cy.getSalesChannelId().then((salesChannelAccessKey) => {
        const requestConfig = {
            headers: {
                'x-sw-access-key': salesChannelAccessKey,
                ...header
            },
            body: {
                ...body
            },
            method: method,
            url: `/storefront-api/v1/${endpoint}`,
        };

        return cy.request(requestConfig).then((result) => {
            return result.body.data;
        });
    })
});

/**
 * Returns random product with id, name and url to view product
 * @memberOf Cypress.Chainable#
 * @name getRandomProductInformationForCheckout
 * @function
 */
Cypress.Commands.add('getRandomProductInformationForCheckout', () => {
    return cy.apiRequest(
        'GET',
        '/api/articles?language=2'
    ).then((result) => {
        const index = Math.floor((Math.random() * result.body.data.length));

        return cy.getProductById({
            endpoint: 'articles',
            id: result.body.data[index].id,
            options: {
                considerTaxInput: true
            }
        })
    }).then((result) => {
        return {
            id: result.body.data.id,
            name: result.body.data.name,
            gross: result.body.data.mainDetail.prices[0].price,
            grossRound: result.body.data.mainDetail.prices[0].price.toFixed(2),
            net: result.body.data.mainDetail.prices[0].net
        }
    })
});
