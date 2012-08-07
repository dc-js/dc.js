dc.containerChart = function(parent, chartGroup) {
    var _chart = dc.baseChart({});

    _chart.doRender = function() {
        _chart.resetSvg();
    };

    _chart.doRedraw = function(){};

    return _chart.anchor(parent, chartGroup);
};
