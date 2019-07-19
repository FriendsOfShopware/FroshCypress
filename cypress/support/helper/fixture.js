const Http = require('./http');
const fs = require('fs');
const qs = require('qs');

let loadFixture = (fixtureName) => {
    return new Promise((resolve => {
        fs.readFile(`${__dirname}/../../fixtures/${fixtureName}.json`, (err, data) => {
            if (err) throw err;

            resolve(JSON.parse(data.toString()));
        });
    }));
};

class FixtureManager {
    constructor() {
        this.cleanupIds = [];
        this.batchAbleEndpoints = ['articles'];
    }

    async applyFixture(fixtureName, endpoint) {
        let json = await loadFixture(fixtureName);

        if (typeof json.forEach === 'undefined') {
            try {
                let res = await Http.post(`/${endpoint}`, json);

                this.cleanupIds.push({
                    endpoint: endpoint,
                    property: 'id',
                    value: res.data.data.id
                });
            } catch (e) {
                console.log(e);

                new Error(`Request failed with fixture ${fixtureName} to endpoint ${endpoint}`);
                return undefined;
            }

            return json;;
        } else if (this.batchAbleEndpoints.indexOf(endpoint) !== -1) {
            let res = await Http.put(`/${endpoint}/`, json);

            res.data.data.forEach(event => {
                this.cleanupIds.push({
                    endpoint: endpoint,
                    property: 'id',
                    value: event.data.id
                });
            });

            return json;
        }

        return null;
    }

    async registerToCleanup(endpoint, field, value) {
        let query = {filter: {}};
        query.filter[field] = value;

        let res = await Http.get(`/${endpoint}?${qs.stringify(query)}`);

        res.data.data.forEach(row => {
            this.cleanupIds.push({
                endpoint: endpoint,
                property: 'id',
                value: row.id
            });
        });

        return null;
    }

    async rollback() {
        if (this.cleanupIds.length === 0) {
            return null;
        }

        let promises = [];
        this.cleanupIds.forEach(item => {
            promises.push(Http.delete(`/${item.endpoint}/${item.value}`));
        });
        this.cleanupIds = [];

        await Promise.all(promises);
        return null;
    }
}

module.exports = new FixtureManager();