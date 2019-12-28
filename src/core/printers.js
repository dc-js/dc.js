import {utils} from './utils';

/**
 * @namespace printers
 * @type {{}}
 */
export const printers = {};

/**
 * Converts a list of filters into a readable string.
 * @method filters
 * @memberof printers
 * @param {Array<filters>} filters
 * @returns {String}
 */
printers.filters = function (filters) {
    let s = '';

    for (let i = 0; i < filters.length; ++i) {
        if (i > 0) {
            s += ', ';
        }
        s += printers.filter(filters[i]);
    }

    return s;
};

/**
 * Converts a filter into a readable string.
 * @method filter
 * @memberof printers
 * @param {filters|any|Array<any>} filter
 * @returns {String}
 */
printers.filter = function (filter) {
    let s = '';

    if (typeof filter !== 'undefined' && filter !== null) {
        if (filter instanceof Array) {
            if (filter.length >= 2) {
                s = `[${filter.map(e => utils.printSingleValue(e)).join(' -> ')}]`;
            } else if (filter.length >= 1) {
                s = utils.printSingleValue(filter[0]);
            }
        } else {
            s = utils.printSingleValue(filter);
        }
    }

    return s;
};
