const _ = require('lodash');
class BaseXpathBuilder {
    /**
     * BaseXpathBuilder constructor
     *
     * @constructor
     * @param {String} xpath
     */
    constructor(xpath = '/') {
        this.xpath = xpath;
    }
    /**
     * Create and return empty Xpath Builder instance
     *
     * @static
     * @param {String} xpath
     * @returns {BaseXpathBuilder}
     */
    static create(xpath = '/') {
        if (xpath.length > 1) {
            xpath = `${xpath}/`;
        }
        return new BaseXpathBuilder(xpath);
    }
    /**
     * Get built xpath
     *
     * @returns {String}
     */
    getXpath() {
        return this.xpath;
    }
    /**
     * Replace the built xpath
     *
     * @chainable
     * @param {String} xpath
     * @returns {BaseXpathBuilder}
     */
    setXpath(xpath) {
        this.xpath = xpath;
        return this;
    }
    /**
     * Explicitly reset the builder to start from anywhere
     *
     * @chainable
     * @param {String} xpath
     * @returns {BaseXpathBuilder}
     */
    reset(xpath = '/') {
        if (xpath.length > 1) {
            xpath = `${xpath}/`;
        }
        return this.setXpath(xpath);
    }
    /**
     * Refine current xpath by a child selector
     *
     * @chainable
     * @param {String} tag
     * @param {Array} [conditions=[]]
     * @param {Number|null} [index=null]
     * @returns {BaseXpathBuilder}
     */
    child(tag, conditions = [], index = null) {
        return this.appendPartialPath(tag, '/', conditions, index);
    }
    /**
     * Refine current xpath by an ancestor selector
     *
     * @chainable
     * @param {String} tag
     * @param {Array} [conditions=[]]
     * @param {Number|null} [index=null]
     * @returns {BaseXpathBuilder}
     */
    ancestor(tag, conditions = [], index = null) {
        return this.appendPartialPath(tag, '/ancestor::', conditions, index);
    }
    /**
     * Refine current xpath by a descendant selector
     *
     * @chainable
     * @param {String} tag
     * @param {Array} [conditions=[]]
     * @param {Number|null} [index=null]
     * @returns {BaseXpathBuilder}
     */
    descendant(tag, conditions = [], index = null) {
        return this.appendPartialPath(tag, '/descendant::', conditions, index);
    }
    /**
     * Refine current xpath by a preceding selector
     *
     * @chainable
     * @param {String} tag
     * @param {Array} [conditions=[]]
     * @param {Number|null} [index=null]
     * @returns {BaseXpathBuilder}
     */
    following(tag, conditions = [], index = null) {
        return this.appendPartialPath(tag, '/following::', conditions, index);
    }
    /**
     * Refine current xpath by a preceding selector
     *
     * @chainable
     * @param {String} tag
     * @param {Array} [conditions=[]]
     * @param {Number|null} [index=null]
     * @returns {BaseXpathBuilder}
     */
    preceding(tag, conditions = [], index = null) {
        return this.appendPartialPath(tag, '/preceding::', conditions, index);
    }
    /**
     * Refine current xpath by a following sibling selector
     *
     * @chainable
     * @param {String} tag
     * @param {Array} [conditions=[]]
     * @param {Number|null} [index=null]
     * @returns {BaseXpathBuilder}
     */
    followingSibling(tag, conditions = [], index = null) {
        return this.appendPartialPath(tag, '/following-sibling::', conditions, index);
    }
    /**
     * Refine current xpath by a preceding sibling selector
     *
     * @chainable
     * @param {String} tag
     * @param {Array} [conditions=[]]
     * @param {Number|null} [index=null]
     * @returns {BaseXpathBuilder}
     */
    precedingSibling(tag, conditions = [], index = null) {
        return this.appendPartialPath(tag, '/preceding-sibling::', conditions, index);
    }
    /**
     * Refine current xpath by a text contains selector
     *
     * @chainable
     * @param {String} text
     * @returns {BaseXpathBuilder}
     */
    contains(text) {
        if (!text.length) {
            return this;
        }
        this.xpath += `[text()[contains(.,'${text}')]]`;
        return this;
    }
    /**
     * @static
     * @param {String|String[]} string
     * @param {String} attribute
     * @returns {String}
     */
    static getContainsAttributeString(string, attribute) {
        if (!_.isArray(string)) {
            string = [ string ];
        }
        let result = '';
        string.forEach((part) => {
            result += `contains(concat(' ', normalize-space(@${attribute}), ' '), ' ${part} ') and `;
        });
        return _.trimEnd(result, ' and ');
    }
    /**
     * Parse an array of conditions into a xpath-readable predicate-string
     *
     * @param {Array} conditions
     * @returns {String}
     */
    parseConditions(conditions) {
        let conditionsString = '';
        const targetModifiersPrefixes = ['!'];
        const targetModifiers = ['@', '~'];
        const subConditionHandlers = ['starts-with', 'ends-with', 'visible'];
        const conditionsLength = conditions.length - 1;
        let index = 0;
        conditions.forEach((conditionObject) => {
            let target = (conditionObject.target && conditionObject.target.length) ? conditionObject.target : '';
            const condition = conditionObject.condition;
            if(index > 0 && index <= conditionsLength) {
                conditionsString += 'and ';
            }
            if (_.indexOf(subConditionHandlers, target) !== -1) {
                switch(target) {
                case 'starts-with': {
                    if (!_.isArray(condition) || condition.length !== 2) {
                        throw new Error([
                            'Invalid number of arguments for SubConditionHandler starts-with:',
                            target,
                            condition,
                            conditions
                        ].join(' '));
                    }
                    conditionsString += `${target}(${condition[0]}, '${condition[1]}')`;
                    break;
                }
                case 'ends-with': {
                    if (!_.isArray(condition) || condition.length !== 2) {
                        throw new Error(`Invalid number of arguments for SubConditionHandler: ${target}`);
                    }
                    const attr = condition[0];
                    const text = condition[1];
                    conditionsString += `'${text}'=substring(${attr}, strength-length(${attr})- strength-length('${text}') +1) `;
                    break;
                }
                default: {
                    throw new Error(`SubConditionHandler not implemented: ${target}`);
                }
                }
                return;
            }
            let targetModifiersPrefix = target.substring(0, 1);
            if (_.indexOf(targetModifiersPrefixes, targetModifiersPrefix) !== -1) {
                target = target.substring(1);
            } else {
                targetModifiersPrefix = null;
            }
            let targetModifier = target.substring(0, 1);
            if (_.indexOf(targetModifiers, targetModifier) !== -1) {
                target = target.substring(1);
            } else {
                targetModifier = null;
            }
            if (targetModifiersPrefix) {
                switch(targetModifiersPrefix) {
                case '!':
                    conditionsString += 'not(';
                    break;
                default:
                    throw new Error(`TargetModifiersPrefixHandler not implemented: ${targetModifiersPrefix}`);
                }
            }
            switch(targetModifier) {
            case '@':
                conditionsString += `${this.equals(target, condition)} `;
                break;
            case '~':
                conditionsString += `${this.getContainsString(target, condition)} `;
                break;
            default:
                conditionsString += `${target}()='${condition}' `;
            }
            if (targetModifiersPrefix) {
                switch(targetModifiersPrefix) {
                case '!':
                    conditionsString += ')';
                    break;
                }
            }
            index++;
        });
        return conditionsString;
    }
    /**
     * Internal helper function to append a new search selector to the xpath
     *
     * @chainable
     * @param {String} tag
     * @param {String} prefix
     * @param {Array} [conditions=[]]
     * @param {Number|null} [index=null]
     * @returns {BaseXpathBuilder}
     */
    appendPartialPath(tag, prefix, conditions, index) {
        if ('' === tag) {
            throw new Error('Invalid argument: Tag cannot be empty.');
        }
        if (null !== index && isNaN(index)) {
            throw new Error('Invalid argument: Index must be of type integer.');
        }
        this.xpath += prefix;
        this.xpath += tag;
        const conditionsString = this.parseConditions(conditions);
        if (conditionsString.length) {
            this.xpath += `[${_.trim(conditionsString)}]`;
        }
        if (null !== index) {
            this.xpath += `[${index}]`;
        }
        return this;
    }
    /**
     * Helper function for the predicate parser
     *
     * @param {String} target
     * @param {String} text
     * @returns {String}
     */
    equals(target, text) {
        switch(target) {
        case 'text': {
            return `text()='${text}'`;
        }
        default: {
            return `@${target}='${text}'`;
        }
        }
    }
    /**
     * Helper function for the predicate parser
     *
     * @param {String} target
     * @param {String} text
     * @returns {String}
     */
    getContainsString(target, text) {
        if (!_.isArray(text)) {
            text = [text];
        }
        switch(target) {
        case 'text': {
            let result = '';
            text.forEach((part) => {
                result += `./descendant-or-self::*[text()[contains(.,'${part}')]] and `;
            });
            return _.trimEnd(result, ' and ');
        }
        default: {
            return BaseXpathBuilder.getContainsAttributeString(text, target);
        }
        }
    }
}
module.exports = BaseXpathBuilder;