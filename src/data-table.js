/**
 * The data table is a simple widget designed to list crossfilter focused data set (rows being
 * filtered) in a good old tabular fashion.
 *
 * Note: Unlike other charts, the data table (and data grid chart) use the group attribute as a keying function
 * for {@link https://github.com/mbostock/d3/wiki/Arrays#-nest nesting} the data together in groups.
 * Do not pass in a crossfilter group as this will not work.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * @name dataTable
 * @memberof dc
 * @mixes dc.baseMixin
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/mbostock/d3/wiki/Selections#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @return {dc.dataTable}
 */
dc.dataTable = function (parent, chartGroup) {
    var LABEL_CSS_CLASS = 'dc-table-label';
    var ROW_CSS_CLASS = 'dc-table-row';
    var COLUMN_CSS_CLASS = 'dc-table-column';
    var GROUP_CSS_CLASS = 'dc-table-group';
    var HEAD_CSS_CLASS = 'dc-table-head';

    var _chart = dc.baseMixin({});

    var _size = 25;
    var _columns = [];
    var _sortBy = function (d) {
        return d;
    };
    var _order = d3.ascending;
    var _beginSlice = 0;
    var _endSlice;
    var _showGroups = true;

    _chart._doRender = function () {
        _chart.selectAll('tbody').remove();

        renderRows(renderGroups());

        return _chart;
    };

    _chart._doColumnValueFormat = function (v, d) {
        return ((typeof v === 'function') ?
                v(d) :                          // v as function
                ((typeof v === 'string') ?
                 d[v] :                         // v is field name string
                 v.format(d)                        // v is Object, use fn (element 2)
                )
               );
    };

    _chart._doColumnHeaderFormat = function (d) {
        // if 'function', convert to string representation
        // show a string capitalized
        // if an object then display it's label string as-is.
        return (typeof d === 'function') ?
                _chart._doColumnHeaderFnToString(d) :
                ((typeof d === 'string') ?
                 _chart._doColumnHeaderCapitalize(d) : String(d.label));
    };

    _chart._doColumnHeaderCapitalize = function (s) {
        // capitalize
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    _chart._doColumnHeaderFnToString = function (f) {
        // columnString(f) {
        var s = String(f);
        var i1 = s.indexOf('return ');
        if (i1 >= 0) {
            var i2 = s.lastIndexOf(';');
            if (i2 >= 0) {
                s = s.substring(i1 + 7, i2);
                var i3 = s.indexOf('numberFormat');
                if (i3 >= 0) {
                    s = s.replace('numberFormat', '');
                }
            }
        }
        return s;
    };

    function renderGroups () {
        // The 'original' example uses all 'functions'.
        // If all 'functions' are used, then don't remove/add a header, and leave
        // the html alone. This preserves the functionality of earlier releases.
        // A 2nd option is a string representing a field in the data.
        // A third option is to supply an Object such as an array of 'information', and
        // supply your own _doColumnHeaderFormat and _doColumnValueFormat functions to
        // create what you need.
        var bAllFunctions = true;
        _columns.forEach(function (f) {
            bAllFunctions = bAllFunctions & (typeof f === 'function');
        });

        if (!bAllFunctions) {
            _chart.selectAll('th').remove();
            var headcols = _chart.root().selectAll('th')
                .data(_columns);

            var headGroup = headcols
                .enter()
                .append('th');

            headGroup
                .attr('class', HEAD_CSS_CLASS)
                    .html(function (d) {
                        return (_chart._doColumnHeaderFormat(d));

                    });
        }

        var groups = _chart.root().selectAll('tbody')
            .data(nestEntries(), function (d) {
                return _chart.keyAccessor()(d);
            });

        var rowGroup = groups
            .enter()
            .append('tbody');

        if (_showGroups === true) {
            rowGroup
                .append('tr')
                .attr('class', GROUP_CSS_CLASS)
                    .append('td')
                    .attr('class', LABEL_CSS_CLASS)
                    .attr('colspan', _columns.length)
                    .html(function (d) {
                        return _chart.keyAccessor()(d);
                    });
        }

        groups.exit().remove();

        return rowGroup;
    }

    function nestEntries () {
        var entries;
        if (_order === d3.ascending) {
            entries = _chart.dimension().bottom(_size);
        } else {
            entries = _chart.dimension().top(_size);
        }

        return d3.nest()
            .key(_chart.group())
            .sortKeys(_order)
            .entries(entries.sort(function (a, b) {
                return _order(_sortBy(a), _sortBy(b));
            }).slice(_beginSlice, _endSlice));
    }

    function renderRows (groups) {
        var rows = groups.order()
            .selectAll('tr.' + ROW_CSS_CLASS)
            .data(function (d) {
                return d.values;
            });

        var rowEnter = rows.enter()
            .append('tr')
            .attr('class', ROW_CSS_CLASS);

        _columns.forEach(function (v, i) {
            rowEnter.append('td')
                .attr('class', COLUMN_CSS_CLASS + ' _' + i)
                .html(function (d) {
                    return _chart._doColumnValueFormat(v, d);
                });
        });

        rows.exit().remove();

        return rows;
    }

    _chart._doRedraw = function () {
        return _chart._doRender();
    };

    /**
     * Get or set the table size which determines the number of rows displayed by the widget.
     * @name size
     * @memberof dc.dataTable
     * @instance
     * @param {Number} [size=25]
     * @return {Number}
     * @return {dc.dataTable}
     */
    _chart.size = function (size) {
        if (!arguments.length) {
            return _size;
        }
        _size = size;
        return _chart;
    };

    /**
     * Get or set the index of the beginning slice which determines which entries get displayed
     * by the widget. Useful when implementing pagination.
     *
     * Note: the sortBy function will determine how the rows are ordered for pagination purposes.

     * See the {@link http://dc-js.github.io/dc.js/examples/table-pagination.html table pagination example}
     * to see how to implement the pagination user interface using `beginSlice` and `endSlice`.
     * @name beginSlice
     * @memberof dc.dataTable
     * @instance
     * @param {Number} [beginSlice=0]
     * @return {Number}
     * @return {dc.dataTable}
     */
    _chart.beginSlice = function (beginSlice) {
        if (!arguments.length) {
            return _beginSlice;
        }
        _beginSlice = beginSlice;
        return _chart;
    };

    /**
     * Get or set the index of the end slice which determines which entries get displayed by the
     * widget. Useful when implementing pagination. See {@link #dc.dataTable+beginSlice `beginSlice`} for more information.
     * @name endSlice
     * @memberof dc.dataTable
     * @instance
     * @param {Number|undefined} [endSlice=undefined]
     * @return {Number}
     * @return {dc.dataTable}
     */
    _chart.endSlice = function (endSlice) {
        if (!arguments.length) {
            return _endSlice;
        }
        _endSlice = endSlice;
        return _chart;
    };

    /**
     * Get or set column functions. The data table widget now supports several methods of specifying
     * the columns to display.  The original method, first shown below, uses an array of functions to
     * generate dynamic columns. Column functions are simple javascript functions with only one input
     * argument `d` which represents a row in the data set. The return value of these functions will be
     * used directly to generate table content for each cell. However, this method requires the .html
     * table entry to have a fixed set of column headers.
     *
     * The second example shows you can simply list the data (d) content directly without
     * specifying it as a function, except where necessary (ie, computed columns).  Note
     * the data element accessor name is capitalized when displayed in the table. You can
     * also mix in functions as desired or necessary, but you must use the
     * `Object = [Label, Fn]` method as shown below.
     * You may wish to override the following two functions, which are internally used to
     * translate the column information or function into a displayed header. The first one
     * is used on the simple "string" column specifier, the second is used to transform the
     * String(fn) into something displayable. For the Stock example, the function for Change
     * becomes a header of `d.close - d.open`.
     *
     * `_chart._doColumnHeaderCapitalize` `_chart._doColumnHeaderFnToString`
     * You may use your own Object definition, however you must then override
     * `_chart._doColumnHeaderFormat`, `_chart._doColumnValueFormat`
     * Be aware that fields without numberFormat specification will be displayed just as
     * they are stored in the data, unformatted.
     *
     * The third example, where all fields are specified using the Object = [Label, Fn] method.
     * @name columns
     * @memberof dc.dataTable
     * @instance
     * @example
     * chart.columns([
     *     function(d) { return d.date; },
     *     function(d) { return d.open; },
     *     function(d) { return d.close; },
     *     function(d) { return numberFormat(d.close - d.open); },
     *     function(d) { return d.volume; }
     * ]);
     * @example
     * chart.columns([
     *     "date",    // d["date"], ie, a field accessor; capitalized automatically
     *     "open",    // ...
     *     "close",   // ...
     *     ["Change", // Specify an Object = [Label, Fn]
     *         function (d) { return numberFormat(d.close - d.open); }],
     *     "volume"   // d["volume"], ie, a field accessor; capitalized automatically
     * ]);
     * @example
     * chart.columns([
     *     ["Date",   // Specify an Object = [Label, Fn]
     *         function (d) { return d.date; }],
     *     ["Open",
     *         function (d) { return numberFormat(d.open); }],
     *     ["Close",
     *         function (d) { return numberFormat(d.close); }],
     *     ["Change",
     *         function (d) { return numberFormat(d.close - d.open); }],
     *     ["Volume",
     *         function (d) { return d.volume; }]
     * ]);
     * @param {Array<Function>} [columns=[]]
     * @return {Array<Function>}}
     * @return {dc.dataTable}
     */
    _chart.columns = function (columns) {
        if (!arguments.length) {
            return _columns;
        }
        _columns = columns;
        return _chart;
    };

    /**
     * Get or set sort-by function. This function works as a value accessor at row level and returns a
     * particular field to be sorted by. Default value: identity function
     * @name sortBy
     * @memberof dc.dataTable
     * @instance
     * @example
     * chart.sortBy(function(d) {
     *     return d.date;
     * });
     * @param {Function} [sortBy]
     * @return {Function}
     * @return {dc.dataTable}
     */
    _chart.sortBy = function (sortBy) {
        if (!arguments.length) {
            return _sortBy;
        }
        _sortBy = sortBy;
        return _chart;
    };

    /**
     * Get or set sort order.
     * @name order
     * @memberof dc.dataTable
     * @instance
     * @see {@link https://github.com/mbostock/d3/wiki/Arrays#d3_ascending d3.ascending}
     * @see {@link https://github.com/mbostock/d3/wiki/Arrays#d3_descending d3.descending}
     * @example
     * chart.order(d3.descending);
     * @param {Function} [order=d3.ascending]
     * @return {Function}
     * @return {dc.dataTable}
     */
    _chart.order = function (order) {
        if (!arguments.length) {
            return _order;
        }
        _order = order;
        return _chart;
    };

    /**
     * Get or set if group rows will be shown.
     *
     * The .group() getter-setter must be provided in either case.
     * @name showGroups
     * @memberof dc.dataTable
     * @instance
     * @example
     * chart
     *     .group([value], [name])
     *     .showGroups(true|false);
     * @param {Boolean} [showGroups=true]
     * @return {Boolean}
     * @return {dc.dataTable}
     */
    _chart.showGroups = function (showGroups) {
        if (!arguments.length) {
            return _showGroups;
        }
        _showGroups = showGroups;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
