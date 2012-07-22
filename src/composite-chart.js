dc.compositeChart = function(selector) {
    var chart = dc.coordinateGridChart({});
    var children;

    chart.transitionDuration(500);

    chart.plotData = function(){};

    chart.compose = function(charts){
        children = charts;
        for(var i = 0; i < children.length;++i){
            var child = children[i];
            if(child.dimension()==null) child.dimension(chart.dimension());
            if(child.group()==null) child.group(chart.group());
        }
        return chart;
    };

    dc.registerChart(chart);

    return chart.anchor(selector);
};
