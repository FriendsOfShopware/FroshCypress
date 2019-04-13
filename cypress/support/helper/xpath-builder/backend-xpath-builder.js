const BaseXPathBuilder = require('./base-xpath-builder');

/**
 * @extends BaseXPathBuilder
 */
class BackendXpathBuilder extends BaseXPathBuilder {
    /**
     * Get an xpath for an ExtJS window by its title
     *
     * This function builds an xpath that matches the window name exactly, but
     * allows explicit fuzziness by passing in 'false' as the second parameter.
     *
     * @example
     * const BackendXPathBuilder = require('../components/backend-xpath-builder');
     *
     * module.exports = {
     *   'demo test': (browser) {
     *     const xpath = BackendXPathBuilder.getWindowXpathByTitle('Artikel');
     *     // ...do your assertions
     *   }
     * };
     *
     * @static
     * @param {String} title
     * @param {Boolean} [exactMatch=true]
     * @returns {String}
     */
    static getWindowXpathByTitle(title, exactMatch = true) {
        const prefix = exactMatch ? '@' : '~';

        return super
            .create()
            .child('span', [{
                target: `${prefix}text`,
                condition: title
            }], 1)
            .ancestor('div', [{
                target: '~class',
                condition: 'x-window'
            }], 1)
            .getXpath();
    }

    /**
     * Get an xpath for an ExtJS form element by its label
     *
     * @example
     * const BackendXPathBuilder = require('../components/backend-xpath-builder');
     *
     * module.exports = {
     *   'demo test': (browser) {
     *     const xpath = BackendXPathBuilder.getFormElementXpathByLabel('Artikelnummer', 'input');
     *     // ...do your assertions
     *   }
     * };
     *
     * @static
     * @param {String} label
     * @param {String} [tag='input[1]']
     * @param {String} [scope='/']
     * @returns {String}
     */
    static getFormElementXpathByLabel(label, tag = 'input[1]', scope = '/') {
        return super
            .create(scope)
            .descendant('label', [{
                target: '~text',
                condition: label
            }])
            .ancestor('td', [], 1)
            .followingSibling('td', [], 1)
            .descendant(tag)
            .getXpath();
    }

    /**
     * Return an Xpath that finds a button by its label
     *
     * @example
     * const BackendXPathBuilder = require('../components/backend-xpath-builder');
     *
     * module.exports = {
     *   'demo test': (browser) {
     *     const xpath = BackendXPathBuilder.getButtonXpathByLabel('Speichern');
     *     // ...do your assertions
     *   }
     * };
     *
     * @static
     * @param {String} label
     * @param {String} [scope='/']
     * @returns {String}
     */
    static getButtonXpathByLabel(label, scope = '/') {
        return super
            .create(scope)
            .child('span', [{
                target: '@class',
                condition: 'x-btn-inner'
            }])
            .contains(label)
            .ancestor('button')
            .getXpath();
    }

    /**
     * Shorthand function to get an extJS input field by its label
     *
     * @example
     * const BackendXPathBuilder = require('../components/backend-xpath-builder');
     *
     * module.exports = {
     *   'demo test': (browser) {
     *     const xpath = BackendXPathBuilder.getInputXpathByLabel('Name');
     *     // ...do your assertions
     *   }
     * };
     *
     * @static
     * @param {String} label
     * @param {String} [scope='/']
     * @returns {String}
     */
    static getInputXpathByLabel(label, scope = '/') {
        return BackendXpathBuilder.getFormElementXpathByLabel(label, 'input', scope);
    }

    /**
     * Returns label-specific xpath for a combobox
     *
     * @example
     * const BackendXPathBuilder = require('../components/backend-xpath-builder');
     *
     * module.exports = {
     *   'demo test': (browser) {
     *     const xpath = BackendXPathBuilder.getComboboxXpathByLabel('Hersteller');
     *     // ...do your assertions
     *   }
     * };
     *
     * @static
     * @param {String} label
     * @param {String} [scope='/']
     * @returns {String}
     */
    static getComboboxXpathByLabel(label, scope = '/') {
        return super
            .create(scope)
            .descendant('label', [{
                target: '@text',
                condition: label
            }])
            .ancestor('td', [], 1)
            .followingSibling('td', [], 1)
            .descendant('div', [{
                target: '~class',
                condition: 'x-form-trigger'
            }])
            .ancestor('tr', [], 2)
            .getXpath();
    }

