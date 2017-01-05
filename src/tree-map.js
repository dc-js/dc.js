/**
 * The tree map is designed to show hierarchy of shared keys within a dataset.
 *
 * The major differences between this chart and the other charts is how the hierarchy is computed.
 * The {@link #dc.baseMixin+keyAccessor} should instead be an array of accessors, one for
 * each level in the hierarchy.  A {@link https://github.com/mbostock/d3/wiki/Arrays#-nest d3.nest} function
 * is used to convert the flat hierarchy provided by Crossfilter, into a tree structure.
 *
 * The score/color at each level is computed from the shared keys of each node's children.  The
 * aggregation method is similar to a Crossfilter groupBy aggregation.
 *
 * Title and label functions are not centric to the data points themselves, but instead the
 * `key` & computed `_value` at each node.
 *
 * @name treeMap
 * @memberof dc
 * @mixes dc.colorMixin
 * @mixes dc.marginMixin
 * @mixes dc.baseMixin
 * @example
 * // create a treeMap chart under '#tree-map' element using the default global chart group
 * var chart1 = dc.treeMap('#tree-map', 'chartGroupA');
 * chart1.keyAccessor([
 *     dc.pluck('name'),
 *     dc.pluck('organization')
 * ]);
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/mbostock/d3/wiki/Selections#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @return {dc.treeMap}
 */
