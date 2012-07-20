dc.bubbleChart = function(selector) {
    var NODE_CLASS = "node";
    var BUBBLE_CLASS = "bubble";

    var chart = dc.singleSelectionChart(dc.colorChart(dc.coordinateGridChart({})));

    var _r = d3.scale.linear().domain([0, 100]);
    var _rValue = function(d) {
        return d.r;
    };

    chart.transitionDuration(750);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            chart.generateG();

            chart.renderXAxis(chart.g());
            chart.renderYAxis(chart.g());

            _r.range([0, chart.xAxisLength() / 3]);

            redrawBubbles();

            chart.renderBrush(chart.g());

            fadeDeselectedBubbles();
        }

        return chart;
    };

    chart.redraw = function() {
        redrawBubbles();

        chart.redrawBrush(chart.g());

        return chart;
    };

    var bubbleLocator = function(d) {
        return "translate(" + (bubbleX(d)) + "," + (bubbleY(d)) + ")";
    };

    function redrawBubbles() {
        var bubbleG = chart.g().selectAll("g." + NODE_CLASS)
            .data(chart.group().all());

        renderNodes(bubbleG);

        updateNodes(bubbleG);

        removeNodes(bubbleG);
    }

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
                return chart.colors()(i);
            })
            .attr("r", 0);
        dc.transition(bubbleG, chart.transitionDuration())
            .attr("r", function(d) {
                return bubbleR(d);
            });

        renderLabel(bubbleGEnter);

        renderTitles(bubbleGEnter);
    }

    function renderLabel(bubbleGEnter) {
        if (chart.renderLabel()) {
            bubbleGEnter.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", ".3em")
                .on("click", onClick)
                .text(function(d) {
                    return bubbleR(d) > 0 ? chart.label()(d) : "";
                });
        }
    }

    function renderTitles(bubbleGEnter) {
        if (chart.renderTitle()) {
            bubbleGEnter.append("title").text(function(d) {
                return chart.title()(d);
            });
        }
    }

    function updateNodes(bubbleG) {
        dc.transition(bubbleG, chart.transitionDuration())
            .attr("transform", bubbleLocator)
            .selectAll("circle." + BUBBLE_CLASS)
            .attr("r", function(d) {
                return bubbleR(d);
            });
        updateText(bubbleG);
    }

    function updateText(bubbleG) {
        bubbleG.selectAll("text")
            .text(function(d) {
                return bubbleR(d) > 0 ? chart.label()(d) : "";
            });
    }

    function removeNodes(bubbleG) {
        dc.transition(bubbleG.exit().selectAll("circle." + BUBBLE_CLASS), chart.transitionDuration())
            .attr("r", 0)
            .remove();
    }

    var onClick = function(d) {
        chart.filter(d.key);
        dc.redrawAll();
    };

    function bubbleX(d) {
        return chart.x()(chart.xValue()(d)) + chart.margins().left;
    }

    function bubbleY(d) {
        return chart.margins().top + chart.y()(chart.yValue()(d));
    }

    function bubbleR(d) {
        return chart.r()(chart.rValue()(d));
    }

    chart.renderBrush = function(g) {
        // override default x axis brush from parent chart
    };

    chart.redrawBrush = function(g) {
        fadeDeselectedBubbles();
    };

    function fadeDeselectedBubbles() {
        var normalOpacity = 1;
        var fadeOpacity = 0.1;
        if (chart.hasFilter()) {
            chart.selectAll("g." + NODE_CLASS).select("circle").each(function(d) {
                if (chart.isSelectedSlice(d)) {
                    d3.select(this).classed("deselected", false);
                } else {
                    d3.select(this).classed("deselected", true);
                }
            });
        } else {
            chart.selectAll("g." + NODE_CLASS).selectAll("circle").each(function(d) {
                d3.select(this).classed("deselected", false);
            });
        }
    }

    chart.isSelectedSlice = function(d) {
        return chart.filter() == d.key;
    };

    chart.r = function(_) {
        if (!arguments.length) return _r;
        _r = _;
        return chart;
    };

    chart.rValue = function(_) {
        if (!arguments.length) return _rValue;
        _rValue = _;
        return chart;
    };

    dc.registerChart(chart);

    return chart.anchor(selector);
};
