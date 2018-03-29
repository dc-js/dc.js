/**
 * input Filter Widget
 *
 * The input filter data widget is a simple widget designed to display an input field allowing to filter
 * the data that matches the text typed.
 * As opposed to the other graphs, this doesn't display any result and doesn't update its display,
 * it's just to input an filter other graphs.
 *
 * @class inputFilter
 * @memberof dc
 * @mixes dc.baseMixin
 * @example
 *
 * var data = [{"firstname":"John","lastname":"Coltrane"}{"firstname":"Miles",lastname:"Davis"}]
 * var ndx = crossfilter(data);
 * var dimension = ndx.dimension(function(d) {
 *     return d.lastname.toLowerCase() + ' ' + d.firstname.toLowerCase();
 * });
 *
 * dc.inputFilter('#search')
 *     .dimension(dimension);
 *     // you don't need the group() function
 *
 * @param {String|node|d3.selection|dc.compositeChart} parent - Any valid
 * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
 * specifying a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.inputFilter}
 **/

dc.inputFilter = function (parent, chartGroup) {
    var INPUT_CSS_CLASS = 'dc-filter-input';

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
        throw 'the group function on inputFilter should never be called, please report the issue';
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
     * @memberof dc.inputFilter
     * @instance
     * @example
     * // This is the default
     * chart.normalize(function (s) {
     *   return s.toLowerCase();
     * });
     * @param {function} [normalize]
     * @returns {dc.inputFilter|function}
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
     * @memberof dc.inputFilter
     * @instance
     * @example
     * // This is the default
     * chart.placeHolder('type to filter');
     * @param {function} [placeHolder='search']
     * @returns {dc.inputFilter|string}
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
     * @memberof dc.inputFilter
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
     * @returns {dc.inputFilter|function}
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
