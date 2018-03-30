/**
 * The sunburst chart implementation is usually used to visualize a small tree distribution.  The sunburst
 * chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
 * slice relative to the sum of all values. Slices are ordered by {@link dc.baseMixin#ordering ordering} which defaults to sorting
 * by key.
 *
 * The keys used in the sunburst chart should be arrays, representing paths in the tree.
 *
 * When filtering, the sunburst chart creates instances of {@link dc.filters.HierarchyFilter HierarchyFilter}.
 *
 * @class sunburstChart
 * @memberof dc
 * @mixes dc.capMixin
 * @mixes dc.colorMixin
 * @mixes dc.baseMixin
 * @example
 * // create a sunburst chart under #chart-container1 element using the default global chart group
 * var chart1 = dc.sunburstChart('#chart-container1');
 * // create a sunburst chart under #chart-container2 element using chart group A
 * var chart2 = dc.sunburstChart('#chart-container2', 'chartGroupA');
 *
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.sunburstChart}
 **/
dc.sunburstChart = function (parent, chartGroup) {
    var DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

    var _sliceCssClass = 'pie-slice';
    var _emptyCssClass = 'empty-chart';
    var _emptyTitle = 'empty';

    var _radius,
        _innerRadius = 0;

    var _g;
    var _cx;
    var _cy;
    var _minAngleForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;
    var _externalLabelRadius;
    var _chart = dc.capMixin(dc.colorMixin(dc.baseMixin({})));

    _chart.colorAccessor(_chart.cappedKeyAccessor);

    _chart.title(function (d) {
        return _chart.cappedKeyAccessor(d) + ': ' + _chart.cappedValueAccessor(d);
    });

    _chart.label(_chart.cappedKeyAccessor);
    _chart.renderLabel(true);

    _chart.transitionDuration(350);

    _chart.filterHandler(function (dimension, filters) {
        if (filters.length === 0) {
            dimension.filter(null);
        } else {
            dimension.filterFunction(function (d) {
                for (var i = 0; i < filters.length; i++) {
                    var filter = filters[i];
                    if (filter.isFiltered && filter.isFiltered(d)) {
                        return true;
                    }
                }
                return false;
            });
        }
        return filters;
    });

    _chart._doRender = function () {
        _chart.resetSvg();

        _g = _chart.svg()
            .append('g')
            .attr('transform', 'translate(' + _chart.cx() + ',' + _chart.cy() + ')');

        drawChart();

        return _chart;
    };

    function drawChart () {
        // set radius on basis of chart dimension if missing
        _radius = _radius ? _radius : d3.min([_chart.width(), _chart.height()]) / 2;

        var arc = buildArcs();

        var sunburstData, cdata;
        // if we have data...
        if (d3.sum(_chart.data(), _chart.valueAccessor())) {
            cdata = dc.utils.toHierarchy(_chart.data(), _chart.valueAccessor());
            sunburstData = partitionNodes(cdata);
            // First one is the root, which is not needed
            sunburstData.shift();
            _g.classed(_emptyCssClass, false);
        } else {
            // otherwise we'd be getting NaNs, so override
            // note: abuse others for its ignoring the value accessor
            cdata = dc.utils.toHierarchy([], function (d) {
                return d.value;
            });
            sunburstData = partitionNodes(cdata);
            _g.classed(_emptyCssClass, true);
        }

        if (_g) {
            var slices = _g.selectAll('g.' + _sliceCssClass)
                .data(sunburstData);
            createElements(slices, arc, sunburstData);

            updateElements(sunburstData, arc);

            removeElements(slices);

            highlightFilter();
        }
    }

    function createElements (slices, arc, sunburstData) {
        var slicesEnter = createSliceNodes(slices);

        createSlicePath(slicesEnter, arc);
        createTitles(slicesEnter);
        createLabels(sunburstData, arc);
    }

    function createSliceNodes (slices) {
        var slicesEnter = slices
            .enter()
            .append('g')
            .attr('class', function (d, i) {
                return _sliceCssClass +
                    ' _' + i + ' ' +
                    _sliceCssClass + '-level-' + d.depth;
            });
        return slicesEnter;
    }

    function createSlicePath (slicesEnter, arc) {
        var slicePath = slicesEnter.append('path')
            .attr('fill', fill)
            .on('click', onClick)
            .attr('d', function (d, i) {
                return safeArc(d, i, arc);
            });

        var transition = dc.transition(slicePath, _chart.transitionDuration());
        if (transition.attrTween) {
            transition.attrTween('d', tweenSlice);
        }
    }

    function createTitles (slicesEnter) {
        if (_chart.renderTitle()) {
            slicesEnter.append('title').text(function (d) {
                return _chart.title()(d);
            });
        }
    }

    function positionLabels (labelsEnter, arc) {
        dc.transition(labelsEnter, _chart.transitionDuration())
            .attr('transform', function (d) {
                return labelPosition(d, arc);
            })
            .attr('text-anchor', 'middle')
            .text(function (d) {
                // position label...
                if (sliceHasNoData(d) || sliceTooSmall(d)) {
                    return '';
                }
                return _chart.label()(d);
            });
    }

    function createLabels (sunburstData, arc) {
        if (_chart.renderLabel()) {
            var labels = _g.selectAll('text.' + _sliceCssClass)
                .data(sunburstData);

            labels.exit().remove();

            var labelsEnter = labels
                .enter()
                .append('text')
                .attr('class', function (d, i) {
                    var classes = _sliceCssClass + ' _' + i;
                    if (_externalLabelRadius) {
                        classes += ' external';
                    }
                    return classes;
                })
                .on('click', onClick);
            positionLabels(labelsEnter, arc);
        }
    }

    function updateElements (sunburstData, arc) {
        updateSlicePaths(sunburstData, arc);
        updateLabels(sunburstData, arc);
        updateTitles(sunburstData);
    }

    function updateSlicePaths (sunburstData, arc) {
        var slicePaths = _g.selectAll('g.' + _sliceCssClass)
            .data(sunburstData)
            .select('path')
            .attr('d', function (d, i) {
                return safeArc(d, i, arc);
            });
        var transition = dc.transition(slicePaths, _chart.transitionDuration());
        if (transition.attrTween) {
            transition.attrTween('d', tweenSlice);
        }
        transition.attr('fill', fill);
    }

    function updateLabels (sunburstData, arc) {
        if (_chart.renderLabel()) {
            var labels = _g.selectAll('text.' + _sliceCssClass)
                .data(sunburstData);
            positionLabels(labels, arc);
        }
    }

    function updateTitles (sunburstData) {
        if (_chart.renderTitle()) {
            _g.selectAll('g.' + _sliceCssClass)
                .data(sunburstData)
                .select('title')
                .text(function (d) {
                    return _chart.title()(d);
                });
        }
    }

    function removeElements (slices) {
        slices.exit().remove();
    }

    function highlightFilter () {
        if (_chart.hasFilter()) {
            _chart.selectAll('g.' + _sliceCssClass).each(function (d) {
                if (isSelectedSlice(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll('g.' + _sliceCssClass).each(function (d) {
                _chart.resetHighlight(this);
            });
        }
    }

    /**
     * Get or set the inner radius of the sunburst chart. If the inner radius is greater than 0px then the
     * sunburst chart will be rendered as a doughnut chart. Default inner radius is 0px.
     * @method innerRadius
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [innerRadius=0]
     * @returns {Number|dc.sunburstChart}
     */
    _chart.innerRadius = function (innerRadius) {
        if (!arguments.length) {
            return _innerRadius;
        }
        _innerRadius = innerRadius;
        return _chart;
    };

    /**
     * Get or set the outer radius. If the radius is not set, it will be half of the minimum of the
     * chart width and height.
     * @method radius
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [radius]
     * @returns {Number|dc.sunburstChart}
     */
    _chart.radius = function (radius) {
        if (!arguments.length) {
            return _radius;
        }
        _radius = radius;
        return _chart;
    };

    /**
     * Get or set center x coordinate position. Default is center of svg.
     * @method cx
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [cx]
     * @returns {Number|dc.sunburstChart}
     */
    _chart.cx = function (cx) {
        if (!arguments.length) {
            return (_cx || _chart.width() / 2);
        }
        _cx = cx;
        return _chart;
    };

    /**
     * Get or set center y coordinate position. Default is center of svg.
     * @method cy
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [cy]
     * @returns {Number|dc.sunburstChart}
     */
    _chart.cy = function (cy) {
        if (!arguments.length) {
            return (_cy || _chart.height() / 2);
        }
        _cy = cy;
        return _chart;
    };

    /**
     * Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
     * display a slice label.
     * @method minAngleForLabel
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [minAngleForLabel=0.5]
     * @returns {Number|dc.sunburstChart}
     */
    _chart.minAngleForLabel = function (minAngleForLabel) {
        if (!arguments.length) {
            return _minAngleForLabel;
        }
        _minAngleForLabel = minAngleForLabel;
        return _chart;
    };

    /**
     * Title to use for the only slice when there is no data.
     * @method emptyTitle
     * @memberof dc.sunburstChart
     * @instance
     * @param {String} [title]
     * @returns {String|dc.sunburstChart}
     */
    _chart.emptyTitle = function (title) {
        if (arguments.length === 0) {
            return _emptyTitle;
        }
        _emptyTitle = title;
        return _chart;
    };

    /**
     * Position slice labels offset from the outer edge of the chart.
     *
     * The argument specifies the extra radius to be added for slice labels.
     * @method externalLabels
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [externalLabelRadius]
     * @returns {Number|dc.sunburstChart}
     */
    _chart.externalLabels = function (externalLabelRadius) {
        if (arguments.length === 0) {
            return _externalLabelRadius;
        } else if (externalLabelRadius) {
            _externalLabelRadius = externalLabelRadius;
        } else {
            _externalLabelRadius = undefined;
        }

        return _chart;
    };

    function buildArcs () {
        return d3.arc()
            .startAngle(function (d) {
                return d.x0;
            })
            .endAngle(function (d) {
                return d.x1;
            })
            .innerRadius(function (d) {
                return d.data.path && d.data.path.length === 1 ? _innerRadius : Math.sqrt(d.y0);
            })
            .outerRadius(function (d) {
                return Math.sqrt(d.y1);
            });
    }

    function isSelectedSlice (d) {
        return isPathFiltered(d.path);
    }

    function isPathFiltered (path) {
        for (var i = 0; i < _chart.filters().length; i++) {
            var currentFilter = _chart.filters()[i];
            if (currentFilter.isFiltered(path)) {
                return true;
            }
        }
        return false;
    }

    // returns all filters that are a parent or child of the path
    function filtersForPath (path) {
        var pathFilter = dc.filters.HierarchyFilter(path);
        var filters = [];
        for (var i = 0; i < _chart.filters().length; i++) {
            var currentFilter = _chart.filters()[i];
            if (currentFilter.isFiltered(path) || pathFilter.isFiltered(currentFilter)) {
                filters.push(currentFilter);
            }
        }
        return filters;
    }

    _chart._doRedraw = function () {
        drawChart();
        return _chart;
    };

    function partitionNodes (data) {
        // The changes picked up from https://github.com/d3/d3-hierarchy/issues/50
        var hierarchy = d3.hierarchy(data)
            .sum(function (d) {
                return d.children ? 0 : _chart.cappedValueAccessor(d);
            })
            .sort(function (a, b) {
                return d3.ascending(a.data.path, b.data.path);
            });

        var partition = d3.partition()
            .size([2 * Math.PI, _radius * _radius]);

        partition(hierarchy);

        // In D3v4 the returned data is slightly different, change it enough to suit our purposes.
        var nodes = hierarchy.descendants().map(function (d) {
            d.key = d.data.key;
            d.path = d.data.path;
            return d;
        });

        return nodes;
    }

    function sliceTooSmall (d) {
        var angle = d.x1 - d.x0;
        return isNaN(angle) || angle < _minAngleForLabel;
    }

    function sliceHasNoData (d) {
        return _chart.cappedValueAccessor(d) === 0;
    }

    function tweenSlice (b) {
        b.innerRadius = _innerRadius; //?
        var current = this._current;
        if (isOffCanvas(current)) {
            current = {x: 0, y: 0, dx: 0, dy: 0};
        }
        // unfortunally, we can't tween an entire hierarchy since it has 2 way links.
        var tweenTarget = {x: b.x, y: b.y, dx: b.dx, dy: b.dy};
        var i = d3.interpolate(current, tweenTarget);
        this._current = i(0);
        return function (t) {
            return safeArc(Object.assign({}, b, i(t)), 0, buildArcs());
        };
    }

    function isOffCanvas (current) {
        return !current || isNaN(current.dx) || isNaN(current.dy);
    }

    function fill (d, i) {
        return _chart.getColor(d, i);
    }

    function _onClick (d) {
        // Clicking on Legends do not filter, it throws exception
        // Must be better way to handle this, in legends we need to access `d.key`
        var path = d.path || d.key;
        var filter = dc.filters.HierarchyFilter(path);

        // filters are equal to, parents or children of the path.
        var filters = filtersForPath(path);
        var exactMatch = false;
        // clear out any filters that cover the path filtered.
        for (var i = filters.length - 1; i >= 0; i--) {
            var currentFilter = filters[i];
            if (dc.utils.arraysIdentical(currentFilter, path)) {
                exactMatch = true;
            }
            _chart.filter(filters[i]);
        }
        dc.events.trigger(function () {
            // if it is a new filter - put it in.
            if (!exactMatch) {
                _chart.filter(filter);
            }
            _chart.redrawGroup();
        });
    }

    _chart.onClick = onClick;

    function onClick (d, i) {
        if (_g.attr('class') !== _emptyCssClass) {
            _onClick(d, i);
        }
    }

    function safeArc (d, i, arc) {
        var path = arc(d, i);
        if (path.indexOf('NaN') >= 0) {
            path = 'M0,0';
        }
        return path;
    }

    function labelPosition (d, arc) {
        var centroid;
        if (_externalLabelRadius) {
            centroid = d3.svg.arc()
                .outerRadius(_radius + _externalLabelRadius)
                .innerRadius(_radius + _externalLabelRadius)
                .centroid(d);
        } else {
            centroid = arc.centroid(d);
        }
        if (isNaN(centroid[0]) || isNaN(centroid[1])) {
            return 'translate(0,0)';
        } else {
            return 'translate(' + centroid + ')';
        }
    }

    _chart.legendables = function () {
        return _chart.data().map(function (d, i) {
            var legendable = {name: d.key, data: d.value, others: d.others, chart: _chart};
            legendable.color = _chart.getColor(d, i);
            return legendable;
        });
    };

    _chart.legendHighlight = function (d) {
        highlightSliceFromLegendable(d, true);
    };

    _chart.legendReset = function (d) {
        highlightSliceFromLegendable(d, false);
    };

    _chart.legendToggle = function (d) {
        _chart.onClick({key: d.name, others: d.others});
    };

    function highlightSliceFromLegendable (legendable, highlighted) {
        _chart.selectAll('g.pie-slice').each(function (d) {
            if (legendable.name === d.key) {
                d3.select(this).classed('highlight', highlighted);
            }
        });
    }

    return _chart.anchor(parent, chartGroup);
};
