/**
 * htmlLegend is a attachable widget that can be added to other dc charts to render horizontal/vertical legend
 * labels.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * @class legend
 * @memberof dc
 * @example
 * chart.legend(dc.htmlLegend().container(legendContainerElement).horizontal(false))
 * @returns {dc.htmlLegend}
 */
dc.htmlLegend = function () {
    var _legend = {},
        _parent,
        _container,
        _legendText = dc.pluck('name'),
        _maxItems,
        _horizontal = false;

    var _l;

    _legend.parent = function (p) {
        if (!arguments.length) {
            return _parent;
        }
        _parent = p;
        return _legend;
    };

    _legend.render = function () {
        var orientation = _horizontal ? 'horizontal' : 'vertical';
        _container.select('div.dc-html-legend').remove();
        _l = _container.append('div')
            .attr('class', 'dc-html-legend');
        var legendables = _parent.legendables();
        if (_maxItems !== undefined) {
            legendables = legendables.slice(0, _maxItems);
        }
        var itemEnter = _l.selectAll('div.dc-legend-item-' + orientation)
            .data(legendables).enter()
            .append('div').attr('class', 'dc-legend-item-' + orientation)
            .on('mouseover', _parent.legendHighlight)
            .on('mouseout', _parent.legendReset)
            .on('click', _parent.legendToggle);
        itemEnter.append('span')
            .attr('class', 'dc-legend-item-color')
            .style('background-color', dc.pluck('color'));
        itemEnter.append('span')
            .attr('class', 'dc-legend-item-label')
            .text(_legendText);
    };

    /**
     #### .container([selector])
     Set the container selector for the legend widget. Required.
     **/
    _legend.container = function (c) {
        if (!arguments.length) {
            return _container;
        }
        _container = d3.select(c);
        return _legend;
    };

    /**
     #### .horizontal([boolean])
     Display the legend horizontally instead of horizontally
     **/
    _legend.horizontal = function (b) {
        if (!arguments.length) {
            return _horizontal;
        }
        _horizontal = b;
        return _legend;
    };

    /**
     * Set or get the legend text function. The legend widget uses this function to render the legend
     * text for each item. If no function is specified the legend widget will display the names
     * associated with each group.
     * @method legendText
     * @memberof dc.htmlLegend
     * @instance
     * @param  {Function} [legendText]
     * @returns {Function|dc.htmlLegend}
     * @example
     * // default legendText
     * legend.legendText(dc.pluck('name'))
     *
     * // create numbered legend items
     * chart.legend(dc.htmlLegend().legendText(function(d, i) { return i + '. ' + d.name; }))
     *
     * // create legend displaying group counts
     * chart.legend(dc.htmlLegend().legendText(function(d) { return d.name + ': ' d.data; }))
     **/
    _legend.legendText = function (legendText) {
        if (!arguments.length) {
            return _legendText;
        }
        _legendText = legendText;
        return _legend;
    };

    /**
     * Maximum number of legend items to display
     * @method maxItems
     * @memberof dc.htmlLegend
     * @instance
     * @param  {Number} [maxItems]
     * @return {dc.htmlLegend}
     */
    _legend.maxItems = function (maxItems) {
        if (!arguments.length) {
            return _maxItems;
        }
        _maxItems = dc.utils.isNumber(maxItems) ? maxItems : undefined;
        return _legend;
    };

    return _legend;
};