    /**
     * Return xpath to the currently focused ExtJS input
     *
     * @example
     * const BackendXPathBuilder = require('../components/backend-xpath-builder');
     *
     * module.exports = {
     *   'demo test': (browser) {
     *     const xpath = BackendXPathBuilder.getFocusedElementXpath();
     *     // ...do your assertions
     *   }
     * };
     *
     * @static
     * @returns {String}
     */
    static getFocusedElementXpath() {
        return super
            .create()
            .child('input', [{
                target: '~class',
                condition: 'x-form-focus'
            }])
            .getXpath();
    }

    /**
     * Return xpath to an ExtJS tab by its label
     *
     * @example
     * const BackendXPathBuilder = require('../components/backend-xpath-builder');
     *
     * module.exports = {
     *   'demo test': (browser) {
     *     const xpath = BackendXPathBuilder.getTabXpathByLabel('Medien');
     *     // ...do your assertions
     *   }
     * };
     *
     * @static
     * @param label
     * @returns {String}
     */
    static getTabXpathByLabel(label) {
        return super
            .create()
            .child('span', [{
                target: '@text',
                condition: label
            }])
            .ancestor('div', [{
                target: '~class',
                condition: 'x-tab'
            }], 1)
            .getXpath();
    }

    /**
     * Return xpath to ExtJS icon by type
     *
     * @example
     * const BackendXPathBuilder = require('../components/backend-xpath-builder');
     *
     * module.exports = {
     *   'demo test': (browser) {
     *     const xpath = BackendXPathBuilder.getIconXpathByType('edit');
     *     // ...do your assertions
     *   }
     * };
     *
     * @static
     * @param {String} type
     */
    static getIconXpathByType(type) {
        switch(type) {
        case 'edit': {
            return super
                .create()
                .child('img', [{
                    target: '~class',
                    condition: 'sprite-pencil'
                }])
                .getXpath();
        }
        case 'delete': {
            return super
                .create()
                .child('img', [{
                    target: '~class',
                    condition: 'sprite-minus-circle-frame'
                }])
                .getXpath();
        }
        default: {
            throw new Error(`Unknown icon type ${type}`);
        }
        }
    }

    /**
     * Return a drop down xpath by its action
     *
     * @param {String} action
     * @param {String} optionText
     * @return {String}
     */
    getDropdownXpathByAction(action, optionText = '') {
        this
            .child('div', [{
                target: '~class',
                condition: 'x-boundlist'
            }, {
                condition: 'and'
            }, {
                target: '@data-action',
                condition: action
            }]);

        return (!optionText.length)
            ? this.descendant('li', [{
                target: '@role',
                condition: 'option'
            }]).getXpath()
            : this.descendant('li', [{
                target: '@role',
                condition: 'option'
            }, {
                condition: 'and'
            }, {
                target: '@text',
                condition: optionText
            }]).getXpath();
    }

    /**
     * Return an Xpath that finds a fieldset by its label
     *
     * @example
     * const BackendXPathBuilder = require('../components/backend-xpath-builder');
     *
     * module.exports = {
     *   'demo test': (browser) {
     *     const xpath = BackendXPathBuilder.getFieldsetXpathByLabel('Stammdaten');
     *     // ...do your assertions
     *   }
     * };
     *
     * @param {String} label
     * @param {String} [scope='/']
     * @returns {String}
     */
    static getFieldsetXpathByLabel(label, scope = '/') {
        return super
            .create(scope)
            .descendant('fieldset')
            .descendant('legend')
            .descendant('div')
            .contains('label')
            .ancestor('fieldset')
            .getXpath();
    }
}

module.exports = BackendXpathBuilder;