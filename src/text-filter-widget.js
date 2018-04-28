/**
 * Text Filter Widget
 *
 * The text filter widget is a simple widget designed to display an input field allowing to filter
 * data that matches the text typed.
 * As opposed to the other charts, this doesn't display any result and doesn't update its display,
 * it's just to input an filter other charts.
 *
 * @class textFilterWidget
 * @memberof dc
 * @mixes dc.baseMixin
 * @example
 *
 * var data = [{"firstName":"John","lastName":"Coltrane"}{"firstName":"Miles",lastName:"Davis"}]
 * var ndx = crossfilter(data);
 * var dimension = ndx.dimension(function(d) {
 *     return d.lastName.toLowerCase() + ' ' + d.firstName.toLowerCase();
 * });
 *
 * dc.textFilterWidget('#search')
 *     .dimension(dimension);
 *     // you don't need the group() function
 *
 * @param {String|node|d3.selection|dc.compositeChart} parent - Any valid
 * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
 * specifying a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.textFilterWidget}
 **/

dc.textFilterWidget = function (parent, chartGroup) {
    var INPUT_CSS_CLASS = 'dc-text-filter-input';

    var _chart = dc.baseMixin({});

    var _normalize = function (s) {
        return s.toLowerCase();
    };

    var _filterFunctionFactory = function (query) {
        query = _normalize(query);
        return function (d) {
            return _normalize(d).indexOf(query) !== -1;
        };
    };

    var _placeHolder = 'search';

    _chart.group(function () {
        throw 'the group function on textFilterWidget should never be called, please report the issue';
    });

    _chart._doRender = function () {
        _chart.select('input').remove();

        var _input = _chart.root().append('input')
            .classed(INPUT_CSS_CLASS, true);

        _input.on('input', function () {
            _chart.dimension().filterFunction(_filterFunctionFactory(this.value));
            dc.events.trigger(function () {
                dc.redrawAll();
            }, dc.constants.EVENT_DELAY);
        });

        _chart._doRedraw();

        return _chart;
    };

    _chart._doRedraw = function () {
        _chart.root().selectAll('input')
            .attr('placeholder', _placeHolder);

        return _chart;
    };

    /**
     * This function will be called on values before calling the filter function.
     * @name normalize
     * @memberof dc.textFilterWidget
     * @instance
     * @example
     * // This is the default
     * chart.normalize(function (s) {
     *   return s.toLowerCase();
     * });
     * @param {function} [normalize]
     * @returns {dc.textFilterWidget|function}
     **/
    _chart.normalize = function (normalize) {
        if (!arguments.length) {
            return _normalize;
        }
        _normalize = normalize;
        return _chart;
    };

    /**
     * Placeholder text in the search box.
     * @name placeHolder
     * @memberof dc.textFilterWidget
     * @instance
     * @example
     * // This is the default
     * chart.placeHolder('type to filter');
     * @param {function} [placeHolder='search']
     * @returns {dc.textFilterWidget|string}
     **/
    _chart.placeHolder = function (placeHolder) {
        if (!arguments.length) {
            return _placeHolder;
        }
        _placeHolder = placeHolder;
        return _chart;
    };

    /**
     * This function will be called with the search text, it needs to return a function that will be used to
     * filter the data. The default function checks presence of the search text.
     * @name filterFunctionFactory
     * @memberof dc.textFilterWidget
     * @instance
     * @example
     * // This is the default
     * function (query) {
     *     query = _normalize(query);
     *     return function (d) {
     *         return _normalize(d).indexOf(query) !== -1;
     *     };
     * };
     * @param {function} [filterFunctionFactory]
     * @returns {dc.textFilterWidget|function}
     **/
    _chart.filterFunctionFactory = function (filterFunctionFactory) {
        if (!arguments.length) {
            return _filterFunctionFactory;
        }
        _filterFunctionFactory = filterFunctionFactory;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
