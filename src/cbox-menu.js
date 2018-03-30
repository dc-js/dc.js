/**
 * The cboxMenu is a simple widget designed to filter a dimension by
 * selecting option(s) from a set of HTML `<input />` elements. The menu can be
 * made into a set of radio buttons (single select) or checkboxes (multiple).
 * @class cboxMenu
 * @memberof dc
 * @mixes dc.baseMixin
 * @example
 * // create a cboxMenu under #cbox-container using the default global chart group
 * var cbox = dc.cboxMenu('#cbox-container')
 *                .dimension(states)
 *                .group(stateGroup);
 * // the option text can be set via the title() function
 * // by default the option text is '`key`: `value`'
 * cbox.title(function (d){
 *     return 'STATE: ' + d.key;
 * })
 * @param {String|node|d3.selection|dc.compositeChart} parent - Any valid
 * [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this widget should be placed in.
 * Interaction with the widget will only trigger events and redraws within its group.
 * @returns {cboxMenu}
 **/
dc.cboxMenu = function (parent, chartGroup) {
    var GROUP_CSS_CLASS = 'dc-cbox-group';
    var ITEM_CSS_CLASS = 'dc-cbox-item';

    var _chart = dc.baseMixin({});

    var _cbox;
    var _promptText = 'Select all';
    var _multiple = false;
    var _inputType = 'radio';
    var _promptValue = null;
    // generate a random number to use as an ID
    var _randVal = Math.floor(Math.random() * (100000)) + 1;
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
        return _chart._doRedraw();
    };
    /*
    // IS THIS NEEDED?
    // Fixing IE 11 crash when redrawing the chart
    // see here for list of IE user Agents :
    // http://www.useragentstring.com/pages/useragentstring.php?name=Internet+Explorer
    var ua = window.navigator.userAgent;
    // test for IE 11 but not a lower version (which contains MSIE in UA)
    if (ua.indexOf('Trident/') > 0 && ua.indexOf('MSIE') === -1) {
        _chart.redraw = _chart.render;
    }
    */
    _chart._doRedraw = function () {
        _chart.select('ul').remove();
        _cbox = _chart.root()
            .append('ul')
            .classed(GROUP_CSS_CLASS, true);
        renderOptions();

        if (_chart.hasFilter() && _multiple) {
            _cbox.selectAll('input')
                .property('checked', function (d) {
                    // adding `false` avoids failing test cases in phantomjs
                    return d && _chart.filters().indexOf(String(_chart.keyAccessor()(d))) >= 0 || false;
                });
        } else if (_chart.hasFilter()) {
            _cbox.selectAll('input')
                .property('checked', function (d) {
                    if (!d) {
                        return false;
                    }
                    return _chart.keyAccessor()(d) === _chart.filter();
                });
        }
        return _chart;
    };

    function renderOptions () {
        var options = _cbox
        .selectAll('li.' + ITEM_CSS_CLASS)
            .data(_chart.data(), function (d) {
            return _chart.keyAccessor()(d);
        });

        options.exit().remove();

        options = options.enter()
                .append('li')
                .classed(ITEM_CSS_CLASS, true)
            .merge(options);

        options
            .append('input')
            .attr('type', _inputType)
            .attr('value', function (d) { return _chart.keyAccessor()(d); })
            .attr('name', 'domain_' + _randVal)
            .attr('id', function (d, i) {
                return 'input_' + _randVal + '_' + i;
            });
        options
            .append('label')
            .attr('for', function (d, i) {
                return 'input_' + _randVal + '_' + i;
            })
            .text(_chart.title());

        // 'all' option
        if (_multiple) {
            _cbox
            .append('li')
            .append('input')
            .attr('type', 'reset')
            .text(_promptText)
            .on('click', onChange);
        } else {
            var li = _cbox.append('li');
            li.append('input')
                .attr('type', _inputType)
                .attr('value', _promptValue)
                .attr('name', 'domain_' + _randVal)
                .attr('id', function (d, i) {
                    return 'input_' + _randVal + '_all';
                })
                .property('checked', true);
            li.append('label')
                .attr('for', function (d, i) {
                    return 'input_' + _randVal + '_all';
                })
                .text(_promptText);
        }

        _cbox
            .selectAll('li.' + ITEM_CSS_CLASS)
            .sort(_order);

        _cbox.on('change', onChange);
        return options;
    }

    function onChange (d, i) {
        var values,
            target = d3.select(d3.event.target),
            options;

        if (!target.datum()) {
            values = _promptValue || null;
        } else {
            options = d3.select(this).selectAll('input')
            .filter(function (o) {
                if (o) {
                    return this.checked;
                }
            });
            values = options.nodes().map(function (option) {
                return option.value;
            });
            // check if only prompt option is selected
            if (!_multiple && values.length === 1) {
                values = values[0];
            }
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

    /**
     * Get or set the function that controls the ordering of option tags in the
     * cbox menu. By default options are ordered by the group key in ascending
     * order.
     * @name order
     * @memberof dc.cboxMenu
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
     * @memberof dc.cboxMenu
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
     * Get or set the function that filters options prior to display. By default options
     * with a value of < 1 are not displayed.
     * @name filterDisplayed
     * @memberof dc.cboxMenu
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
     * Controls the type of input element. Setting it to true converts
     * the HTML `input` tags from radio buttons to checkboxes.
     * @name multiple
     * @memberof dc.cboxMenu
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
        if (_multiple) {
            _inputType = 'checkbox';
        } else {
            _inputType = 'radio';
        }
        return _chart;
    };

    /**
     * Controls the default value to be used for
     * [dimension.filter](https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension_filter)
     * when only the prompt value is selected. If `null` (the default), no filtering will occur when
     * just the prompt is selected.
     * @name promptValue
     * @memberof dc.cboxMenu
     * @instance
     * @param {?*} [promptValue=null]
     **/
    _chart.promptValue = function (promptValue) {
        if (!arguments.length) {
            return _promptValue;
        }
        _promptValue = promptValue;

        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
