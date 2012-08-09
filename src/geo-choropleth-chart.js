dc.geoChoroplethChart = function(parent, chartGroup) {
    var _chart = dc.colorChart(dc.baseChart({}));

    var _geoPath = d3.geo.path();

    var _geoJson;

    var _colorAccessor = function(value, maxValue){
        if(isNaN(value)) value = 0;
        var colorsLength = _chart.colors().range().length;
        var denominator = maxValue / colorsLength;
        var colorValue = Math.min(colorsLength - 1, Math.round(value / denominator));
        return _chart.colors()(colorValue);
    };

    _chart.doRender = function() {
        _chart.resetSvg();

        var states = _chart.svg().append("g")
            .attr("class", "layer");

        states.selectAll("path")
            .data(_geoJson.data)
            .enter().append("path")
            .attr("class", _geoJson.name)
            .attr("d", _geoPath);

        plotData();
    };

    function plotData() {
        var maxValue = dc.utils.groupMax(_chart.group(), _chart.valueAccessor());
        var data = {};
        var groupAll = _chart.group().all();
        for (var i = 0; i < groupAll.length; ++i) {
            data[_chart.keyAccessor()(groupAll[i])] = _chart.valueAccessor()(groupAll[i]);
        }

        _chart.svg()
            .selectAll("path.state")
            .attr("class", function(d) {
                return _geoJson.name + " " + _geoJson.keyAccessor(d);
            })
            .attr("fill", function(d) {
                return _colorAccessor(data[_geoJson.keyAccessor(d)], maxValue);
            });
    }

    _chart.doRedraw = function() {
        plotData();
    };

    _chart.overlayGeoJson = function(json, name, keyAccessor) {
        _geoJson = {name: name, data: json, keyAccessor: keyAccessor};
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
