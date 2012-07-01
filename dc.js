dc = {version: "0.1.0"};
dc.createPieChart = function(selector) {
    return new this.PieChart(selector);
};

dc.PieChart = function(selector) {
    var NO_FILTER = null;
    var sliceCssClass = "pie-slice";

    var selector = selector;
    var root = d3.select(selector);

    var colors = d3.scale.category20c();

    var dimension;
    var group;

    var width;
    var height;
    var radius;

    var filter = NO_FILTER;

    this.render = function() {
        doRender();
    }

    this.select = function(s) {
        return root.select(s);
    }

    this.selectAll = function(s) {
        return root.selectAll(s);
    }

    this.colors = function(c) {
        if (!arguments.length) return colors;
        colors = c;
        return this;
    }

    this.dimension = function(d) {
        if (!arguments.length) return dimension;
        dimension = d;
        return this;
    }

    this.group = function(g) {
        if (!arguments.length) return group;
        group = g;
        return this;
    }

    this.filter = function(f) {
        dimension.filter(f);
        return this;
    }

    this.width = function(w) {
        if (!arguments.length) return width;
        width = w;
        return this;
    }

    this.height = function(h) {
        if (!arguments.length) return height;
        height = h;
        return this;
    }

    this.radius = function(r) {
        if (!arguments.length) return radius;
        radius = r;
        return this;
    }

    this.filter = function(i) {
        if (!arguments.length) return filter;
        doFilter(i);
        return this;
    }

    this.hasFilter = function() {
        return filter != NO_FILTER;
    }

    function doRender() {
        root.select("svg").remove();

        var topG = generateTopLevelG();

        var dataPie = d3.layout.pie().value(function(d) {
            return d.value;
        });

        var circle = d3.svg.arc().outerRadius(radius);

        var slices = drawSlices(topG, dataPie, circle);

        drawLabels(slices, circle);
    }

    function generateTopLevelG() {
        var topG = root.append("svg")
            .data([group.all()])
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + cx() + "," + cy() + ")");
        return topG;
    }

    function cx() {
        return width / 2;
    }

    function cy() {
        return height / 2;
    }

    function drawSlices(topG, dataPie, circle) {
        var slices = topG.selectAll("g." + sliceCssClass)
            .data(dataPie)
            .enter()
            .append("g")
            .attr("class", sliceCssClass);

        slices.append("path")
            .attr("fill", function(d, i) {
                return colors(i);
            })
            .attr("d", circle)
            .on("click", function(d, i) {
                doFilter(d.data.key);
            });
        return slices;
    }

    function drawLabels(slices, circle) {
        slices.append("text")
            .attr("transform", function(d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                var centroid = circle.centroid(d);
                if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                    return "translate(0,0)";
                } else {
                    return "translate(" + centroid + ")";
                }
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                var data = d.data;

                if (data.value == 0)
                    return "";

                return data.key;
            });
    }

    function doFilter(d) {
        filter = d;

        root.selectAll("g." + sliceCssClass).select("path").each(function(d, i) {
            if (isSelectedSlice(d)) {
                d3.select(this).attr("fill-opacity", 1)
                    .attr('stroke', "#ccc")
                    .attr('stroke-width', 3);
            } else {
                d3.select(this).attr("fill-opacity", 0.1)
                    .attr('stroke-width', 0);
            }
        });

        dimension.filter(filter);
    }

    function isSelectedSlice(d) {
        return filter == d.data.key;
    }

};