dc.treeMap = function (parent, chartGroup) {
    var _chart = dc.colorMixin(dc.marginMixin(dc.baseMixin({})));

    // Static Variables
    var TREE_MAP_CLASS = 'treemap',
        BREAD_CRUMB_CLASS = 'breadcrumbs',
        DEPTH_CLASS = 'depth';

    // Private Variables
    var _treeMap = d3.layout.treemap()
        .children(function (d, depth) { return depth ? null : d.values; }) // Return d.values from d3.nest
        .sort(function (a, b) { return a._value - b._value; }) // Return computed level value
        .value(dc.pluck('_value'))
        .round(false),
        // X/Y scales - Domain is 0-1, which matches our root node
        _x = d3.scale.linear().domain([0, 1]),
        _y = d3.scale.linear().domain([0, 1]);

    // Options
    var _rootName = 'Data',
        _mode = 'squarify',
        _breadcrumbHeight = 20,
        _breadcrumbColor = 'orange',
        _breadcrumbHoverColor = '#ee9700',
        _treeMargins = {left: 0, right: 0, bottom: 0, top: 2},
        _treeGap = 3,
        _sizeAggregator = {
            reduceAdd: function (p, v) { return p + v; },
            reduceInitial: function () { return 0; }
        },
        _colorAggregator = _sizeAggregator,
        _minimumRectWidthForText = 70;

    // Sensible defaults
    _chart.margins({left: 10, right: 10, bottom: 10, top: 10});
    _chart.title(function (d) {
        return [
            'Key: ' + d.key,
            'Value: ' + d._value
        ].join('\n');
    });
    _chart.colorAccessor(null);

    /**
     * Move a selection to the front of it's parent
     * @private
     * @this {d3.selection}
     * @return {d3.selection}
     */
    function moveToFront () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    }

    /**
     * Based on a X & Y scale, return a function than can compute a rect position
     * from those scales.
     * @private
     * @param {d3.scale.linear} x
     * @param {d3.scale.linear} y
     * @param {Number} gap
     * @return {Function}
     */
    function selectionPosition (x, y, gap) {
        /**
         * @this {d3.selection} the rect element
         */
        gap = gap || 0;
        return function () {
            this.attr('x', function (d) { return x(d.x) + gap / 2; })
                .attr('y', function (d) { return y(d.y) + gap / 2; });
        };
    }

    /**
     * Based on a X & Y scale, return a function than can compute a rect size
     * from those scales.
     * @private
     * @param {d3.scale.linear} x
     * @param {d3.scale.linear} y
     * @param {Number} gap
     * @return {Function}
     */
    function selectionSize (x, y, gap) {
        /**
         * @this {d3.selection} the rect element
         */
        gap = gap || 0;
        return function () {
            this.attr('width', function (d) { return Math.max(0, x(d.x + d.dx) - x(d.x) - gap / 2); })
                .attr('height', function (d) { return Math.max(0, y(d.y + d.dy) - y(d.y) - gap / 2); });
        };
    }

    /**
     * Recursively compute a name from a child node to it's top parent
     * @private
     * @param {{key: String, parent: Object}} node
     * @return {String}
     */
    function name (node) {
        return node.parent ?
        name(node.parent) + '.' + node.key :
            node.key;
    }

    /**
     * Draw a tree node
     * @private
     * @param {{key: String, values: Iterator<*>, x: Number, y: Number, dx: Number, dy: Number, depth: Number}} node
     * @return {d3.selection}
     */
    function drawNode (node) {
        if (!node) {
            return;
        }
        var sPosition = selectionPosition(_x, _y, _treeGap),
            sSize = selectionSize(_x, _y, _treeGap);

        var _g = _chart.svg()
            .select('g.' + TREE_MAP_CLASS);

        // Update breadcrumbs
        var breadcrumb = _g.select('g.' + BREAD_CRUMB_CLASS)
            .datum(node.parent)
            .on('click', _chart.onClick);

        breadcrumb.select('rect')
            .attr('fill', _breadcrumbColor)
            .on('mouseenter', function () {
                d3.select(this).attr('fill', _breadcrumbHoverColor);
            })
            .on('mouseout', function () {
                d3.select(this).attr('fill', _breadcrumbColor);
            });

        breadcrumb.select('text')
            .text(name(node));

        // Update tree
        var tree = _g.select('g.' + DEPTH_CLASS)
            .datum(node);

        // Children nodes (keyed by depth & key)
        var children = tree.selectAll('g')
            .data(node.values, function (d) { return d.depth + d.key; });

        // Entering children nodes
        var childrenEnter = children.enter()
            .append('g');
        childrenEnter.append('rect')
            .attr('class', 'parent')
            .call(sPosition)
            .call(sSize)
            .style('fill-opacity', 0)
            .append('title');
        childrenEnter.append('text')
            .attr('dx', '0.5em')
            .attr('dy', '1.3em')
            .text(dc.pluck('key'))
            .call(sPosition)
            .style('fill-opacity', 0);
        childrenEnter.filter(dc.pluck('key'))
            .classed('children', true)
            .on('click', _chart.onClick)
            .on('mouseenter', function () {
                var selection = d3.select(this);
                selection.selectAll('.child')
                    .data(dc.pluck('values'))
                    .enter()
                    .append('rect')
                    .attr('class', 'child')
                    .call(selectionPosition(_x, _y, 0))
                    .call(selectionSize(_x, _y, 0));
                selection.select('.parent').call(moveToFront);
                selection.select('text').call(moveToFront);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .selectAll('.child')
                    .remove();
            });

        children.select('title').text(_chart.title());

        var childrenExit = children.exit()
            .on('mouseover', null)
            .on('mouseout', null);
        childrenExit.selectAll('.child').remove();

        // Update domain
        _x = _x.domain([node.x, node.x + node.dx]);
        _y = _y.domain([node.y, node.y + node.dy]);
        _chart.colorDomain(d3.extent(node.values, dc.pluck('_color')));
        sPosition = selectionPosition(_x, _y, _treeGap);
        sSize = selectionSize(_x, _y, _treeGap);

        /**
         * Transition a selection set of tree nodes
         * @param {d3.selection} selection
         * @param {Number} rectOpacity
         * @param {Number} textOpacity
         * @return {d3.transition}
         */
        function transitionNodes (selection, rectOpacity, textOpacity) {
            var transition = dc.transition(selection, _chart.transitionDuration());
            transition.select('rect.parent')
                .call(sPosition)
                .call(sSize)
                .attr('fill', function (d) { return _chart.colors()(d._color); })
                .style('fill-opacity', rectOpacity);
            transition.select('text')
                .call(sPosition)
                .style('fill-opacity', function (d) {
                    return (_chart.renderLabel() &&
                    textOpacity &&
                    _minimumRectWidthForText < _x(d.x + d.dx) - _x(d.x)) ?
                        textOpacity :
                        0;
                });
            return transition;
        }
        transitionNodes(children, 0.5, 1);
        transitionNodes(children.exit(), 0, 0).remove();

        return children;
    }

    /**
     * Create a filter from a node
     * @private
     * @param {{key: String, values: Iterator<*>, x: Number, y: Number, dx: Number, dy: Number, depth: Number}} node
     * @return {Array<String>}
     */
    function createFilter (node) {
        return node.parent ?
            createFilter(node.parent).concat([node.key]) :
            [node.key];
    }

    _chart.onClick = function (node) {
        var filter = createFilter(node);
        filter.splice(0, 1);
        dc.events.trigger(function () {
            _chart.replaceFilter(filter.length > 0 ? filter : null);
            _chart.redrawGroup();
        });
    };

    /**
     * Compute the selected node from a new data set
     * @private
     * @param {Function} treeMap
     * @param {Array<Function>} keyAccessors
     * @param {Function} valueAccessor
     * @param {Function} colorAccessor
     * @param {{reduceInitial: Function, reduceAdd: Function}} sizeAggregator
     * @param {{reduceInitial: Function, reduceAdd: Function}} colorAggregator
     * @param {Array<String>} filters
     * @param {Array<Object>} data
     * @param {String} rootName
     * @return {{key: String, values: Iterator<*>, x: Number, y: Number, dx: Number, dy: Number, depth: Number}}
     */
    /* jshint -W072 */
    function computeSelectedNode (treeMap, keyAccessors, valueAccessor, colorAccessor,
                                  sizeAggregator, colorAggregator, filters, data, rootName) {
        /**
         * Accumulate values accordingly
         * @param {{reduceInitial: Function, reduceAdd: Function}} aggregator
         * @param {Function} accessor
         * @param {String} valueField
         */
        function accumulator (aggregator, accessor, valueField) {
            /**
             * Recursively accumulate the from the node tree
             * @param {{key: String, values: Iterator<*>, x: Number, y: Number, dx: Number, dy: Number, depth: Number}} node
             * @return {Function}
             */
            function accumulate (node) {
                return node.values ?
                    node[valueField] = node.values.reduce(function (p, node) {
                        return aggregator.reduceAdd(p, accumulate(node));
                    }, aggregator.reduceInitial()) :
                    accessor(node);
            }
            return accumulate;
        }

        /**
         * Recursively layout the nodes
         * @private
         * @param {{key: String, values: Iterator<*>, x: Number, y: Number, dx: Number, dy: Number, depth: Number}} node
         */
        function layout (node) {
            if (node.values) {
                treeMap.nodes({values: node.values});
                node.values.forEach(function (c) {
                    c.x = node.x + c.x * node.dx;
                    c.y = node.y + c.y * node.dy;
                    c.dx *= node.dx;
                    c.dy *= node.dy;
                    c.parent = node;
                    layout(c);
                });
            }
        }

        /**
         * Recursively find the filtered node
         * @private
         * @param {{key: String, values: Iterator<*>, x: Number, y: Number, dx: Number, dy: Number, depth: Number}} node
         * @param {Number} depth
         * @return {{key: String, values: Iterator<*>, x: Number, y: Number, dx: Number, dy: Number, depth: Number}}
         */
        function findNode (node, depth) {
            if (depth === filters.length) {
                return node;
            }
            var values = node.values,
                i = values.length,
                filter = filters[depth];
            while (i--) {
                if (values[i].key === filter) {
                    return findNode(values[i], depth + 1);
                }
            }
        }

        var nestedData = d3.nest();
        keyAccessors.forEach(nestedData.key);
        var rootNode = {
            key: rootName,
            values: nestedData.entries(data.map(function (d) {
                // Clone the data as we'll modify it and don't want to edit
                // the data in memory.
                return Object.keys(d).reduce(function (acc, key) {
                    acc[key] = d[key];
                    return acc;
                }, {});
            })),
            x: 0,
            y: 0,
            dx: 1,
            dy: 1,
            depth: 0
        };
        accumulator(sizeAggregator, valueAccessor, '_value')(rootNode);
        if (colorAccessor) {
            accumulator(colorAggregator, colorAccessor, '_color')(rootNode);
        }
        layout(rootNode);
        return filters ? findNode(rootNode, 0) : rootNode;
    }
    /* jshint +W072 */

    function drawChart () {
        // Resize the chart accordingly
        var height = _chart.effectiveHeight(),
            width = _chart.effectiveWidth(),
            treeOffset = _breadcrumbHeight + _treeMargins.top;
        _x = _x.range([0, width - (_treeMargins.left + _treeMargins.right)]);
        _y = _y.range([0, height - treeOffset - _treeMargins.bottom]);
        var treemapG = _chart.svg().select('g.' + TREE_MAP_CLASS)
            .attr('transform', 'translate(' + _chart.margins().left + ',' + _chart.margins().top + ')');
        var breadcrumbsG = treemapG.select('g.' + BREAD_CRUMB_CLASS);
        breadcrumbsG.select('rect')
            .attr('width', width)
            .attr('height', _breadcrumbHeight);
        breadcrumbsG.select('text')
            .attr('y', _breadcrumbHeight / 2);
        treemapG.select('g.' + DEPTH_CLASS)
            .attr('transform', 'translate(' + _treeMargins.left + ',' + treeOffset + ')');

        // Update treemap layout
        _treeMap.mode(_mode);

        // Redraw the data and update the selected node
        drawNode(computeSelectedNode(
            _treeMap,
            _chart.keyAccessor(),
            _chart.valueAccessor(),
            _chart.colorAccessor(),
            _chart.sizeAggregator(),
            _chart.colorAggregator(),
            _chart.filter(),
            _chart.data(),
            _rootName));
        return _chart;
    }

    _chart._doRender = function () {
        var treeMapG = _chart.resetSvg()
            .append('g')
            .attr('class', TREE_MAP_CLASS);
        var breadcrumbsG = treeMapG.append('g')
            .attr('class', BREAD_CRUMB_CLASS);
        breadcrumbsG.append('rect');
        breadcrumbsG.append('text')
            .attr('x', 6)
            .attr('dy', '.35em');
        treeMapG.append('g')
            .attr('class', DEPTH_CLASS);
        return _chart._doRedraw();
    };

    _chart._doRedraw = drawChart.bind(this);

    /**
     * Get/set the root name
     * @param {String} [rootName='Data']
     * @return {String}
     * @return {dc.treeMap}
     */
    _chart.rootName = function (rootName) {
        if (!arguments.length) {
            return _rootName;
        }
        _rootName = rootName;
        return _chart;
    };

    /**
     * Get/set the mode of tree map.  Available values are:
     * - 'squarify'
     * - 'slice'
     * - 'dice'
     * - 'slice-dice'
     * @param {String} [mode='squarify']
     * @return {String}
     * @return {dc.treeMap}
     */
    _chart.mode = function (mode) {
        if (!arguments.length) {
            return _mode;
        }
        _mode = mode;
        return _chart;
    };

    /**
     * Get/set the breadcrumb background color
     * @param {String} [breadcrumbColor='orange']
     * @return {String}
     * @return {dc.treeMap}
     */
    _chart.breadcrumbColor = function (breadcrumbColor) {
        if (!arguments.length) {
            return _breadcrumbColor;
        }
        _breadcrumbColor = breadcrumbColor;
        return _chart;
    };

    /**
     * Get/set the breadcrumb background hover color
     * @param {String} [breadcrumbHoverColor='#ee9700']
     * @return {String}
     * @return {dc.treeMap}
     */
    _chart.breadcrumbHoverColor = function (breadcrumbHoverColor) {
        if (!arguments.length) {
            return _breadcrumbHoverColor;
        }
        _breadcrumbHoverColor = breadcrumbHoverColor;
        return _chart;
    };

    /**
     * Get/set the breadcrumb height
     * @param {Number} [breadcrumbHeight=20]
     * @return {Number}
     * @return {dc.treeMap}
     */
    _chart.breadcrumbHeight = function (breadcrumbHeight) {
        if (!arguments.length) {
            return _breadcrumbHeight;
        }
        _breadcrumbHeight = breadcrumbHeight;
        return _chart;
    };

    /**
     * Get/set the gap between each treemap node
     * @param {Number} [treeGap={left: 0, right: 0, bottom: 0, top: 2}]
     * @return {Number}
     * @return {dc.treeMap}
     */
    _chart.treeGap = function (treeGap) {
        if (!arguments.length) {
            return _treeGap;
        }
        _treeGap = treeGap;
        return _chart;
    };

    /**
     * Get/set the margins for the tree
     * @param {Number} [treeMargins={}]
     * @return {Number}
     * @return {dc.treeMap}
     */
    _chart.treeMargins = function (treeMargins) {
        if (!arguments.length) {
            return _treeMargins;
        }
        _treeMargins = treeMargins;
        return _chart;
    };

    /**
     * Get/set the size aggregator function.  This uses a recursive javascript `reduce` call
     * to build from the leaf nodes to the root node, an aggregated value to represent the
     * hierarchy on each node.  To get the leaf values, it uses the
     * {@link #dc.baseMixin+valueAccessor} of the chart.
     * @example
     * // For a summing aggregator (default)
     * _chart.sizeAggregator({
     *     reduceAdd: function (accumulation, childSum) { return accumulator + childValues; },
     *     reduceInitial: function () { return 0; }
     * })
     * @param {{reduceInitialize: Function, reduceAdd: Function}} [sizeAggregator]
     * @return {{reduceInitialize: Function, reduceAdd: Function}}
     * @return {dc.treeMap}
     */
    _chart.sizeAggregator = function (sizeAggregator) {
        if (!arguments.length) {
            return _sizeAggregator;
        }
        _sizeAggregator = sizeAggregator;
        return _chart;
    };

    /**
     * Get/set the color aggregator function.  This uses a recursive javascript `reduce` call
     * to build from the leaf nodes to the root node, an aggregated value to represent the
     * hierarchy on each node.  To get the leaf values, it uses the
     * {@link #dc.baseMixin+valueAccessor} of the chart.
     * @example
     * // For a summing aggregator (default)
     * _chart.colorAggregator({
     *     reduceAdd: function (accumulation, childSum) { return accumulator + childValues; },
     *     reduceInitial: function () { return 0; }
     * })
     * @param {{reduceInitialize: Function, reduceAdd: Function}} [colorAggregator]
     * @return {{reduceInitialize: Function, reduceAdd: Function}}
     * @return {dc.treeMap}
     */
    _chart.colorAggregator = function (colorAggregator) {
        if (!arguments.length) {
            return _colorAggregator;
        }
        _colorAggregator = colorAggregator;
        return _chart;
    };

    /**
     * Get/set the minimum rect size for a text label in pixels
     * @param {Number} [minimumRectWidthForText=70]
     * @return {Number}
     * @return {dc.treeMap}
     */
    _chart.minimumRectWidthForText = function (minimumRectWidthForText) {
        if (!arguments.length) {
            return _minimumRectWidthForText;
        }
        _minimumRectWidthForText = minimumRectWidthForText;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
