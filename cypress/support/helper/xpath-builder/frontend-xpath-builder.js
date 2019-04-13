const BaseXpathBuilder = require('./base-xpath-builder');

/**
 * @extends BaseXPathBuilder
 */
class FrontendXpathBuilder extends BaseXpathBuilder {
    /**
     * Returns xpath that selects an input field with an exact id
     *
     * @static
     * @param {String} id
     * @param {String} [scope='/']
     * @returns {String}
     */
    static getInputById(id, scope = '/') {
        return super
            .create(scope)
            .child('input', [{
                target: '@id',
                condition: id
            }])
            .getXpath();
    }

    /**
     * Return xpath to an element by its name
     *
     * @static
     * @param {String} tag
     * @param {String} name
     * @param {String} [scope='/']
     * @returns {String}
     */
    static getElementXpathByName(tag, name, scope = '/') {
        return super
            .create(scope)
            .child(tag, [{
                target: '~name',
                condition: name
            }])
            .getXpath();
    }

    /**
     * Returns xpath that selects a form based on its action
     *
     * @static
     * @param {String} action
     * @param {String} [scope='/']
     * @returns {String}
     */
    static getFormByAction(action, scope = '/') {
        return super
            .create(scope)
            .child('form', [{
                target: '@action',
                condition: action
            }])
            .getXpath();
    }
}