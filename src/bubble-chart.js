dc.bubbleChart = function(parent, chartGroup) {
    var NODE_CLASS = "node";
    var BUBBLE_CLASS = "bubble";
    var MIN_RADIUS = 10;

    var _chart = dc.singleSelectionChart(dc.colorChart(dc.coordinateGridChart({})));

    _chart.renderLabel(true);
    _chart.renderTitle(false);

    var _r = d3.scale.linear().domain([0, 100]);
    var _rValueRetriever = function(d) {
        return d.r;
    };

    _chart.transitionDuration(750);

    var bubbleLocator = function(d) {
        return "translate(" + (bubbleX(d)) + "," + (bubbleY(d)) + ")";
    };

    _chart.plotData = function() {
         _r.range([0, _chart.xAxisLength() / 3]);

        var bubbleG = _chart.g().selectAll("g." + NODE_CLASS)
            .data(_chart.group().all());

        renderNodes(bubbleG);

        updateNodes(bubbleG);

        removeNodes(bubbleG);

        _chart.fadeDeselectedArea();
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
                return _chart.colors()(i);
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
        return bubbleR(d) > MIN_RADIUS ? _chart.label()(d) : "";
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
            .attr("r", function(d) {
                return bubbleR(d);
            });
        updateLabels(bubbleG);
        updateTitles(bubbleG);
    }

    function removeNodes(bubbleG) {
        dc.transition(bubbleG.exit().selectAll("circle." + BUBBLE_CLASS), _chart.transitionDuration())
            .attr("r", 0)
            .remove();
    }

    var onClick = function(d) {
        _chart.filter(d.key);
        dc.redrawAll(_chart.chartGroup());
    };

    function bubbleX(d) {
        return _chart.x()(_chart.keyRetriever()(d)) + _chart.margins().left;
    }

    function bubbleY(d) {
        return _chart.margins().top + _chart.y()(_chart.valueRetriever()(d));
    }

    function bubbleR(d) {
        return _chart.r()(_chart.radiusValueRetriever()(d));
    }

    _chart.renderBrush = function(g) {
        // override default x axis brush from parent chart
    };

    _chart.redrawBrush = function(g) {
        // override default x axis brush from parent chart
        _chart.fadeDeselectedArea();
    };

    _chart.fadeDeselectedArea = function() {
        var normalOpacity = 1;
        var fadeOpacity = 0.1;
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

    _chart.radiusValueRetriever = function(_) {
        if (!arguments.length) return _rValueRetriever;
        _rValueRetriever = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
