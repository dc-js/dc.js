dc.bubbleChart = function(selector) {
    var chart = dc.colorChart(dc.coordinateGridChart({}));

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
        }

        return chart;
    };

    chart.redraw = function() {
        redrawBubbles();

        chart.redrawBrush(chart.g());

        return chart;
    };

    function redrawBubbles() {
        var bubbleG = chart.g().selectAll("g.node")
            .data(chart.group().all());

        // enter
        var bubbles = bubbleG.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + (bubbleX(d) - bubbleR(d)) + "," + (bubbleY(d) - bubbleR(d)) + ")";
            })
            .append("circle");

        bubbles.attr("class", function(d, i) {
            return "bubble " + i;
        })
            .attr("fill", function(d, i) {
                return chart.colors()(i);
            })
            .attr("r", 0);
        dc.transition(bubbleG, chart.transitionDuration())
            .attr("r", function(d) {
                return bubbleR(d);
            });

        if (chart.renderLabel()) {
            bubbleG.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", ".3em")
                .text(function(d) {
                    return chart.label()(d);
                });
        }

        // update
        dc.transition(bubbleG, chart.transitionDuration())
            .attr("transform", function(d) {
                return "translate(" + (bubbleX(d) - bubbleR(d)) + "," + (bubbleY(d) - bubbleR(d)) + ")";
            })
            .selectAll("circle.bubble")
            .attr("r", function(d) {
                return bubbleR(d);
            });

        // exit
        dc.transition(bubbleG.exit().selectAll("circle.bubble"), chart.transitionDuration())
            .attr("r", 0)
            .remove();
    }

    function bubbleX(d) {
        return chart.x()(chart.xValue()(d)) + chart.margins().left;
    }

    function bubbleY(d) {
        return chart.margins().top + chart.y()(chart.yValue()(d));
    }

    function bubbleR(d) {
        return chart.r()(chart.rValue()(d));
    }

    chart.redrawBrush = function(g) {
        chart._redrawBrush(g);

        fadeDeselectedBubbles();
    }

    function fadeDeselectedBubbles() {
    }

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
