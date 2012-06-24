dc.createBarChart = function(selector) {
    return new this.BarChart(selector);
};

dc.BarChart = function(selector) {
    var selector = selector;
    var root = d3.select(selector);

    var dimension;
    var group;

    var width;
    var height;

    root.append("svg").append("g");

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

    this.width = function(w){
        if(!arguments.length) return width;
        width = w;
        return this;
    }

    this.height = function(h){
        if(!arguments.length) return height;
        height = h;
        return this;
    }

};

