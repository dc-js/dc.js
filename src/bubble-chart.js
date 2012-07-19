dc.bubbleChart = function(selector) {
    var chart = dc.coordinateGridChart({});

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
        var bubbles = chart.g().selectAll("circle.bubble")
            .data(chart.group().all());

        // enter
        bubbles.enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("cx", function(d) {
                return bubbleX(d);
            })
            .attr("cy", function(d) {
                return bubbleY(d);
            })
            .attr("r", 0);
        dc.transition(bubbles, chart.transitionDuration())
            .attr("r", function(d) {
                return bubbleR(d);
            });

        // update
        dc.transition(bubbles, chart.transitionDuration())
            .attr("cx", function(d) {
                return bubbleX(d);
            })
            .attr("cy", function(d) {
                return bubbleY(d);
            })
            .attr("r", function(d) {
                return bubbleR(d);
            });

        // exit
        dc.transition(bubbles.exit(), chart.transitionDuration())
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
