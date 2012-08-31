dc.bubbleOverlay = function(root, chartGroup){
    var _chart = dc.baseChart({});

    _chart.anchor(root, chartGroup);

    return _chart;
};