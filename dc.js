dc = {version: "0.1.0"};
dc.createBarChart = function(selector) {
    return new this.BarChart(selector);
};

dc.BarChart = function(selector){
    var selector = selector;
    var root = d3.select(selector);

    var dimension;
    var group;

    root.append("svg").append("g");

    this.getSelector = function(){ return selector; }

    this.dimension = function(d){ dimension = d; return this; }
    this.group = function(g){ group = d; return this; }
};

