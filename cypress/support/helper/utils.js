const XPathBuilder = require('./xpath-builder/backend-xpath-builder');
const xp = new XPathBuilder();

module.exports = {
    XPathBuilder: XPathBuilder,
    xp: xp
};
