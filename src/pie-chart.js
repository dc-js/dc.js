dc.pieChart = function(parent, chartGroup) {
    var DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

    var _sliceCssClass = "pie-slice";

    var _radius = 0, _innerRadius = 0;

    var _g;

    var _arc;
    var _dataPie;
    var _slices;
    var _slicePaths;

    var _labels;
    var _minAngelForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;

    var _chart = dc.singleSelectionChart(dc.colorChart(dc.baseChart({})));

    _chart.label(function(d) {
        return _chart.keyRetriever()(d.data);
    });
    _chart.renderLabel(true);

    _chart.title(function(d) {
        return d.data.key + ": " + d.data.value;
    });

    _chart.transitionDuration(350);

    _chart.doRender = function() {
        _chart.resetSvg();

        if (_chart.dataAreSet()) {
            _g = _chart.svg()
                .append("g")
                .attr("transform", "translate(" + _chart.cx() + "," + _chart.cy() + ")");

            _dataPie = calculateDataPie();

            _arc = _chart.buildArcs();

            _slices = _chart.drawSlices(_g, _dataPie, _arc);

            _chart.drawLabels(_slices, _arc);
            _chart.drawTitles(_slices, _arc);

            _chart.highlightFilter();
        }

        return _chart;
    };

    _chart.innerRadius = function(r) {
        if (!arguments.length) return _innerRadius;
        _innerRadius = r;
        return _chart;
    };

    _chart.radius = function(r) {
        if (!arguments.length) return _radius;
        _radius = r;
        return _chart;
    };

    _chart.cx = function() {
        return _chart.width() / 2;
    };

    _chart.cy = function() {
        return _chart.height() / 2;
    };

    _chart.buildArcs = function() {
        return d3.svg.arc().outerRadius(_radius).innerRadius(_innerRadius);
    };

    _chart.drawSlices = function(topG, dataPie, arcs) {
        _slices = topG.selectAll("g." + _sliceCssClass)
            .data(dataPie(_chart.orderedGroup().top(Infinity)))
            .enter()
            .append("g")
            .attr("class", function(d, i) {
                return _sliceCssClass + " " + i;
            });

        _slicePaths = _slices.append("path")
            .attr("fill", function(d, i) {
                return _chart.colors()(i);
            })
            .attr("d", arcs);

        _slicePaths
            .transition()
            .duration(_chart.transitionDuration())
            .attrTween("d", tweenPie);

        _slicePaths.on("click", onClick);

        return _slices;
    };

    _chart.drawLabels = function(slices, arc) {
        if (_chart.renderLabel()) {
            _labels = slices.append("text");
            redrawLabels(arc);
            _labels.on("click", onClick);
        }
    };

    _chart.drawTitles = function(slices, arc) {
        if (_chart.renderTitle()) {
            slices.append("title").text(function(d) {
                return _chart.title()(d);
            });
        }
    };

    _chart.highlightFilter = function() {
        if (_chart.hasFilter()) {
            _chart.selectAll("g." + _sliceCssClass).select("path").each(function(d) {
                if (_chart.isSelectedSlice(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll("g." + _sliceCssClass).selectAll("path").each(function(d) {
                _chart.resetHighlight(this);
            });
        }
    };

    _chart.isSelectedSlice = function(d) {
        return _chart.filter() == _chart.keyRetriever()(d.data);
    };

    _chart.doRedraw = function() {
        _chart.highlightFilter();

        var data = _dataPie(_chart.orderedGroup().top(Infinity));

        _slicePaths = _slicePaths.data(data);

        _labels = _labels.data(data);

        dc.transition(_slicePaths, _chart.transitionDuration(), function(s) {
            s.attrTween("d", tweenPie);
        });

        redrawLabels(_arc);

        redrawTitles();

        return _chart;
    };

    _chart.minAngelForLabel = function(_){
        if(!arguments.length) return _minAngelForLabel;
        _minAngelForLabel = _;
        return _chart;
    };

    function calculateDataPie() {
        return d3.layout.pie().value(function(d) {
            return _chart.valueRetriever()(d);
        });
    }

    function redrawLabels(arc) {
        dc.transition(_labels, _chart.transitionDuration())
            .attr("transform", function(d) {
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
            .text(function(d) {
                var data = d.data;
                if (sliceHasNoData(data) || sliceTooSmall(d))
                    return "";
                return _chart.label()(d);
            });
    }

    function sliceTooSmall(d) {
        var angle = (d.endAngle - d.startAngle);
        return isNaN(angle) || angle < _minAngelForLabel;
    }

    function sliceHasNoData(data) {
        return _chart.valueRetriever()(data) == 0;
    }

    function redrawTitles() {
        if (_chart.renderTitle()) {
            _slices.selectAll("title").text(function(d) {
                return _chart.title()(d);
            });
        }
    }

    function tweenPie(b) {
        b.innerRadius = _chart.innerRadius();
        var current = this._current;
        if (isOffCanvas(current))
            current = {startAngle: 0, endAngle: 0};
        var i = d3.interpolate(current, b);
        this._current = i(0);
        return function(t) {
            return _arc(i(t));
        };
    }

    function isOffCanvas(current) {
        return current == null || isNaN(current.startAngle) || isNaN(current.endAngle);
    }

    function onClick(d) {
        _chart.filter(_chart.keyRetriever()(d.data));
        dc.redrawAll(_chart.chartGroup());
    }

    return _chart.anchor(parent, chartGroup);
};
