const XPathBuilder = require('./xpath-builder/backend-xpath-builder');
const xp = new XPathBuilder();

const path = require('path');
const resolve = (relativePath) => {
    return path.resolve(__dirname, '..', relativePath);
};

module.exports = {
    XPathBuilder: XPathBuilder,
    xp: xp,
    resolvePath: resolve
};
