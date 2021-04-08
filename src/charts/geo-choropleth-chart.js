import {geoPath, geoAlbersUsa} from 'd3-geo';
import {select} from 'd3-selection';

import {BaseMixin} from '../base/base-mixin';
import {ColorMixin} from '../base/color-mixin';
import {transition} from '../core/core';
import {logger} from '../core/logger';
import {events} from '../core/events';
import {utils} from '../core/utils';
import {d3compat} from '../core/config';

/**
 * The geo choropleth chart is designed as an easy way to create a crossfilter driven choropleth map
 * from GeoJson data. This chart implementation was inspired by
 * {@link http://bl.ocks.org/4060606 the great d3 choropleth example}.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/vc/index.html US Venture Capital Landscape 2011}
 * @mixes ColorMixin
 * @mixes BaseMixin
 */
export class GeoChoroplethChart extends ColorMixin(BaseMixin) {
    /**
     * Create a Geo Choropleth Chart.
     * @example
     * // create a choropleth chart under '#us-chart' element using the default global chart group
     * var chart1 = new GeoChoroplethChart('#us-chart');
     * // create a choropleth chart under '#us-chart2' element using chart group A
     * var chart2 = new CompositeChart('#us-chart2', 'chartGroupA');
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this.colorAccessor(d => d || 0);

        this._geoPath = geoPath();
        this._projectionFlag = undefined;
        this._projection = undefined;

        this._geoJsons = [];

        this.anchor(parent, chartGroup);
    }

    _doRender () {
        this.resetSvg();
        for (let layerIndex = 0; layerIndex < this._geoJsons.length; ++layerIndex) {
            const states = this.svg().append('g')
                .attr('class', `layer${layerIndex}`);

            let regionG = states.selectAll(`g.${this._geoJson(layerIndex).name}`)
                .data(this._geoJson(layerIndex).data);

            regionG = regionG.enter()
                .append('g')
                .attr('class', this._geoJson(layerIndex).name)
                .merge(regionG);

            regionG
                .append('path')
                .classed('dc-tabbable', this._keyboardAccessible)
                .attr('fill', 'white')
                .attr('d', this._getGeoPath());

            regionG.append('title');

            this._plotData(layerIndex);
        }
        this._projectionFlag = false;
    }

    _plotData (layerIndex) {
        const data = this._generateLayeredData();

        if (this._isDataLayer(layerIndex)) {
            const regionG = this._renderRegionG(layerIndex);

            this._renderPaths(regionG, layerIndex, data);

            this._renderTitles(regionG, layerIndex, data);
        }
    }

    _generateLayeredData () {
        const data = {};
        const groupAll = this.data();
        for (let i = 0; i < groupAll.length; ++i) {
            data[this.keyAccessor()(groupAll[i])] = this.valueAccessor()(groupAll[i]);
        }
        return data;
    }

    _isDataLayer (layerIndex) {
        return this._geoJson(layerIndex).keyAccessor;
    }

    _renderRegionG (layerIndex) {
        const regionG = this.svg()
            .selectAll(this._layerSelector(layerIndex))
            .classed('selected', d => this._isSelected(layerIndex, d))
            .classed('deselected', d => this._isDeselected(layerIndex, d))
            .attr('class', d => {
                const layerNameClass = this._geoJson(layerIndex).name;
                const regionClass = utils.nameToId(this._geoJson(layerIndex).keyAccessor(d));
                let baseClasses = `${layerNameClass} ${regionClass}`;
                if (this._isSelected(layerIndex, d)) {
                    baseClasses += ' selected';
                }
                if (this._isDeselected(layerIndex, d)) {
                    baseClasses += ' deselected';
                }
                return baseClasses;
            });
        return regionG;
    }

    _layerSelector (layerIndex) {
        return `g.layer${layerIndex} g.${this._geoJson(layerIndex).name}`;
    }

    _isSelected (layerIndex, d) {
        return this.hasFilter() && this.hasFilter(this._getKey(layerIndex, d));
    }

    _isDeselected (layerIndex, d) {
        return this.hasFilter() && !this.hasFilter(this._getKey(layerIndex, d));
    }

    _getKey (layerIndex, d) {
        return this._geoJson(layerIndex).keyAccessor(d);
    }

    _geoJson (index) {
        return this._geoJsons[index];
    }

    _renderPaths (regionG, layerIndex, data) {
        const paths = regionG
            .select('path')
            .attr('fill', function () {
                const currentFill = select(this).attr('fill');
                if (currentFill) {
                    return currentFill;
                }
                return 'none';
            })
            .on('click', d3compat.eventHandler(d => this.onClick(d, layerIndex)));

        if (this._keyboardAccessible) {
            this._makeKeyboardAccessible(this.onClick, layerIndex);
        }

        transition(paths, this.transitionDuration(),
                   this.transitionDelay()).attr('fill', (d, i) => this.getColor(data[this._geoJson(layerIndex).keyAccessor(d)], i));
    }

    onClick (d, layerIndex) {
        const selectedRegion = this._geoJson(layerIndex).keyAccessor(d);
        events.trigger(() => {
            this.filter(selectedRegion);
            this.redrawGroup();
        });
    }

    _renderTitles (regionG, layerIndex, data) {
        if (this.renderTitle()) {
            regionG.selectAll('title').text(d => {
                const key = this._getKey(layerIndex, d);
                const value = data[key];
                return this.title()({key: key, value: value});
            });
        }
    }

    _doRedraw () {
        for (let layerIndex = 0; layerIndex < this._geoJsons.length; ++layerIndex) {
            this._plotData(layerIndex);
            if (this._projectionFlag) {
                this.svg().selectAll(`g.${this._geoJson(layerIndex).name} path`).attr('d', this._getGeoPath());
            }
        }
        this._projectionFlag = false;
    }

    /**
     * **mandatory**
     *
     * Use this function to insert a new GeoJson map layer. This function can be invoked multiple times
     * if you have multiple GeoJson data layers to render on top of each other. If you overlay multiple
     * layers with the same name the new overlay will override the existing one.
     * @see {@link http://geojson.org/ GeoJSON}
     * @see {@link https://github.com/topojson/topojson/wiki TopoJSON}
     * @see {@link https://github.com/topojson/topojson-1.x-api-reference/blob/master/API-Reference.md#wiki-feature topojson.feature}
     * @example
     * // insert a layer for rendering US states
     * chart.overlayGeoJson(statesJson.features, 'state', function(d) {
     *      return d.properties.name;
     * });
     * @param {_geoJson} json - a geojson feed
     * @param {String} name - name of the layer
     * @param {Function} keyAccessor - accessor function used to extract 'key' from the GeoJson data. The key extracted by
     * this function should match the keys returned by the crossfilter groups.
     * @returns {GeoChoroplethChart}
     */
    overlayGeoJson (json, name, keyAccessor) {
        for (let i = 0; i < this._geoJsons.length; ++i) {
            if (this._geoJsons[i].name === name) {
                this._geoJsons[i].data = json;
                this._geoJsons[i].keyAccessor = keyAccessor;
                return this;
            }
        }
        this._geoJsons.push({name: name, data: json, keyAccessor: keyAccessor});
        return this;
    }

