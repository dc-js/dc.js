import * as d3 from 'd3';
import colorMixin from './color-mixin';
import baseMixin from './base-mixin';
import {utils} from './utils';
import {transition} from './core';
import trigger from './events';

/**
 * The geo choropleth chart is designed as an easy way to create a crossfilter driven choropleth map
 * from GeoJson data. This chart implementation was inspired by
 * {@link http://bl.ocks.org/4060606 the great d3 choropleth example}.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/vc/index.html US Venture Capital Landscape 2011}
 * @class geoChoroplethChart
 * @memberof dc
 * @mixes dc.colorMixin
 * @mixes dc.baseMixin
 * @example
 * // create a choropleth chart under '#us-chart' element using the default global chart group
 * let chart1 = dc.geoChoroplethChart('#us-chart');
 * // create a choropleth chart under '#us-chart2' element using chart group A
 * let chart2 = dc.compositeChart('#us-chart2', 'chartGroupA');
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.geoChoroplethChart}
 */
export default function geoChoroplethChart (parent, chartGroup) {
    const _chart = colorMixin(baseMixin({}));

    _chart.colorAccessor(d => d || 0);

    const _geoPath = d3.geo.path();
    let _projectionFlag;

    let _geoJsons = [];

    _chart._doRender = function () {
        _chart.resetSvg();
        for (let layerIndex = 0; layerIndex < _geoJsons.length; ++layerIndex) {
            const states = _chart.svg().append('g')
                .attr('class', `layer${layerIndex}`);

            const regionG = states.selectAll(`g.${geoJson(layerIndex).name}`)
                .data(geoJson(layerIndex).data)
                .enter()
                .append('g')
                .attr('class', geoJson(layerIndex).name);

            regionG
                .append('path')
                .attr('fill', 'white')
                .attr('d', _geoPath);

            regionG.append('title');

            plotData(layerIndex);
        }
        _projectionFlag = false;
    };

    function plotData (layerIndex) {
        const data = generateLayeredData();

        if (isDataLayer(layerIndex)) {
            const regionG = renderRegionG(layerIndex);

            renderPaths(regionG, layerIndex, data);

            renderTitle(regionG, layerIndex, data);
        }
    }

    function generateLayeredData () {
        const data = {};
        const groupAll = _chart.data();
        for (let i = 0; i < groupAll.length; ++i) {
            data[_chart.keyAccessor()(groupAll[i])] = _chart.valueAccessor()(groupAll[i]);
        }
        return data;
    }

    function isDataLayer (layerIndex) {
        return geoJson(layerIndex).keyAccessor;
    }

    function renderRegionG (layerIndex) {
        const regionG = _chart.svg()
            .selectAll(layerSelector(layerIndex))
            .classed('selected', d => isSelected(layerIndex, d))
            .classed('deselected', d => isDeselected(layerIndex, d))
            .attr('class', (d) => {
                const layerNameClass = geoJson(layerIndex).name;
                const regionClass = utils.nameToId(geoJson(layerIndex).keyAccessor(d));
                let baseClasses = `${layerNameClass} ${regionClass}`;
                if (isSelected(layerIndex, d)) {
                    baseClasses += ' selected';
                }
                if (isDeselected(layerIndex, d)) {
                    baseClasses += ' deselected';
                }
                return baseClasses;
            });
        return regionG;
    }

    function layerSelector (layerIndex) {
        return `g.layer${layerIndex} g.${geoJson(layerIndex).name}`;
    }

    function isSelected (layerIndex, d) {
        return _chart.hasFilter() && _chart.hasFilter(getKey(layerIndex, d));
    }

    function isDeselected (layerIndex, d) {
        return _chart.hasFilter() && !_chart.hasFilter(getKey(layerIndex, d));
    }

    function getKey (layerIndex, d) {
        return geoJson(layerIndex).keyAccessor(d);
    }

    function geoJson (index) {
        return _geoJsons[index];
    }

    function renderPaths (regionG, layerIndex, data) {
        const paths = regionG
            .select('path')
            .attr('fill', function () {
                return d3.select(this).attr('fill') || 'none';
            })
            .on('click', d => _chart.onClick(d, layerIndex));

        transition(paths, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('fill', (d, i) => _chart.getColor(data[geoJson(layerIndex).keyAccessor(d)], i));
    }

    _chart.onClick = function (d, layerIndex) {
        const selectedRegion = geoJson(layerIndex).keyAccessor(d);
        trigger(() => {
            _chart.filter(selectedRegion);
            _chart.redrawGroup();
        });
    };

    function renderTitle (regionG, layerIndex, data) {
        if (_chart.renderTitle()) {
            regionG.selectAll('title').text((d) => {
                const key = getKey(layerIndex, d);
                const value = data[key];
                return _chart.title()({key, value});
            });
        }
    }

    _chart._doRedraw = function () {
        for (let layerIndex = 0; layerIndex < _geoJsons.length; ++layerIndex) {
            plotData(layerIndex);
            if (_projectionFlag) {
                _chart.svg().selectAll(`g.${geoJson(layerIndex).name} path`).attr('d', _geoPath);
            }
        }
        _projectionFlag = false;
    };

    /**
     * **mandatory**
     *
     * Use this function to insert a new GeoJson map layer. This function can be invoked multiple times
     * if you have multiple GeoJson data layers to render on top of each other. If you overlay multiple
     * layers with the same name the new overlay will override the existing one.
     * @method overlayGeoJson
     * @memberof dc.geoChoroplethChart
     * @instance
     * @see {@link http://geojson.org/ GeoJSON}
     * @see {@link https://github.com/topojson/topojson/wiki TopoJSON}
     * @see {@link https://github.com/topojson/topojson-1.x-api-reference/blob/master/API-Reference.md#wiki-feature topojson.feature}
     * @example
     * // insert a layer for rendering US states
     * chart.overlayGeoJson(statesJson.features, 'state', function(d) {
     *      return d.properties.name;
     * });
     * @param {geoJson} json - a geojson feed
     * @param {String} name - name of the layer
     * @param {Function} keyAccessor - accessor function used to extract 'key' from the GeoJson data. The key extracted by
     * this function should match the keys returned by the crossfilter groups.
     * @returns {dc.geoChoroplethChart}
     */
    _chart.overlayGeoJson = function (json, name, keyAccessor) {
        for (let i = 0; i < _geoJsons.length; ++i) {
            if (_geoJsons[i].name === name) {
                _geoJsons[i].data = json;
                _geoJsons[i].keyAccessor = keyAccessor;
                return _chart;
            }
        }
        _geoJsons.push({name, data: json, keyAccessor});
        return _chart;
    };

    /**
     * Set custom geo projection function. See the available
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Projections.md d3 geo projection functions}.
     * @method projection
     * @memberof dc.geoChoroplethChart
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Projections.md d3.geo.projection}
     * @see {@link https://github.com/d3/d3-geo-projection Extended d3.geo.projection}
     * @param {d3.projection} [projection=d3.geo.albersUsa()]
     * @returns {dc.geoChoroplethChart}
     */
    _chart.projection = function (projection) {
        _geoPath.projection(projection);
        _projectionFlag = true;
        return _chart;
    };

    /**
     * Returns all GeoJson layers currently registered with this chart. The returned array is a
     * reference to this chart's internal data structure, so any modification to this array will also
     * modify this chart's internal registration.
     * @method geoJsons
     * @memberof dc.geoChoroplethChart
     * @instance
     * @returns {Array<{name:String, data: Object, accessor: Function}>}
     */
    _chart.geoJsons = function () {
        return _geoJsons;
    };

    /**
     * Returns the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Paths.md#path d3.geo.path} object used to
     * render the projection and features.  Can be useful for figuring out the bounding box of the
     * feature set and thus a way to calculate scale and translation for the projection.
     * @method geoPath
     * @memberof dc.geoChoroplethChart
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Paths.md#path d3.geo.path}
     * @returns {d3.geo.path}
     */
    _chart.geoPath = function () {
        return _geoPath;
    };

    /**
     * Remove a GeoJson layer from this chart by name
     * @method removeGeoJson
     * @memberof dc.geoChoroplethChart
     * @instance
     * @param {String} name
     * @returns {dc.geoChoroplethChart}
     */
    _chart.removeGeoJson = function (name) {
        const geoJsons = [];

        for (let i = 0; i < _geoJsons.length; ++i) {
            const layer = _geoJsons[i];
            if (layer.name !== name) {
                geoJsons.push(layer);
            }
        }

        _geoJsons = geoJsons;

        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
}
