import { geoAlbersUsa, geoPath, GeoPath, GeoProjection } from 'd3-geo';
import { select, Selection } from 'd3-selection';

import { BaseMixin } from '../base/base-mixin';
import { ColorMixin } from '../base/color-mixin';
import { transition } from '../core/core';
import { logger } from '../core/logger';
import { events } from '../core/events';
import { nameToId } from '../core/utils';
import { ChartGroupType, ChartParentType } from '../core/types';
import { IGeoChoroplethChartConf } from './i-geo-choropleth-chart-conf';
import { adaptHandler } from '../core/d3compat';

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
    public _conf: IGeoChoroplethChartConf;

    private _geoPath: GeoPath;
    private _projectionFlag: boolean;
    private _projection: GeoProjection;

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
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(chartGroup);

        this.configure({
            colorAccessor: d => d || 0,
            geoJsons: [],
        });

        this._geoPath = geoPath();
        this._projectionFlag = undefined;
        this._projection = undefined;

        this.anchor(parent);
    }

    public configure(conf: IGeoChoroplethChartConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IGeoChoroplethChartConf {
        return this._conf;
    }

    public _doRender() {
        this.resetSvg();
        for (let layerIndex = 0; layerIndex < this._conf.geoJsons.length; ++layerIndex) {
            const states: Selection<SVGGElement, any, any, any> = this.svg()
                .append('g')
                .attr('class', `layer${layerIndex}`);

            let regionG = states
                .selectAll<SVGGElement, any>(`g.${this._geoJson(layerIndex).name}`)
                .data(this._geoJson(layerIndex).data);

            regionG = regionG
                .enter()
                .append('g')
                .attr('class', this._geoJson(layerIndex).name)
                .merge(regionG);

            regionG.append('path').attr('fill', 'white').attr('d', this._getGeoPath());

            regionG.append('title');

            this._plotData(layerIndex);
        }
        this._projectionFlag = false;

        return this;
    }

    private _plotData(layerIndex: number): void {
        const data = this._generateLayeredData();

        if (this._isDataLayer(layerIndex)) {
            const regionG = this._renderRegionG(layerIndex);

            this._renderPaths(regionG, layerIndex, data);

            this._renderTitles(regionG, layerIndex, data);
        }
    }

    private _generateLayeredData() {
        const data = {};
        const groupAll = this.data();
        for (let i = 0; i < groupAll.length; ++i) {
            data[this._conf.keyAccessor(groupAll[i])] = groupAll[i]._value;
        }
        return data;
    }

    private _isDataLayer(layerIndex: number): boolean {
        return !!this._geoJson(layerIndex).keyAccessor;
    }

    private _renderRegionG(layerIndex: number): Selection<SVGGElement, any, SVGElement, any> {
        const regionG: Selection<SVGGElement, any, SVGElement, any> = this.svg()
            .selectAll<SVGGElement, any>(this._layerSelector(layerIndex))
            .classed('selected', d => this._isSelected(layerIndex, d))
            .classed('deselected', d => this._isDeselected(layerIndex, d))
            .attr('class', d => {
                const layerNameClass = this._geoJson(layerIndex).name;
                const regionClass = nameToId(this._geoJson(layerIndex).keyAccessor(d));
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

    private _layerSelector(layerIndex: number): string {
        return `g.layer${layerIndex} g.${this._geoJson(layerIndex).name}`;
    }

    private _isSelected(layerIndex, d): boolean {
        return this.hasFilter() && this.hasFilter(this._getKey(layerIndex, d));
    }

    private _isDeselected(layerIndex: number, d): boolean {
        return this.hasFilter() && !this.hasFilter(this._getKey(layerIndex, d));
    }

    private _getKey(layerIndex: number, d) {
        return this._geoJson(layerIndex).keyAccessor(d);
    }

    private _geoJson(index: number) {
        return this._conf.geoJsons[index];
    }

    private _renderPaths(
        regionG: Selection<SVGGElement, any, SVGElement, any>,
        layerIndex: number,
        data
    ) {
        const paths: Selection<SVGPathElement, any, SVGElement, any> = regionG
            .select<SVGPathElement>('path')
            .attr('fill', function () {
                const currentFill = select(this).attr('fill');
                if (currentFill) {
                    return currentFill;
                }
                return 'none';
            })
            .on(
                'click',
                adaptHandler(d => this.onClick(d, layerIndex))
            );

        transition(paths, this._conf.transitionDuration, this._conf.transitionDelay).attr(
            'fill',
            (d, i) => this.getColor(data[this._geoJson(layerIndex).keyAccessor(d)], i)
        );
    }

    public onClick(d, layerIndex) {
        const selectedRegion = this._geoJson(layerIndex).keyAccessor(d);
        events.trigger(() => {
            this.filter(selectedRegion);
            this.redrawGroup();
        });
    }

    private _renderTitles(
        regionG: Selection<SVGGElement, any, SVGElement, any>,
        layerIndex: number,
        data
    ): void {
        if (this._conf.renderTitle) {
            regionG.selectAll('title').text(d => {
                const key = this._getKey(layerIndex, d);
                const value = data[key];
                return this._conf.title({ key, value });
            });
        }
    }

    public _doRedraw(): this {
        for (let layerIndex = 0; layerIndex < this._conf.geoJsons.length; ++layerIndex) {
            this._plotData(layerIndex);
            if (this._projectionFlag) {
                this.svg()
                    .selectAll(`g.${this._geoJson(layerIndex).name} path`)
                    .attr('d', this._getGeoPath());
            }
        }
        this._projectionFlag = false;

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
    public projection(): GeoProjection;
    public projection(projection: GeoProjection): this;
    public projection(projection?) {
        if (!arguments.length) {
            return this._projection;
        }

        this._projection = projection;
        this._projectionFlag = true;
        return this;
    }

    private _getGeoPath(): GeoPath {
        if (this._projection === undefined) {
            logger.warn(
                'choropleth projection default of geoAlbers is deprecated,' +
                    ' in next version projection will need to be set explicitly'
            );
            return this._geoPath.projection(geoAlbersUsa());
        }

        return this._geoPath.projection(this._projection);
    }

    /**
     * Returns the {@link https://github.com/d3/d3-geo/blob/master/README.md#paths d3.geoPath} object used to
     * render the projection and features.  Can be useful for figuring out the bounding box of the
     * feature set and thus a way to calculate scale and translation for the projection.
     * @see {@link https://github.com/d3/d3-geo/blob/master/README.md#paths d3.geoPath}
     * @returns {d3.geoPath}
     */
    public geoPath(): GeoPath {
        return this._geoPath;
    }
}
