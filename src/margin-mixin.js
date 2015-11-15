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

    _chart.rightYAxisLabelPadding = 0;
    _chart.rightYTickLabelPadding = 0;

    _chart.legendTopPadding = 0;
    _chart.legendBottomPadding = 0;
    _chart.legendLeftPadding = 0;
    _chart.legendRightPadding = 0;

    /**
     * Get the margins for a particular coordinate grid chart instance.
     * @name margins
     * @memberof dc.marginMixin
     * @instance
     * @return {{top: Number, right: Number, left: Number, bottom: Number}}
     * @return {dc.marginMixin}
     */
    _chart.margins = function () {
        var chart = _chart._parent || _chart;

        return {
            top: chart.legendTopPadding + 10,
            bottom: chart.xAxisLabelPadding + chart.xTickLabelPadding + chart.legendBottomPadding + 10,
            left: chart.yAxisLabelPadding + chart.yTickLabelPadding + chart.legendLeftPadding + 10,
            right: chart.rightYAxisLabelPadding + chart.rightYTickLabelPadding + chart.legendRightPadding + 10,
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
