dc.geoChoroplethChart = function(parent, chartGroup) {
    var _chart = dc.colorChart(dc.baseChart({}));

    var _geoPath = d3.geo.path();

    var _geoJsons = [];

    var _colorAccessor = function(value, maxValue) {
        if (isNaN(value)) value = 0;
        var colorsLength = _chart.colors().range().length;
        var denominator = maxValue / colorsLength;
        var colorValue = Math.min(colorsLength - 1, Math.round(value / denominator));
        return _chart.colors()(colorValue);
    };

    function geoJson(index) {
        return _geoJsons[index];
    }

    _chart.doRender = function() {
        _chart.resetSvg();

        for (var layerIndex = 0; layerIndex < _geoJsons.length; ++layerIndex) {
            var states = _chart.svg().append("g")
                .attr("class", "layer" + layerIndex);

            var regionG = states.selectAll("g." + geoJson(layerIndex).name)
                .data(geoJson(layerIndex).data)
                .enter()
                .append("g")
                .attr("class", geoJson(layerIndex).name);

            regionG
                .append("path")
                .attr("d", _geoPath);

            regionG.append("title");

            plotData(layerIndex);
        }
    };

    function plotData(layerIndex) {
        var maxValue = dc.utils.groupMax(_chart.group(), _chart.valueAccessor());
        var data = {};
        var groupAll = _chart.group().all();
        for (var i = 0; i < groupAll.length; ++i) {
            data[_chart.keyAccessor()(groupAll[i])] = _chart.valueAccessor()(groupAll[i]);
        }

        var regionG = _chart.svg()
            .selectAll("g.layer" + layerIndex + " g." + geoJson(layerIndex).name)
            .attr("class", function(d) {
                return geoJson(layerIndex).name + " " + geoJson(layerIndex).keyAccessor(d);
            });

        var paths = regionG
            .select("path")
            .attr("fill", function(d) {
                var currentFill = d3.select(this).attr("fill");
                if (currentFill)
                    return currentFill;
                return "white";
            });

        dc.transition(paths, _chart.transitionDuration()).attr("fill", function(d) {
            return _colorAccessor(data[geoJson(layerIndex).keyAccessor(d)], maxValue);
        });

        if (_chart.renderTitle()) {
            regionG.selectAll("title").text(function(d) {
                var key = geoJson(layerIndex).keyAccessor(d);
                var value = data[key];
                return _chart.title()({key: key, value: value});
            });
        }
    }

    _chart.doRedraw = function() {
        for (var layerIndex = 0; layerIndex < _geoJsons.length; ++layerIndex) {
            plotData(layerIndex);
        }
    };

    _chart.overlayGeoJson = function(json, name, keyAccessor) {
        _geoJsons.push({name: name, data: json, keyAccessor: keyAccessor});
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
