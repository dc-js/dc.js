/**
## <a name="pie-chart" href="#pie-chart">#</a> Pie Chart [Concrete] < [Color Chart](#color-chart) < [Base Chart](#base-chart)
This chart is a concrete pie chart implementation usually used to visualize small number of categorical distributions.
Pie chart implementation uses keyAccessor to generate slices, and valueAccessor to calculate the size of each slice(key)
relatively to the total sum of all values.

Examples:

* [Nasdaq 100 Index](http://nickqizhu.github.com/dc.js/)

#### dc.pieChart(parent[, chartGroup])
Create a pie chart instance and attach it to the given parent element.

Parameters:

* parent : string - any valid d3 single selector representing typically a dom block element such
   as a div.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed
   in a certain chart group then any interaction with such instance will only trigger events and redraw within the same
   chart group.

Return:
A newly created pie chart instance

```js
// create a pie chart under #chart-container1 element using the default global chart group
var chart1 = dc.pieChart("#chart-container1");
// create a pie chart under #chart-container2 element using chart group A
var chart2 = dc.pieChart("#chart-container2", "chartGroupA");
```

**/
dc.pieChart = function (parent, chartGroup) {
    var DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

    var _sliceCssClass = "pie-slice";

    var _radius,
        _innerRadius = 0;

    var _g;

    var _minAngleForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;

    var _chart = dc.capped(dc.colorChart(dc.baseChart({})));

    /**
    #### .slicesCap([cap])
    Get or set the maximum number of slices the pie chart will generate. Slices are ordered by its value from high to low.
     Other slices exeeding the cap will be rolled up into one single *Others* slice.

    **/
    _chart.slicesCap = _chart.cap;

    _chart.label(function (d) {
        return _chart.keyAccessor()(d.data);
    });

    _chart.renderLabel(true);

    _chart.title(function (d) {
        return _chart.keyAccessor()(d.data) + ": " + _chart.valueAccessor()(d.data);
    });

    _chart.transitionDuration(350);

    _chart.doRender = function () {
        _chart.resetSvg();

        _g = _chart.svg()
            .append("g")
            .attr("transform", "translate(" + _chart.cx() + "," + _chart.cy() + ")");

        drawChart();

        return _chart;
    };

    function drawChart() {
        if (_chart.dataSet()) {
            var pie = calculateDataPie();

            // set radius on basis of chart dimension if missing
            _radius = _radius ? _radius : d3.min([_chart.width(), _chart.height()]) /2;

            var arc = _chart.buildArcs();

            var pieData = pie(_chart.assembleCappedData());

            if (_g) {
                var slices = _g.selectAll("g." + _sliceCssClass)
                    .data(pieData);

                createElements(slices, arc, pieData);

                updateElements(pieData, arc);

                removeElements(slices);

                highlightFilter();
            }
        }
    }

    function createElements(slices, arc, pieData) {
        var slicesEnter = createSliceNodes(slices);

        createSlicePath(slicesEnter, arc);

        createTitles(slicesEnter);

        createLabels(pieData, arc);
    }

    function createSliceNodes(slices) {
        var slicesEnter = slices
            .enter()
            .append("g")
            .attr("class", function (d, i) {
                return _sliceCssClass + " _" + i;
            });
        return slicesEnter;
    }

    function createSlicePath(slicesEnter, arc) {
        var slicePath = slicesEnter.append("path")
            .attr("fill", function (d, i) {
                return _chart.getColor(d, i);
            })
            .on("click", onClick)
            .attr("d", function (d, i) {
                return safeArc(d, i, arc);
            });
        slicePath.transition()
            .duration(_chart.transitionDuration())
            .attrTween("d", tweenPie);
    }

    function createTitles(slicesEnter) {
        if (_chart.renderTitle()) {
            slicesEnter.append("title").text(function (d) {
                return _chart.title()(d);
            });
        }
    }

    function createLabels(pieData, arc) {
        if (_chart.renderLabel()) {
            var labels = _g.selectAll("text." + _sliceCssClass)
                .data(pieData);

            labels.exit().remove();

            var labelsEnter = labels
                .enter()
                .append("text")
                .attr("class", function (d, i) {
                    return _sliceCssClass + " _" + i;
                })
                .on("click", onClick);
            dc.transition(labelsEnter, _chart.transitionDuration())
                .attr("transform", function (d) {
                    d.innerRadius = _chart.innerRadius();
                    d.outerRadius = _radius;
                    var centroid = arc.centroid(d);
                    if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                        return "translate(0,0)";
                    } else {
                        return "translate(" + centroid + ")";
                    }
                })
                .attr("text-anchor", "middle")
                .text(function (d) {
                    var data = d.data;
                    if (sliceHasNoData(data) || sliceTooSmall(d))
                        return "";
                    return _chart.label()(d);
                });
        }
    }

    function updateElements(pieData, arc) {
        updateSlicePaths(pieData, arc);
        updateLabels(pieData, arc);
        updateTitles(pieData);
    }

    function updateSlicePaths(pieData, arc) {
        var slicePaths = _g.selectAll("g." + _sliceCssClass)
            .data(pieData)
            .select("path")
            .attr("d", function (d, i) {
                return safeArc(d, i, arc);
            });
        dc.transition(slicePaths, _chart.transitionDuration(),
            function (s) {
                s.attrTween("d", tweenPie);
            }).attr("fill", function (d, i) {
                return _chart.getColor(d, i);
            });
    }

    function updateLabels(pieData, arc) {
        if (_chart.renderLabel()) {
            var labels = _g.selectAll("text." + _sliceCssClass)
                .data(pieData);
            dc.transition(labels, _chart.transitionDuration())
                .attr("transform", function (d) {
                    d.innerRadius = _chart.innerRadius();
                    d.outerRadius = _radius;
                    var centroid = arc.centroid(d);
                    if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                        return "translate(0,0)";
                    } else {
                        return "translate(" + centroid + ")";
                    }
                })
                .attr("text-anchor", "middle")
                .text(function (d) {
                    var data = d.data;
                    if (sliceHasNoData(data) || sliceTooSmall(d))
                        return "";
                    return _chart.label()(d);
                });
        }
    }

    function updateTitles(pieData) {
        if (_chart.renderTitle()) {
            _g.selectAll("g." + _sliceCssClass)
                .data(pieData)
                .select("title")
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
            _chart.selectAll("g." + _sliceCssClass).each(function (d) {
                if (_chart.isSelectedSlice(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll("g." + _sliceCssClass).each(function (d) {
                _chart.resetHighlight(this);
            });
        }
    }

    /**
    #### .innerRadius([innerRadius])
    Get or set the inner radius on a particular pie chart instance. If inner radius is greater than 0px then the pie chart
    will be essentially rendered as a doughnut chart. Default inner radius is 0px.

    **/
    _chart.innerRadius = function (r) {
        if (!arguments.length) return _innerRadius;
        _innerRadius = r;
        return _chart;
    };

    /**
    #### .radius([radius])
    Get or set the radius on a particular pie chart instance. Default radius is 90px.

    **/
    _chart.radius = function (r) {
        if (!arguments.length) return _radius;
        _radius = r;
        return _chart;
    };

    /**
    #### .cx()
    Get center x coordinate position. This function is **not chainable**.

    **/
    _chart.cx = function () {
        return _chart.width() / 2;
    };

    /**
    #### .cy()
    Get center y coordinate position. This function is **not chainable**.

    **/
    _chart.cy = function () {
        return _chart.height() / 2;
    };

    _chart.buildArcs = function () {
        return d3.svg.arc().outerRadius(_radius).innerRadius(_innerRadius);
    };

    _chart.isSelectedSlice = function (d) {
        return _chart.hasFilter(_chart.keyAccessor()(d.data));
    };

    _chart.doRedraw = function () {
        drawChart();
        return _chart;
    };

    /**
    #### .minAngelForLabel([minAngle])
    Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not render slice label.
    Default min angel is 0.5.
    **/
    _chart.minAngleForLabel = function (_) {
        if (!arguments.length) return _minAngleForLabel;
        _minAngleForLabel = _;
        return _chart;
    };

    function calculateDataPie() {
        return d3.layout.pie().sort(null).value(function (d) {
            return _chart.valueAccessor()(d);
        });
    }

    function sliceTooSmall(d) {
        var angle = (d.endAngle - d.startAngle);
        return isNaN(angle) || angle < _minAngleForLabel;
    }

    function sliceHasNoData(data) {
        return _chart.valueAccessor()(data) === 0;
    }

    function tweenPie(b) {
        b.innerRadius = _chart.innerRadius();
        var current = this._current;
        if (isOffCanvas(current))
            current = {startAngle: 0, endAngle: 0};
        var i = d3.interpolate(current, b);
        this._current = i(0);
        return function (t) {
            return safeArc(i(t), 0, _chart.buildArcs());
        };
    }

    function isOffCanvas(current) {
        return !current || isNaN(current.startAngle) || isNaN(current.endAngle);
    }

    function onClick(d) {
        _chart.onClick(d.data);
    }

    function safeArc(d, i, arc) {
        var path = arc(d, i);
        if (path.indexOf("NaN") >= 0)
            path = "M0,0";
        return path;
    }

    return _chart.anchor(parent, chartGroup);
};
