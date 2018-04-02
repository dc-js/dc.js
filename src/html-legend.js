/**
 * htmlLegend is a attachable widget that can be added to other dc charts to render horizontal/vertical legend
 * labels.
 *
 * @class htmlLegend
 * @memberof dc
 * @example
 * chart.legend(dc.htmlLegend().container(legendContainerElement).horizontal(false))
 * @returns {dc.htmlLegend}
 */
dc.htmlLegend = function () {
    var _legend = {},
        _htmlLegendDivCssClass = 'dc-html-legend',
        _legendItemCssClassHorizontal = 'dc-legend-item-horizontal',
        _legendItemCssClassVertical = 'dc-legend-item-vertical',
        _parent,
        _container,
        _legendText = dc.pluck('name'),
        _maxItems,
        _horizontal = false,
        _legendItemClass,
        _highlightSelected = false;

    _legend.parent = function (p) {
        if (!arguments.length) {
            return _parent;
        }
        _parent = p;
        return _legend;
    };

    _legend.render = function () {
        var _defaultLegendItemCssClass = _horizontal ?  _legendItemCssClassHorizontal : _legendItemCssClassVertical;
        _container.select('div.dc-html-legend').remove();

        var _l = _container.append('div').attr('class', _htmlLegendDivCssClass);
        _l.attr('style', 'max-width:' + _container.nodes()[0].style.width);

        var legendables = _parent.legendables();
        var filters = _parent.filters();

        if (_maxItems !== undefined) {
            legendables = legendables.slice(0, _maxItems);
        }

        var legendItemClassName = _legendItemClass ? _legendItemClass : _defaultLegendItemCssClass;

        var itemEnter = _l.selectAll('div.' + legendItemClassName)
            .data(legendables).enter()
            .append('div')
            .classed(legendItemClassName, true)
            .on('mouseover', _parent.legendHighlight)
            .on('mouseout', _parent.legendReset)
            .on('click', _parent.legendToggle);

        if (_highlightSelected) {
            itemEnter.classed(dc.constants.SELECTED_CLASS, function (d) {
                return filters.indexOf(d.name) !== -1;
            });
        }

        itemEnter.append('span')
            .attr('class', 'dc-legend-item-color')
            .style('background-color', dc.pluck('color'));

        itemEnter.append('span')
            .attr('class', 'dc-legend-item-label')
            .attr('title', _legendText)
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
     #### .legendItemClass([selector])
     This can be optionally used to override class for legenditem and just use this class style.
     The reason to have this is so this can be done for a particular chart rather than overriding the style for all charts
     Setting this will disable the highlighting of selected items also.
     **/
    _legend.legendItemClass = function (c) {
        if (!arguments.length) {
            return _legendItemClass;
        }
        _legendItemClass = c;
        return _legend;
    };

    /**
     #### .highlightSelected([boolean])
     This can be optionally used to enable highlighting legends for the selections/filters for the chart.
     **/
    _legend.highlightSelected = function (c) {
        if (!arguments.length) {
            return _highlightSelected;
        }
        _highlightSelected = c;
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

