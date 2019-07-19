const axios = require('axios');
global.envConfig = require('../../../cypress.env.json');

module.exports = axios.create({
    baseURL: `${global.envConfig.baseUrl}/api`,
    timeout: 10000,
    auth: {
        username: global.envConfig.apiUser,
        password: global.envConfig.apiKey
    },
});