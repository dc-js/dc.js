function override(chart, functionName, newFunction) {
    var existingFunction = chart.functionName;
    chart.functionName = function() {
        return newFunction(_);
    };
}

dc.compositeChart = function(selector) {
    var chart = dc.coordinateGridChart({});
    var children = [];

    chart.transitionDuration(500);

    override(chart, "render", function(_){return _();});

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
