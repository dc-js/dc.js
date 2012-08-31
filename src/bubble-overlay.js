dc.bubbleOverlay = function(root, chartGroup){
    var BUBBLE_OVERLAY_G_CLASS = "bubble-overlay";

    var _chart = dc.baseChart({});

    _chart.anchor(root, chartGroup);

    _chart.point = function(name, x, y){
        var g = _chart.svg().append("g").attr("class",BUBBLE_OVERLAY_G_CLASS);
        g.append("circle").attr("class","bubble");
        return _chart;
    };

    return _chart;
};