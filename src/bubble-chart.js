dc.bubbleChart = function(parent, chartGroup) {
    var NODE_CLASS = "node";
    var BUBBLE_CLASS = "bubble";
    var MIN_RADIUS = 10;

    var _chart = dc.singleSelectionChart(dc.colorChart(dc.coordinateGridChart({})));

    var _maxBubbleRelativeSize = 5;
    var _minRadiusWithLabel = 10;

    var _elasticRadius = false;

    _chart.renderLabel(true);
    _chart.renderTitle(false);

    var _r = d3.scale.linear().domain([0, 100]);

    var _rValueAccessor = function(d) {
        return d.r;
    };

    _chart.transitionDuration(750);

    var bubbleLocator = function(d) {
        return "translate(" + (bubbleX(d)) + "," + (bubbleY(d)) + ")";
    };

    _chart.maxBubbleRelativeSize = function(_){
        if(!arguments.length) return _maxBubbleRelativeSize;
        _maxBubbleRelativeSize = _;
        return _chart;
    };

    _chart.elasticRadius = function(_){
        if(!arguments.length) return _elasticRadius;
        _elasticRadius = _;
        return _chart;
    };

    _chart.plotData = function() {
        if(_elasticRadius)
            _r.domain([_chart.rMin(), _chart.rMax()]);

        _r.range([MIN_RADIUS, _chart.xAxisLength() / _maxBubbleRelativeSize]);

        var bubbleG = _chart.g().selectAll("g." + NODE_CLASS)
            .data(_chart.group().all());

        renderNodes(bubbleG);

        updateNodes(bubbleG);

        removeNodes(bubbleG);

        _chart.fadeDeselectedArea();
    };

    _chart.rMin = function() {
        var min = d3.min(_chart.group().all(), function(e) {
            return _chart.radiusValueAccessor()(e);
        });
        return min;
    };

    _chart.rMax = function() {
        var max = d3.max(_chart.group().all(), function(e) {
            return _chart.radiusValueAccessor()(e);
        });
        return max;
    };

    function renderNodes(bubbleG) {
        var bubbleGEnter = bubbleG.enter().append("g");
        bubbleGEnter
            .attr("class", NODE_CLASS)
            .attr("transform", bubbleLocator)
            .append("circle").attr("class", function(d, i) {
                return BUBBLE_CLASS + " " + i;
            })
            .on("click", onClick)
            .attr("fill", function(d, i) {
                this[dc.constants.NODE_INDEX_NAME] = i;
                return _chart.getColor(d, i);
            })
            .attr("r", 0);
        dc.transition(bubbleG, _chart.transitionDuration())
            .attr("r", function(d) {
                return bubbleR(d);
            });

        renderLabel(bubbleGEnter);

        renderTitles(bubbleGEnter);
    }

    var labelFunction = function(d) {
        return bubbleR(d) > _minRadiusWithLabel? _chart.label()(d) : "";
    };

    function renderLabel(bubbleGEnter) {
        if (_chart.renderLabel()) {

            bubbleGEnter.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", ".3em")
                .on("click", onClick)
                .text(labelFunction);
        }
    }

    function updateLabels(bubbleGEnter) {
        if (_chart.renderLabel()) {
            bubbleGEnter.selectAll("text")
                .text(labelFunction);
        }
    }

    var titleFunction = function(d) {
        return _chart.title()(d);
    };

    function renderTitles(g) {
        if (_chart.renderTitle()) {
            g.append("title").text(titleFunction);
        }
    }

    function updateTitles(g) {
        if (_chart.renderTitle()) {
            g.selectAll("title").text(titleFunction);
        }
    }

    function updateNodes(bubbleG) {
        dc.transition(bubbleG, _chart.transitionDuration())
            .attr("transform", bubbleLocator)
            .selectAll("circle." + BUBBLE_CLASS)
            .attr("fill", function(d, i) {
                // a work around to get correct node index since
                // d3 does not send i correctly here
                return _chart.getColor(d, this[dc.constants.NODE_INDEX_NAME]);
            })
            .attr("r", function(d) {
                return bubbleR(d);
            });
        updateLabels(bubbleG);
        updateTitles(bubbleG);
    }

    function removeNodes(bubbleG) {
        bubbleG.exit().remove();
    }

    function onClick(d) {
        var toFilter = d.key;
        if (toFilter == _chart.filter()) {
            dc.events.trigger(function() {
                _chart.filter(null);
                dc.redrawAll(_chart.chartGroup());
            });
        } else {
            dc.events.trigger(function() {
                _chart.filter(toFilter);
                dc.redrawAll(_chart.chartGroup());
            });
        }
    }

    function bubbleX(d) {
        var x = _chart.x()(_chart.keyAccessor()(d)) + _chart.margins().left;
        if (isNaN(x))
            x = 0;
        return x;
    }

    function bubbleY(d) {
        var y = _chart.margins().top + _chart.y()(_chart.valueAccessor()(d));
        if (isNaN(y))
            y = 0;
        return y;
    }

    function bubbleR(d) {
        var value = _chart.radiusValueAccessor()(d);
        var r = _chart.r()(value);
        if (isNaN(r) || value <= 0)
            r = 0;
        return r;
    }

    _chart.renderBrush = function(g) {
        // override default x axis brush from parent chart
    };

    _chart.redrawBrush = function(g) {
        // override default x axis brush from parent chart
        _chart.fadeDeselectedArea();
    };

    _chart.fadeDeselectedArea = function() {
        if (_chart.hasFilter()) {
            _chart.selectAll("g." + NODE_CLASS).select("circle").each(function(d) {
                if (_chart.isSelectedSlice(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll("g." + NODE_CLASS).selectAll("circle").each(function(d) {
                _chart.resetHighlight(this);
            });
        }
    };

    _chart.isSelectedSlice = function(d) {
        return _chart.filter() == d.key;
    };

    _chart.r = function(_) {
        if (!arguments.length) return _r;
        _r = _;
        return _chart;
    };

    _chart.radiusValueAccessor = function(_) {
        if (!arguments.length) return _rValueAccessor;
        _rValueAccessor = _;
        return _chart;
    };

    _chart.minRadiusWithLabel = function(_){
        if(!arguments.length) return _minRadiusWithLabel;
        _minRadiusWithLabel = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
