# FroshCypress
This is a project dealing with the implementation of E2E tests for the Shopware 5 using [Cypress.io](https://www.cypress.io/) framework.

## Setup
Shopware 5 itself is not shipped with this project. This way, you need a running environment with a running Shopware 5 installation. For more details about the setup steps, please refer to Shopware's [getting started guide](https://docs.shopware.com/en/shopware-5-en/getting-started).

At first, clone this project in a folder you like. Then, please fill in thhe base URL matching your environment in `cypress.json`:
```
"baseUrl": "http://your-domain.test"
```

After that, you can just run the tests from command line via following command:
```
/node_modules/.bin/cypress run

```

If you want to use Cypress' test runner and watch and debug your tests directly on your maschine, you can open Cypress using this command:
```
./node_modules/.bin/cypress open
```


## One thing to keep in mind
Please notice that these Cypress tests don't rely on a specific dataset, but do need at least one entity of a kind to be available, e.g. one product, one customer, etc.

## Further information
- Cypress documentation: [Shopware devdocs](https://developers.shopware.com/) 
- Shopware developer documentation: [Shopware devdocs](https://developers.shopware.com/) 
- Shopware 5 project: [Shopware 5](https://github.com/shopware/shopware) 