    /**
     * Gets or sets a custom geo projection function. See the available
     * {@link https://github.com/d3/d3-geo/blob/master/README.md#projections d3 geo projection functions}.
     *
     * Starting version 3.0 it has been deprecated to rely on the default projection being
     * {@link https://github.com/d3/d3-geo/blob/master/README.md#geoAlbersUsa d3.geoAlbersUsa()}. Please
     * set it explicitly. {@link https://bl.ocks.org/mbostock/5557726
     * Considering that `null` is also a valid value for projection}, if you need
     * projection to be `null` please set it explicitly to `null`.
     * @see {@link https://github.com/d3/d3-geo/blob/master/README.md#projections d3.projection}
     * @see {@link https://github.com/d3/d3-geo-projection d3-geo-projection}
     * @param {d3.projection} [projection=d3.geoAlbersUsa()]
     * @returns {d3.projection|GeoChoroplethChart}
     */
    projection (projection) {
        if (!arguments.length) {
            return this._projection;
        }

        this._projection = projection;
        this._projectionFlag = true;
        return this;
    }

    _getGeoPath () {
        if (this._projection === undefined) {
            logger.warn('choropleth projection default of geoAlbers is deprecated,' +
                ' in next version projection will need to be set explicitly');
            return this._geoPath.projection(geoAlbersUsa());
        }

        return this._geoPath.projection(this._projection);
    }

    /**
     * Returns all GeoJson layers currently registered with this chart. The returned array is a
     * reference to this chart's internal data structure, so any modification to this array will also
     * modify this chart's internal registration.
     * @returns {Array<{name:String, data: Object, accessor: Function}>}
     */
    geoJsons () {
        return this._geoJsons;
    }

    /**
     * Returns the {@link https://github.com/d3/d3-geo/blob/master/README.md#paths d3.geoPath} object used to
     * render the projection and features.  Can be useful for figuring out the bounding box of the
     * feature set and thus a way to calculate scale and translation for the projection.
     * @see {@link https://github.com/d3/d3-geo/blob/master/README.md#paths d3.geoPath}
     * @returns {d3.geoPath}
     */
    geoPath () {
        return this._geoPath;
    }

    /**
     * Remove a GeoJson layer from this chart by name
     * @param {String} name
     * @returns {GeoChoroplethChart}
     */
    removeGeoJson (name) {
        const geoJsons = [];

        for (let i = 0; i < this._geoJsons.length; ++i) {
            const layer = this._geoJsons[i];
            if (layer.name !== name) {
                geoJsons.push(layer);
            }
        }

        this._geoJsons = geoJsons;

        return this;
    }
}

export const geoChoroplethChart = (parent, chartGroup) => new GeoChoroplethChart(parent, chartGroup);
