dc.bubbleOverlay = function(root, chartGroup){
    var BUBBLE_OVERLAY_CLASS = "bubble-overlay";
    var BUBBLE_NODE_CLASS = "node";
    var BUBBLE_CLASS = "bubble";

    var _chart = dc.abstractBubbleChart(dc.baseChart({}));
    var _g;
    var _points = [];

    _chart.anchor(root, chartGroup);

    _chart.point = function(name, x, y){
        _points.push({name: name, x: x, y: y});
        return _chart;
    };

    _chart.doRender = function() {
        _g = _chart.svg().append("g").attr("class",BUBBLE_OVERLAY_CLASS);

        _points.forEach(function(point){
            var nodeG = _g.append("g")
                .attr("class",BUBBLE_NODE_CLASS + " " + dc.utils.nameToId(point.name))
                .attr("transform","translate("+point.x+","+point.y+")");
            nodeG.append("circle").attr("class",BUBBLE_CLASS);
        });

        return _chart;
    };

    _chart.doRedraw = function() {
        return _chart;
    };

    return _chart;
};