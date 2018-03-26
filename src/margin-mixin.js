/**
 * Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
 * Charts.
 * @name marginMixin
 * @memberof dc
 * @mixin
 * @param {Object} _chart
 * @returns {dc.marginMixin}
 */
dc.marginMixin = function (_chart) {
    var _margin;
    var _computedMargins;

    /**
     * Get or set the margins for a particular coordinate grid chart instance. The margins is stored as
     * an associative Javascript array.
     * @method margins
     * @memberof dc.marginMixin
     * @instance
     * @example
     * var leftMargin = chart.margins().left; // 30 by default
     * chart.margins().left = 50;
     * leftMargin = chart.margins().left; // now 50
     * @param {{top: Number, right: Number, left: Number, bottom: Number}} [margins={top: 10, right: 50, bottom: 30, left: 30}]
     * @returns {{top: Number, right: Number, left: Number, bottom: Number}|dc.marginMixin}
     */
    _chart.margins = function (margins) {
        if (!arguments.length) {
            return _margin;
        }
        _margin = margins;
        _chart.computedMargins(_chart._computeMargins());
        return _chart;
    };

    _chart.computedMargins = function (computedMargins) {
        if (!arguments.length) {
            return _computedMargins;
        }
        _computedMargins = computedMargins;
        return _chart;
    };

    _chart._computeMargins = function () {
        var margins = _chart.margins();
        return {top: margins.top, right: margins.right, bottom: margins.bottom, left: margins.left};
    };

    _chart.effectiveWidth = function () {
        return _chart.width() - _chart.computedMargins().left - _chart.computedMargins().right;
    };

    _chart.effectiveHeight = function () {
        return _chart.height() - _chart.computedMargins().top - _chart.computedMargins().bottom;
    };

    _chart.margins({top: 10, right: 50, bottom: 30, left: 30});

    return _chart;
};
