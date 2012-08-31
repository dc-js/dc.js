dc.geoChoroplethChart = function(parent, chartGroup) {
    var _chart = dc.singleSelectionChart(dc.colorChart(dc.baseChart({})));

    _chart.colorAccessor(function(d, i){return d;});

    var _geoPath = d3.geo.path();

    var _geoJsons = [];

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
                .attr("fill", "white")
                .attr("d", _geoPath);

            regionG.append("title");

            plotData(layerIndex);
        }
    };

    function plotData(layerIndex) {
        var maxValue = dc.utils.groupMax(_chart.group(), _chart.valueAccessor());
        var data = generateLayeredData();

        if (isDataLayer(layerIndex)) {
            var regionG = renderRegionG(layerIndex);

            renderPaths(regionG, layerIndex, data, maxValue);

            renderTitle(regionG, layerIndex, data);
        }
    }

    function generateLayeredData() {
        var data = {};
        var groupAll = _chart.group().all();
        for (var i = 0; i < groupAll.length; ++i) {
            data[_chart.keyAccessor()(groupAll[i])] = _chart.valueAccessor()(groupAll[i]);
        }
        return data;
    }

    function isDataLayer(layerIndex) {
        return geoJson(layerIndex).keyAccessor;
    }

    function renderRegionG(layerIndex) {
        var regionG = _chart.svg()
            .selectAll(layerSelector(layerIndex))
            .classed("selected", function(d) {
                return isSelected(layerIndex, d);
            })
            .classed("deselected", function(d) {
                return isDeselected(layerIndex, d);
            })
            .attr("class", function(d) {
                var layerNameClass = geoJson(layerIndex).name;
                var regionClass = dc.utils.nameToId(geoJson(layerIndex).keyAccessor(d));
                var baseClasses = layerNameClass + " " + regionClass;
                if(isSelected(layerIndex, d)) baseClasses += " selected";
                if(isDeselected(layerIndex, d)) baseClasses += " deselected";
                return baseClasses;
            });
        return regionG;
    }

    function layerSelector(layerIndex) {
        return "g.layer" + layerIndex + " g." + geoJson(layerIndex).name;
    }

    function isSelected(layerIndex, d) {
        return _chart.hasFilter() && _chart.filter() == getKey(layerIndex, d);
    }

    function isDeselected(layerIndex, d) {
        return _chart.hasFilter() && _chart.filter() != getKey(layerIndex, d);
    }

    function getKey(layerIndex, d) {
        return geoJson(layerIndex).keyAccessor(d);
    }

    function geoJson(index) {
        return _geoJsons[index];
    }

    function renderPaths(regionG, layerIndex, data, maxValue) {
        var paths = regionG
            .select("path")
            .attr("fill", function(d) {
                var currentFill = d3.select(this).attr("fill");
                if (currentFill)
                    return currentFill;
                return "none";
            })
            .on("click", function(d) {
                return onClick(d, layerIndex);
            });

        dc.transition(paths, _chart.transitionDuration()).attr("fill", function(d, i) {
            return _chart.getColor(data[geoJson(layerIndex).keyAccessor(d)], i);
        });
    }

    function onClick(d, layerIndex) {
        var selectedRegion = geoJson(layerIndex).keyAccessor(d);
        if (selectedRegion == _chart.filter()) {
            dc.events.trigger(function() {
                _chart.filter(null);
                dc.redrawAll(_chart.chartGroup());
            });
        } else {
            dc.events.trigger(function() {
                _chart.filter(selectedRegion);
                dc.redrawAll(_chart.chartGroup());
            });
        }
    }

    function renderTitle(regionG, layerIndex, data) {
        if (_chart.renderTitle()) {
            regionG.selectAll("title").text(function(d) {
                var key = getKey(layerIndex, d);
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
