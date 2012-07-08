dc.dataTable = function(selector) {
    var chart = dc.baseChart({});

    var size = 25;
    var columns = [];

    chart.render = function() {
        return chart;
    };

    chart.redraw = function(){
        return chart.render();
    };

    chart.size = function(s){
        if(!arguments.length) return size;
        size = s;
        return chart;
    }

    chart.columns = function(_){
        if(!arguments.length) return columns;
        columns = _;
        return chart;
    }

    dc.registerChart(chart);
    return chart.anchor(selector);
};