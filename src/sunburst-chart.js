/**
## Sunburst Chart

Includes: [Cap Mixin](#cap-mixin), [Color Mixin](#color-mixin), [Base Mixin](#base-mixin)

The sunburst chart implementation is usually used to visualize a small tree distribution.  The sunburst
chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
slice relative to the sum of all values. Slices are ordered by `.ordering` which defaults to sorting
by key.

Examples:

* [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)

#### dc.sunburstChart(parent[, chartGroup])
Create a sunburst chart instance and attaches it to the given parent element.

Parameters:

* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.

* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

Returns:
A newly created sunburst chart instance

```js
// create a sunburst chart under #chart-container1 element using the default global chart group
var chart1 = dc.sunburstChart('#chart-container1');
// create a sunburst chart under #chart-container2 element using chart group A
var chart2 = dc.sunburstChart('#chart-container2', 'chartGroupA');
```

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

    /**
    #### .slicesCap([cap])
    Get or set the maximum number of slices the pie chart will generate. The top slices are determined by
    value from high to low. Other slices exeeding the cap will be rolled up into one single *Others* slice.
    The resulting data will still be sorted by .ordering (default by key).
    **/

    _chart.slicesCap = _chart.cap; // this doesn't work yet.

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

    function drawChart() {
        // set radius on basis of chart dimension if missing
        _radius = _radius ? _radius : d3.min([_chart.width(), _chart.height()]) / 2;

        var arc = buildArcs();

        var sunburstData, cdata;
        // if we have data...
        if (d3.sum(_chart.data(), _chart.valueAccessor())) {
            cdata = dc.utils.toHierarchy(_chart.data(), _chart.valueAccessor());
            sunburstData = partitionLayout().nodes(cdata);
            sunburstData.shift();
            _g.classed(_emptyCssClass, false);
        } else {
            // otherwise we'd be getting NaNs, so override
            // note: abuse others for its ignoring the value accessor
	        cdata = dc.utils.toHierarchy([{key:[0], value:1}], function (d) { return d.value; });
	        sunburstData = partitionLayout().nodes(cdata);
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

    function createElements(slices, arc, sunburstData) {
        var slicesEnter = createSliceNodes(slices);

        createSlicePath(slicesEnter, arc);
        createTitles(slicesEnter);
        createLabels(sunburstData, arc);
    }

    function createSliceNodes(slices) {
        var slicesEnter = slices
            .enter()
            .append('g')
            .attr('class', function (d, i) {
                return _sliceCssClass + ' _' + i;
            });
        return slicesEnter;
    }

    function createSlicePath(slicesEnter, arc) {
        var slicePath = slicesEnter.append('path')
            .attr('fill', fill)
            .on('click', onClick)
            .attr('d', function (d, i) {
                return safeArc(d, i, arc);
            });

	    dc.transition(slicePath, _chart.transitionDuration())
		    .attrTween('d', tweenSlice);
    }

    function createTitles(slicesEnter) {
        if (_chart.renderTitle()) {
            slicesEnter.append('title').text(function (d) {
                return _chart.title()(d);
            });
        }
    }

    function positionLabels(labelsEnter, arc) {
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

    function createLabels(sunburstData, arc) {
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

    function updateElements(sunburstData, arc) {
        updateSlicePaths(sunburstData, arc);
        updateLabels(sunburstData, arc);
        updateTitles(sunburstData);
    }

    function updateSlicePaths(sunburstData, arc) {
        var slicePaths = _g.selectAll('g.' + _sliceCssClass)
            .data(sunburstData)
            .select('path')
            .attr('d', function (d, i) {
                return safeArc(d, i, arc);
            });
	    dc.transition(slicePaths, _chart.transitionDuration())
		    .attrTween('d', tweenSlice)
		    .attr('fill', fill);
    }

    function updateLabels(sunburstData, arc) {
        if (_chart.renderLabel()) {
            var labels = _g.selectAll('text.' + _sliceCssClass)
                .data(sunburstData);
            positionLabels(labels, arc);
        }
    }

    function updateTitles(sunburstData) {
        if (_chart.renderTitle()) {
            _g.selectAll('g.' + _sliceCssClass)
                .data(sunburstData)
                .select('title')
                .text(function (d) {
                    return _chart.title()(d);
                });
        }
    }

    function removeElements(slices) {
        slices.exit().remove();
    }

    function highlightFilter() {
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
    #### .innerRadius([innerRadius])
    Get or set the inner radius of the sunburstData chart. If the inner radius is greater than 0px then the
    sunburstData chart will be rendered as a doughnut chart. Default inner radius is 0px.
    **/
    _chart.innerRadius = function (r) {
        if (!arguments.length) {
            return _innerRadius;
        }
        _innerRadius = r;
        return _chart;
    };

    /**
    #### .radius([radius])
    Get or set the outer radius. Default radius is 90px.

    **/
    _chart.radius = function (r) {
        if (!arguments.length) {
            return _radius;
        }
        _radius = r;
        return _chart;
    };

    /**
    #### .cx([cx])
    Get or set center x coordinate position. Default is center of svg.

    **/
    _chart.cx = function (cx) {
        if (!arguments.length) {
            return (_cx ||  _chart.width() / 2);
        }
        _cx = cx;
        return _chart;
    };

    /**
    #### .cy([cy])
    Get or set center y coordinate position. Default is center of svg.

    **/
    _chart.cy = function (cy) {
        if (!arguments.length) {
            return (_cy ||  _chart.height() / 2);
        }
        _cy = cy;
        return _chart;
    };

    function buildArcs() {
        return d3.svg.arc()
          .startAngle(function (d) { return d.x; })
          .endAngle(function (d) { return d.x + d.dx; })
          .innerRadius(function (d) { return d.path && d.path.length === 1 ? _innerRadius : Math.sqrt(d.y); })
          .outerRadius(function (d) { return Math.sqrt(d.y + d.dy); });
    }

    function isSelectedSlice(d) {
        return isPathFiltered(d.path);
    }

    function isPathFiltered(path) {
        for (var i = 0; i < _chart.filters().length; i++) {
            var currentFilter =  _chart.filters()[i];
            if (currentFilter.isFiltered(path)) {
                return true;
            }
        }
        return false;
    }

    // returns all filters that are a parent or child of the path
    function filtersForPath(path) {
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

    /**
    #### .minAngleForLabel([minAngle])
    Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
    display a slice label.  Default min angle is 0.5.
    **/
    _chart.minAngleForLabel = function (_) {
        if (!arguments.length) {
            return _minAngleForLabel;
        }
        _minAngleForLabel = _;
        return _chart;
    };

    function partitionLayout() {
        return d3.layout.partition()
            .size([2 * Math.PI, _radius * _radius])
            .value(_chart.cappedValueAccessor)
            .sort(function (a, b) {
                return d3.ascending(a.path, b.path);
            });
    }

    function sliceTooSmall(d) {
        var angle = (d.dx);
        return isNaN(angle) || angle < _minAngleForLabel;
    }

    function sliceHasNoData(d) {
        return _chart.cappedValueAccessor(d) === 0;
    }

    function tweenSlice(b) {
        b.innerRadius = _innerRadius; //?
        var current = this._current;
        if (isOffCanvas(current)) {
            current = {x:0, y:0, dx:0, dy:0};
        }
        // unfortunally, we can't tween an entire hierarchy since it has 2 way links.
        var tweenTarget = {x:b.x, y:b.y, dx:b.dx, dy:b.dy};
        var i = d3.interpolate(current, tweenTarget);
        this._current = i(0);
        return function (t) {
	        return safeArc(Object.assign({}, b, i(t)), 0, buildArcs());
        };
    }

    function isOffCanvas(current) {
        return !current || isNaN(current.dx) || isNaN(current.dy);
    }

    function fill(d, i) {
        return _chart.getColor(d, i);
    }

    function _onClick(d) {
        var path = d.path;
        var filter = dc.filters.HierarchyFilter(path);

        // filters are equal to, parents or children of the path.
        var filters = filtersForPath(path);
        var exactMatch = false;
        // clear out any filters that cover the path filtered.
        for (var i = filters.length - 1; i >= 0; i--) {
            var currentFilter = filters[i];
            console.log(i, currentFilter);
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

    function onClick(d, i) {
        if (_g.attr('class') !== _emptyCssClass) {
            _onClick(d, i);
        }
    }

    function safeArc(d, i, arc) {
        var path = arc(d, i);
        if (path.indexOf('NaN') >= 0) {
            path = 'M0,0';
        }
        return path;
    }

    /**
     #### .emptyTitle([title])
     Title to use for the only slice when there is no data
     */
    _chart.emptyTitle = function (title) {
        if (arguments.length === 0) {
            return _emptyTitle;
        }
        _emptyTitle = title;
        return _chart;
    };

    /**
     #### .externalLabels([radius])
     Position slice labels offset from the outer edge of the chart

     The given argument sets the radial offset.
     */
    _chart.externalLabels = function (radius) {
        if (arguments.length === 0) {
            return _externalLabelRadius;
        } else if (radius) {
            _externalLabelRadius = radius;
        } else {
            _externalLabelRadius = undefined;
        }

        return _chart;
    };

    function labelPosition(d, arc) {
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
            var legendable = {name: d.key, data: d.value, others: d.others, chart:_chart};
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

    function highlightSliceFromLegendable(legendable, highlighted) {
        _chart.selectAll('g.pie-slice').each(function (d) {
            if (legendable.name === d.key) {
                d3.select(this).classed('highlight', highlighted);
            }
        });
    }

    return _chart.anchor(parent, chartGroup);
};
