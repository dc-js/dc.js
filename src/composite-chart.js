dc.compositeChart = function(selector) {
    var chart = dc.coordinateGridChart({});
    var children = [];

    chart.transitionDuration(500);

    dc.override(chart, "render", function(_super){return _super();});

    chart.plotData = function(){
         for(var i = 0; i < children.length;++i){
            var child = children[i];
            if(child.dimension()==null) child.dimension(chart.dimension());
            if(child.group()==null) child.group(chart.group());
             child.svg(chart.svg());
             child.height(chart.height());
             child.width(chart.width());
             child.generateG();
             child.x(chart.x());
             child.y(chart.y());
             child.xAxis(chart.xAxis());
             child.yAxis(chart.yAxis());

             child.plotData();
        }
    };

    chart.compose = function(charts){
        children = charts;
        return chart;
    };

    return chart.anchor(selector);
};
