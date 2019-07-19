// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
global.envConfig = require('../../cypress.env.json');
const FixtureManager = require('../support/helper/fixture');
const Http = require('../support/helper/http');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
    on('task', {
        applyFixture ({fixtureName, endpoint }) {
            return FixtureManager.applyFixture(fixtureName, endpoint);
        },
        registerToCleanup ({endpoint, field, value }) {
            return FixtureManager.registerToCleanup(endpoint, field, value);
        },
        rollbackFixtures() {
            return FixtureManager.rollback();
        },
        async rebuildIndex() {
            await Http.get('/FroshCypressHelper');
            return null;
        }
    })
};
