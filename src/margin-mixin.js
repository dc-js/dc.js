/**
 * Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
 * Charts.
 * @name marginMixin
 * @memberof dc
 * @mixin
 * @param {Object} _chart
 * @return {dc.marginMixin}
 */
dc.marginMixin = function (_chart) {
    _chart.xAxisLabelPadding = 0;
    _chart.xTickLabelPadding = 0;
    _chart.yAxisLabelPadding = 0;
    _chart.yTickLabelPadding = 0;

    /**
     * Get the margins for a particular coordinate grid chart instance.
     * @name margins
     * @memberof dc.marginMixin
     * @instance
     * @return {{top: Number, right: Number, left: Number, bottom: Number}}
     * @return {dc.marginMixin}
     */
    _chart.margins = function () {
        return {
            top: 10,
            bottom: _chart.xAxisLabelPadding + _chart.xTickLabelPadding + 10,
            right: 10,
            left: _chart.yAxisLabelPadding + _chart.yTickLabelPadding + 10,
        }
    };

    _chart.effectiveWidth = function () {
        return _chart.width() - _chart.margins().left - _chart.margins().right;
    };

    _chart.effectiveHeight = function () {
        return _chart.height() - _chart.margins().top - _chart.margins().bottom;
    };

    return _chart;
};
