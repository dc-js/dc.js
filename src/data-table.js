dc.dataTable = function(selector) {
    var chart = dc.baseChart({});

    var size = 25;
    var columns = [];
    var sortBy = function(d) {
        return d;
    };
    var order = d3.ascending;
    var sort;

    chart.render = function() {
        chart.selectAll("div.row").remove();

        renderRows(renderGroups());

        return chart;
    };

    function renderGroups() {
        var groups = chart.root().selectAll("div.group")
            .data(nestEntries(), function(d) {
                return chart.xValue()(d);
            });

        groups.enter().append("div")
            .attr("class", "group")
            .append("span")
            .attr("class", "label")
            .text(function(d) {
                return chart.xValue()(d);
            });

        groups.exit().remove();

        return groups;
    }

    function nestEntries() {
        if (!sort)
            sort = crossfilter.quicksort.by(sortBy);

        var entries = chart.dimension().top(size);

        return d3.nest()
            .key(chart.group())
            .sortKeys(order)
            .entries(sort(entries, 0, entries.length));
    }

    function renderRows(groups) {
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

        return rows;
    }

    chart.redraw = function() {
        return chart.render();
    };

    chart.size = function(s) {
        if (!arguments.length) return size;
        size = s;
        return chart;
    };

    chart.columns = function(_) {
        if (!arguments.length) return columns;
        columns = _;
        return chart;
    };

    chart.sortBy = function(_) {
        if (!arguments.length) return sortBy;
        sortBy = _;
        return chart;
    };

    chart.order = function(_) {
        if (!arguments.length) return order;
        order = _;
        return chart;
    };

    return chart.anchor(selector);
};
