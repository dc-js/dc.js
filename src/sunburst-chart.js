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
        _givenRadius, // given radius, if any
        _innerRadius = 0,
        _ringSizes;

    var _g;
    var _cx;
    var _cy;
    var _minAngleForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;
    var _externalLabelRadius;
    var _chart = dc.capMixin(dc.colorMixin(dc.baseMixin({})));
    _chart.colorAccessor(_chart.cappedKeyAccessor);

    // override cap mixin
    _chart.ordering(dc.pluck('key'));

    // Handle cases if value corresponds to generated parent nodes
    function extendedValueAccessor (d) {
        if (d.path) {
            return d.value;
        }
        return _chart.cappedValueAccessor(d);
    }

    function scaleRadius (ringIndex, y) {
        if (ringIndex === 0) {
            return _innerRadius;
        } else {
            var customRelativeRadius = d3.sum(_chart.ringSizes().relativeRingSizes.slice(0, ringIndex));
            var scaleFactor = (ringIndex * (1 / _chart.ringSizes().relativeRingSizes.length)) / customRelativeRadius;
            var standardRadius = (y - _chart.ringSizes().rootOffset) / (1 - _chart.ringSizes().rootOffset) * (_radius - _innerRadius);
            return _innerRadius + standardRadius / scaleFactor;
        }
    }

    _chart.title(function (d) {
        return _chart.cappedKeyAccessor(d) + ': ' + extendedValueAccessor(d);
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
        // set radius from chart size if none given, or if given radius is too large
        var maxRadius =  d3.min([_chart.width(), _chart.height()]) / 2;
        _radius = _givenRadius && _givenRadius < maxRadius ? _givenRadius : maxRadius;

        var arc = buildArcs();

        var partitionedNodes, cdata;
        // if we have data...
        if (d3.sum(_chart.data(), _chart.valueAccessor())) {
            cdata = dc.utils.toHierarchy(_chart.data(), _chart.valueAccessor());
            partitionedNodes = partitionNodes(cdata);
            // First one is the root, which is not needed
            partitionedNodes.nodes.shift();
            _g.classed(_emptyCssClass, false);
        } else {
            // otherwise we'd be getting NaNs, so override
            // note: abuse others for its ignoring the value accessor
            cdata = dc.utils.toHierarchy([], function (d) {
                return d.value;
            });
            partitionedNodes = partitionNodes(cdata);
            _g.classed(_emptyCssClass, true);
        }
        _chart.ringSizes().rootOffset = partitionedNodes.rootOffset;
        _chart.ringSizes().relativeRingSizes = partitionedNodes.relativeRingSizes;

        if (_g) {
            var slices = _g.selectAll('g.' + _sliceCssClass)
                .data(partitionedNodes.nodes);
            createElements(slices, arc, partitionedNodes.nodes);

            updateElements(partitionedNodes.nodes, arc);

            removeElements(slices);

            highlightFilter();

            dc.transition(_g, _chart.transitionDuration(), _chart.transitionDelay())
                .attr('transform', 'translate(' + _chart.cx() + ',' + _chart.cy() + ')');
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
            .attr('d', function (d) {
                return safeArc(arc, d);
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
                return safeArc(arc, d);
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
            return _givenRadius;
        }
        _givenRadius = radius;
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

    /**
     * Constructs the default RingSizes parameter for {@link dc.sunburstChart#ringSizes ringSizes()},
     * which makes the rings narrower as they get farther away from the center.
     *
     * Can be used as a parameter to ringSizes() to reset the default behavior, or modified for custom ring sizes.
     *
     * @method defaultRingSizes
     * @memberof dc.sunburstChart
     * @instance
     * @example
     *   var chart = new dc.sunburstChart(...);
     *   chart.ringSizes(chart.defaultRingSizes())
     * @returns {RingSizes}
     */
    _chart.defaultRingSizes = function () {
        return {
            partitionDy: function () {
                return _radius * _radius;
            },
            scaleInnerRadius: function (d) {
                return d.data.path && d.data.path.length === 1 ? _innerRadius : Math.sqrt(d.y0);
            },
            scaleOuterRadius: function (d) {
                return Math.sqrt(d.y1);
            },
            relativeRingSizesFunction: function () {return [];}
        };
    };

    /**
     * Constructs a RingSizes parameter for {@link dc.sunburstChart#ringSizes ringSizes()}
     * that will make the chart rings equally wide.
     *
     * @method equalRingSizes
     * @memberof dc.sunburstChart
     * @instance
     * @example
     *   var chart = new dc.sunburstChart(...);
     *   chart.ringSizes(chart.equalRingSizes())
     * @returns {RingSizes}
     */
    _chart.equalRingSizes = function () {
        return _chart.relativeRingSizes(
            function (ringCount) {
                var i;
                var result = [];
                for (i = 0; i < ringCount; i++) {
                    result.push(1 / ringCount);
                }
                return result;
            }
        );
    };

    /**
     * Constructs a RingSizes parameter for {@link dc.sunburstChart#ringSizes ringSizes()} using the given function
     * to determine each rings width.
     *
     * * The function must return an array containing portion values for each ring/level of the chart.
     * * The length of the array must match the number of rings of the chart at runtime, which is provided as the only
     *   argument.
     * * The sum of all portions from the array must be 1 (100%).
     *
     * @example
     * // specific relative portions (the number of rings (3) is known in this case)
     * chart.ringSizes(chart.relativeRingSizes(function (ringCount) {
     *     return [.1, .3, .6];
     * });
     * @method relativeRingSizes
     * @memberof dc.sunburstChart
     * @instance
     * @param {Function} [relativeRingSizesFunction]
     * @returns {RingSizes}
     */
    _chart.relativeRingSizes = function (relativeRingSizesFunction) {
        function assertPortionsArray (relativeSizes, numberOfRings) {
            if (!Array.isArray(relativeSizes)) {
                throw new dc.errors.BadArgumentException('relativeRingSizes function must return an array');
            }

            var portionsSum = d3.sum(relativeSizes);
            if (Math.abs(portionsSum - 1) > dc.constants.NEGLIGIBLE_NUMBER) {
                throw new dc.errors.BadArgumentException(
                    'relativeRingSizes : portions must add up to 1, but sum was ' + portionsSum);
            }

            if (relativeSizes.length !== numberOfRings) {
                throw new dc.errors.BadArgumentException(
                    'relativeRingSizes : number of values must match number of rings (' +
                        numberOfRings + ') but was ' + relativeSizes.length);
            }
        }
        return {
            partitionDy: function () {
                return 1;
            },
            scaleInnerRadius: function (d) {
                return scaleRadius(d.data.path.length - 1, d.y0);
            },
            scaleOuterRadius: function (d) {
                return scaleRadius(d.data.path.length, d.y1);
            },
            relativeRingSizesFunction: function (ringCount) {
                var result = relativeRingSizesFunction(ringCount);
                assertPortionsArray(result, ringCount);
                return result;
            }
        };
    };

    /**
     * Get or set the strategy to use for sizing the charts rings.
     *
     * There are three strategies available
     * * {@link dc.sunburstChart#defaultRingSizes `defaultRingSizes`}: the rings get narrower farther away from the center
     * * {@link dc.sunburstChart#relativeRingSizes `relativeRingSizes`}: set the ring sizes as portions of 1
     * * {@link dc.sunburstChart#equalRingSizes `equalRingSizes`}: the rings are equally wide
     *
     * You can modify the returned strategy, or create your own, for custom ring sizing.
     *
     * RingSizes is a duck-typed interface that must support the following methods:
     * * `partitionDy()`: used for
     *   {@link https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#partition_size `d3.partition.size`}
     * * `scaleInnerRadius(d)`: takes datum and returns radius for
     *    {@link https://github.com/d3/d3-shape/blob/v1.3.7/README.md#arc_innerRadius `d3.arc.innerRadius`}
     * * `scaleOuterRadius(d)`: takes datum and returns radius for
     *    {@link https://github.com/d3/d3-shape/blob/v1.3.7/README.md#arc_outerRadius `d3.arc.outerRadius`}
     * * `relativeRingSizesFunction(ringCount)`: takes ring count and returns an array of portions that
     *   must add up to 1
     *
     * @example
     * // make rings equally wide
     * chart.ringSizes(chart.equalRingSizes())
     * // reset to default behavior
     * chart.ringSizes(chart.defaultRingSizes()))
     * @method ringSizes
     * @memberof dc.sunburstChart
     * @instance
     * @param {RingSizes} ringSizes
     * @returns {Object|dc.sunburstChart}
     */
    _chart.ringSizes = function (ringSizes) {
        if (!arguments.length) {
            if (!_ringSizes) {
                _ringSizes = this.defaultRingSizes();
            }
            return _ringSizes;
        }
        _ringSizes = ringSizes;
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
                return _chart.ringSizes().scaleInnerRadius(d);
            })
            .outerRadius(function (d) {
                return _chart.ringSizes().scaleOuterRadius(d);
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
        var getSortable = function (d) {
            return {'key': d.data.key, 'value': d.value};
        };
        // The changes picked up from https://github.com/d3/d3-hierarchy/issues/50
        var hierarchy = d3.hierarchy(data)
            .sum(function (d) {
                return d.children ? 0 : extendedValueAccessor(d);
            })
            .sort(function (a, b) {
                return d3.ascending(_chart.ordering()(getSortable(a)), _chart.ordering()(getSortable(b)));
            });

        var partition = d3.partition().size([2 * Math.PI, _chart.ringSizes().partitionDy()]);

        partition(hierarchy);

        // In D3v4 the returned data is slightly different, change it enough to suit our purposes.
        var nodes = hierarchy.descendants().map(function (d) {
            d.key = d.data.key;
            d.path = d.data.path;
            return d;
        });

        var relativeSizes = _chart.ringSizes().relativeRingSizesFunction(hierarchy.height);

        return {
            nodes: nodes,
            rootOffset: hierarchy.y1,
            relativeRingSizes: relativeSizes
        };
    }

    function sliceTooSmall (d) {
        var angle = d.x1 - d.x0;
        return isNaN(angle) || angle < _minAngleForLabel;
    }

    function sliceHasNoData (d) {
        return extendedValueAccessor(d) === 0;
    }

    function tweenSlice (d) {
        var current = this._current;
        if (isOffCanvas(current)) {
            current = {x0: 0, x1: 0, y0: 0, y1: 0};
        }
        var tweenTarget = {
            x0: d.x0,
            x1: d.x1,
            y0: d.y0,
            y1: d.y1
        };
        var i = d3.interpolate(current, tweenTarget);
        this._current = i(0);
        return function (t) {
            return safeArc(buildArcs(), Object.assign({}, d, i(t)));
        };
    }

    function isOffCanvas (d) {
        return !d || isNaN(d.x0) || isNaN(d.y0);
    }

    function fill (d, i) {
        return _chart.getColor(d.data, i);
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

    function safeArc (arc, d) {
        var path = arc(d);
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
