/**
 * General configuration
 *
 * @class config
 * @memberof dc
 * @returns {dc.config}
 */
dc.config = (function () {
    var _config = {};

    var _useV2CompatColorScheme = false;
    _config.compatColors = null;
    var _schemeCategory20c = [
        '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d',
        '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476',
        '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc',
        '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9'];

    /**
     * Set this flag to use DCv2's color scheme (d3.schemeCategory20c).
     * Please note this color scheme has been deprecated by D3
     * (https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50) as well as DC.
     * @method useV2CompatColorScheme
     * @memberof dc.config
     * @instance
     * @param {Boolean} [flag=false]
     * @returns {Boolean|dc.config}
     */
    _config.useV2CompatColorScheme = function (flag) {
        if (!arguments.length) {
            return _useV2CompatColorScheme;
        }
        _useV2CompatColorScheme = flag;
        if (_useV2CompatColorScheme) {
            dc.logger.warn('Forcing use of d3.schemeCategory20c. It has been deprecated and will be removed in dc 3.1');
            _config.compatColors = _schemeCategory20c;
        }
        return _config;
    };

    // _config.useV2CompatColorScheme(true);

    return _config;
})();
