# FroshCypress
This is a project dealing with the implementation of E2E tests for Shopware 5 using [Cypress.io](https://www.cypress.io/) framework.

## Setup
Shopware 5 itself is not shipped with this project. This way, you need a running environment with a running Shopware 5 installation. For more details about the setup steps, please refer to Shopware's [getting started guide](https://docs.shopware.com/en/shopware-5-en/getting-started).

At first, clone this project in a folder you like. Then, please fill in the base URL matching your environment in `cypress.json`:
```
"baseUrl": "http://your-domain.test"
```

After that, you're able run the tests from command line via following command:
```
/node_modules/.bin/cypress run
```

If you want to use Cypress' test runner to watch and debug your tests directly on your machine, you can open it using this command:
```
./node_modules/.bin/cypress open
```

## Some things to keep in mind
Please notice that these Cypress tests don't rely on a specific dataset, but do need at least one entity of a kind to be available, e.g. one product, one customer, etc.

These tests are running on an english shop. This way, we use ```cy.visit('/en')``` in our frontend tests to signalise the usage of an english language shop. This way, you might need to customise these steps in your tests if you don't use an english language shop with this url. However, we plan to improve that in the future.

## Further information
- Cypress documentation: [Shopware devdocs](https://developers.shopware.com/) 
- Shopware developer documentation: [Shopware devdocs](https://developers.shopware.com/) 
- Shopware 5 project: [Shopware 5](https://github.com/shopware/shopware) 
