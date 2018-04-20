/**
 * General configuration
 *
 * @class config
 * @memberof dc
 * @returns {dc.config}
 */
dc.config = (function () {
    var _config = {};

    // D3v5 has removed schemeCategory20c, copied here for backward compatibility
    var _schemeCategory20c = [
        '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d',
        '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476',
        '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc',
        '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9'];

    var _defaultColors = _schemeCategory20c;

    /**
     * Set the default color scheme for ordinal charts. Changing it will impact all ordinal charts.
     *
     * By default it is set to a copy of
     * `d3.schemeCategory20c` for backward compatibility. This color scheme has been
     * [removed from D3v5](https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50).
     * In DC 3.1 release it will change to a more appropriate default.
     *
     * @example
     * dc.config.defaultColors(d3.schemeSet1)
     * @method defaultColors
     * @memberof dc.config
     * @instance
     * @param {Array} [colors]
     * @returns {Array|dc.config}
     */
    _config.defaultColors = function (colors) {
        if (!arguments.length) {
            // Issue warning if it uses _schemeCategory20c
            if (_defaultColors === _schemeCategory20c) {
                dc.logger.warnOnce('You are using d3.schemeCategory20c, which has been removed in D3v5. ' +
                    'See the explanation at https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50. ' +
                    'DC is using it for backward compatibility, however it will be changed in DCv3.1. ' +
                    'You can change it by calling dc.config.defaultColors(newScheme). ' +
                    'See https://github.com/d3/d3-scale-chromatic for some alternatives.');
            }
            return _defaultColors;
        }
        _defaultColors = colors;
        return _config;
    };

    return _config;
})();
