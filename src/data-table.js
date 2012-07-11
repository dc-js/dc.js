dc.dataTable = function(selector) {
    var chart = dc.baseChart({});

    var size = 25;
    var columns = [];

    chart.render = function() {
        chart.selectAll("div.row").remove();

        var nester = d3.nest()
            .key(chart.group());

        var nestedRecords = nester.entries(chart.dimension().top(size));

        var groups = chart.root().selectAll("div.group")
            .data(nestedRecords, function(d) {
                return d.key;
            });

        groups.enter().append("div")
            .attr("class", "group")
            .append("span")
            .attr("class", "label")
            .text(function(d) {
                return d.key;
            });

        groups.exit().remove();

        var rows = groups.order()
            .selectAll("div.row")
            .data(function(d) {
                return d.values;
            });

        var rowEnter = rows.enter()
            .append("div")
            .attr("class", "row");

        for (var i = 0; i < columns.length; ++i) {
            var f = columns[i];
            rowEnter.append("span")
                .attr("class", "column " + i)
                .text(function(d) {
                    return f(d);
                });
        }

        rows.exit().remove();

        rows.order();

        return chart;
    };

    chart.redraw = function() {
        return chart.render();
    };

    chart.size = function(s) {
        if (!arguments.length) return size;
        size = s;
        return chart;
    }

    chart.columns = function(_) {
        if (!arguments.length) return columns;
        columns = _;
        return chart;
    }

    dc.registerChart(chart);
    return chart.anchor(selector);
};