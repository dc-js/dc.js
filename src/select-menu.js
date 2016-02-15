/**
 * The select menu is a simple widget designed to filter a dimension by selecting an option from
 * an HTML `<select/>` menu. The menu can be optionally turned into a multiselect.
 * @class selectMenu
 * @memberof dc
 * @mixes dc.baseMixin
 * @example
 * // create a select menu under #select-container using the default global chart group
 * var select = dc.selectMenu('#select-container')
 *                .dimension(states)
 *                .group(stateGroup);
 * // the option text can be set via the title() function
 * // by default the option text is '`key`: `value`'
 * select.title(function (d){
 *     return 'STATE: ' + d.key;
 * })
 * @param {String|node|d3.selection|dc.compositeChart} parent - Any valid
 * [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this widget should be placed in.
 * Interaction with the widget will only trigger events and redraws within its group.
 * @returns {selectMenu}
 **/
dc.selectMenu = function (parent, chartGroup) {
    var SELECT_CSS_CLASS = 'dc-select-menu';
    var OPTION_CSS_CLASS = 'dc-select-option';

    var _chart = dc.baseMixin({});

    var _select;
    var _promptText = 'Select all';
    var _multiple = false;
    var _size = null;
    var _order = function (a, b) {
        return _chart.keyAccessor()(a) > _chart.keyAccessor()(b) ?
             1 : _chart.keyAccessor()(b) > _chart.keyAccessor()(a) ?
            -1 : 0;
    };

    var _filterDisplayed = function (d) {
        return _chart.valueAccessor()(d) > 0;
    };

    _chart.data(function (group) {
        return group.all().filter(_filterDisplayed);
    });

    _chart._doRender = function () {
        _chart.select('select').remove();
        _select = _chart.root().append('select')
                        .classed(SELECT_CSS_CLASS, true);
        _select.append('option').text(_promptText).attr('value', '');

        _chart._doRedraw();
        return _chart;
    };

    _chart._doRedraw = function () {
        setAttributes();
        renderOptions();
        // select the option(s) corresponding to current filter(s)
        if (_chart.hasFilter() && _multiple) {
            _select.selectAll('option')
                .property('selected', function (d) {
                    return d && _chart.filters().indexOf(String(_chart.keyAccessor()(d))) >= 0;
                });
        } else if (_chart.hasFilter()) {
            _select.property('value', _chart.filter());
        } else {
            _select.property('value', '');
        }
        return _chart;
    };

    function renderOptions () {
        var options = _select.selectAll('option.' + OPTION_CSS_CLASS)
          .data(_chart.data(), function (d) { return _chart.keyAccessor()(d); });

        options.enter()
              .append('option')
              .classed(OPTION_CSS_CLASS, true)
              .attr('value', function (d) { return _chart.keyAccessor()(d); });

        options.text(_chart.title());
        options.exit().remove();
        _select.selectAll('option.' + OPTION_CSS_CLASS).sort(_order);

        _select.on('change', onChange);
        return options;
    }

    function onChange (d, i) {
        var values;
        var target = d3.event.target;
        if (target.selectedOptions) {
            var selectedOptions = Array.prototype.slice.call(target.selectedOptions);
            values = selectedOptions.map(function (d) {
                return d.value;
            });
        } else { // IE and other browsers do not support selectedOptions
            // adapted from this polyfill: https://gist.github.com/brettz9/4212217
            var options = [].slice.call(d3.event.target.options);
            values = options.filter(function (option) {
                return option.selected;
            }).map(function (option) {
                return option.value;
            });
        }
        // console.log(values);
        // check if only prompt option is selected
        if (values.length === 1 && values[0] === '') {
            values = null;
        } else if (!_multiple && values.length === 1) {
            values = values[0];
        }
        _chart.onChange(values);
    }

    _chart.onChange = function (val) {
        if (val && _multiple) {
            _chart.replaceFilter([val]);
        } else if (val) {
            _chart.replaceFilter(val);
        } else {
            _chart.filterAll();
        }
        dc.events.trigger(function () {
            _chart.redrawGroup();
        });
    };

    function setAttributes () {
        if (_multiple) {
            _select.attr('multiple', true);
        } else {
            _select.attr('multiple', null);
        }
        if (_size !== null) {
            _select.attr('size', _size);
        } else {
            _select.attr('size', null);
        }
    }

    /**
     * Get or set the function that controls the ordering of option tags in the
     * select menu. By default options are ordered by the group key in ascending
     * order.
     * @name order
     * @memberof dc.selectMenu
     * @instance
     * @param {Function} [order]
     * @example
     * // order by the group's value
     * chart.order(function (a,b) {
     *     return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
     * });
     **/
    _chart.order = function (order) {
        if (!arguments.length) {
            return _order;
        }
        _order = order;
        return _chart;
    };

    /**
     * Get or set the text displayed in the options used to prompt selection.
     * @name promptText
     * @memberof dc.selectMenu
     * @instance
     * @param {String} [promptText='Select all']
     * @example
     * chart.promptText('All states');
     **/
    _chart.promptText = function (_) {
        if (!arguments.length) {
            return _promptText;
        }
        _promptText = _;
        return _chart;
    };

    /**
     * Get or set the function that filters option tags prior to display. By default options
     * with a value of < 1 are not displayed.
     * @name filterDisplayed
     * @memberof dc.selectMenu
     * @instance
     * @param {function} [filterDisplayed]
     * @example
     * // display all options override the `filterDisplayed` function:
     * chart.filterDisplayed(function () {
     *     return true;
     * });
     **/
    _chart.filterDisplayed = function (filterDisplayed) {
        if (!arguments.length) {
            return _filterDisplayed;
        }
        _filterDisplayed = filterDisplayed;
        return _chart;
    };

    /**
     * Controls the type of select menu. Setting it to true converts the underlying
     * HTML tag into a multiple select.
     * @name multiple
     * @memberof dc.selectMenu
     * @instance
     * @param {boolean} [multiple=false]
     * @example
     * chart.multiple(true);
     **/
    _chart.multiple = function (multiple) {
        if (!arguments.length) {
            return _multiple;
        }
        _multiple = multiple;

        return _chart;
    };

    /**
     * Controls the height, in lines, of the select menu, when `.multiple()` is true. If `null` (the default),
     * uses the browser's default height.
     * @name size
     * @memberof dc.selectMenu
     * @instance
     * @param {?number} [size
     * @example
     * chart.size(10);
     **/
    _chart.size = function (size) {
        if (!arguments.length) {
            return _size;
        }
        _size = size;

        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
