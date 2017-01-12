/**
 * A display of a single numeric value.
 * Unlike other charts, you do not need to set a dimension. Instead a group object must be provided and
 * a valueAccessor that returns a single value.
 * @class numberDisplay
 * @memberof dc
 * @mixes dc.baseMixin
 * @example
 * // create a number display under #chart-container1 element using the default global chart group
 * var display1 = dc.numberDisplay('#chart-container1');
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.numberDisplay}
 */
dc.numberDisplay = function (parent, chartGroup) {
    var SPAN_CLASS = 'number-display';
    var _formatNumber = d3.format('.2s');
    var _chart = dc.baseMixin({});
    var _html = {one: '', some: '', none: ''};
    var _lastValue;

    // dimension not required
    _chart._mandatoryAttributes(['group']);

    /**
     * Gets or sets an optional object specifying HTML templates to use depending on the number
     * displayed.  The text `%number` will be replaced with the current value.
     * - one: HTML template to use if the number is 1
     * - zero: HTML template to use if the number is 0
     * - some: HTML template to use otherwise
     * @method html
     * @memberof dc.numberDisplay
     * @instance
     * @example
     * numberWidget.html({
     *      one:'%number record',
     *      some:'%number records',
     *      none:'no records'})
     * @param {{one:String, some:String, none:String}} [html={one: '', some: '', none: ''}]
     * @returns {{one:String, some:String, none:String}|dc.numberDisplay}
     */
    _chart.html = function (html) {
        if (!arguments.length) {
            return _html;
        }
        if (html.none) {
            _html.none = html.none;//if none available
        } else if (html.one) {
            _html.none = html.one;//if none not available use one
        } else if (html.some) {
            _html.none = html.some;//if none and one not available use some
        }
        if (html.one) {
            _html.one = html.one;//if one available
        } else if (html.some) {
            _html.one = html.some;//if one not available use some
        }
        if (html.some) {
            _html.some = html.some;//if some available
        } else if (html.one) {
            _html.some = html.one;//if some not available use one
        }
        return _chart;
    };

    /**
     * Calculate and return the underlying value of the display.
     * @method value
     * @memberof dc.numberDisplay
     * @instance
     * @returns {Number}
     */
    _chart.value = function () {
        return _chart.data();
    };

    _chart.data(function (group) {
        var valObj = group.value ? group.value() : group.top(1)[0];
        return _chart.valueAccessor()(valObj);
    });

    _chart.transitionDuration(250); // good default
    _chart.transitionDelay(0);

    _chart._doRender = function () {
        var newValue = _chart.value(),
            span = _chart.selectAll('.' + SPAN_CLASS);

        if (span.empty()) {
            span = span.data([0])
                .enter()
                .append('span')
                .attr('class', SPAN_CLASS);
        }

        span.transition()
            .duration(_chart.transitionDuration())
            .delay(_chart.transitionDelay())
            .ease('quad-out-in')
            .tween('text', function () {
                // [XA] don't try and interpolate from Infinity, else this breaks.
                var interpStart = isFinite(_lastValue) ? _lastValue : 0;
                var interp = d3.interpolateNumber(interpStart || 0, newValue);
                _lastValue = newValue;
                return function (t) {
                    var html = null, num = _chart.formatNumber()(interp(t));
                    if (newValue === 0 && (_html.none !== '')) {
                        html = _html.none;
                    } else if (newValue === 1 && (_html.one !== '')) {
                        html = _html.one;
                    } else if (_html.some !== '') {
                        html = _html.some;
                    }
                    this.innerHTML = html ? html.replace('%number', num) : num;
                };
            });
    };

    _chart._doRedraw = function () {
        return _chart._doRender();
    };

    /**
     * Get or set a function to format the value for the display.
     * @method formatNumber
     * @memberof dc.numberDisplay
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md d3.format}
     * @param {Function} [formatter=d3.format('.2s')]
     * @returns {Function|dc.numberDisplay}
     */
    _chart.formatNumber = function (formatter) {
        if (!arguments.length) {
            return _formatNumber;
        }
        _formatNumber = formatter;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
