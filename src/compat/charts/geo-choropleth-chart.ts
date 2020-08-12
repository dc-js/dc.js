import {GeoChoroplethChart as GeoChoroplethChartNeo} from '../../charts/geo-choropleth-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {BaseAccessor, ChartGroupType, ChartParentType, IGeoJson} from '../../core/types';

export class GeoChoroplethChart extends ColorMixinExt(BaseMixinExt(GeoChoroplethChartNeo)) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Returns all GeoJson layers currently registered with this chart. The returned array is a
     * reference to this chart's internal data structure, so any modification to this array will also
     * modify this chart's internal registration.
     * @returns {Array<{name:String, data: Object, accessor: Function}>}
     */
    public geoJsons (): IGeoJson[] {
        return this._conf.geoJsons;
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
    public overlayGeoJson (json, name: string, keyAccessor: BaseAccessor<any>) {
        for (let i = 0; i < this._conf.geoJsons.length; ++i) {
            if (this._conf.geoJsons[i].name === name) {
                this._conf.geoJsons[i].data = json;
                this._conf.geoJsons[i].keyAccessor = keyAccessor;
                return this;
            }
        }
        this._conf.geoJsons.push({name, data: json, keyAccessor});
        return this;
    }

    /**
     * Remove a GeoJson layer from this chart by name
     * @param {String} name
     * @returns {GeoChoroplethChart}
     */
    public removeGeoJson (name: string): this {
        const geoJsons = [];

        for (let i = 0; i < this._conf.geoJsons.length; ++i) {
            const layer = this._conf.geoJsons[i];
            if (layer.name !== name) {
                geoJsons.push(layer);
            }
        }

        this.configure({geoJsons: geoJsons});

        return this;
    }
}

export const geoChoroplethChart = (parent: ChartParentType, chartGroup: ChartGroupType) => new GeoChoroplethChart(parent, chartGroup);
