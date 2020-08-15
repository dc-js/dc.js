import {format} from 'd3-format';

import {BaseMixin} from '../base/base-mixin';
import {ChartGroupType, ChartParentType} from '../core/types';
import {IDataCountConf} from './i-data-count-conf';

// Keeping these here for now, check if any other charts need same entities
interface CF {
    size (): number;
}

interface MinimalGroupAll {
    value (): number;
}

/**
 * The data count widget is a simple widget designed to display the number of records selected by the
 * current filters out of the total number of records in the data set. Once created the data count widget
 * will automatically update the text content of child elements with the following classes:
 *
 * * `.total-count` - total number of records
 * * `.filter-count` - number of records matched by the current filters
 *
 * Note: this widget works best for the specific case of showing the number of records out of a
 * total. If you want a more general-purpose numeric display, please use the
 * {@link NumberDisplay} widget instead.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * @mixes BaseMixin
 */
export class DataCount extends BaseMixin {
    public _conf: IDataCountConf;

    private _crossfilter: CF;
    private _groupAll: MinimalGroupAll;

    /**
     * Create a Data Count widget.
     * @example
     * var ndx = crossfilter(data);
     * var all = ndx.groupAll();
     *
     * new DataCount('.dc-data-count')
     *     .crossfilter(ndx)
     *     .groupAll(all);
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        this.configure({
            formatNumber: format(',d'),
            html: {some: '', all: ''}
        });

        this._crossfilter = null;
        this._groupAll = null;

        this._mandatoryAttributes(['crossfilter', 'groupAll']);

        this.anchor(parent, chartGroup);
    }

    public configure (conf: IDataCountConf) {
        super.configure(conf);
    }

    public _doRender () {
        const tot: number = this.crossfilter().size();
        const val: number = this.groupAll().value();
        const all: string = this._conf.formatNumber(tot);
        const selected: string = this._conf.formatNumber(val);

        if ((tot === val) && (this._conf.html.all !== '')) {
            this.root().html(this._conf.html.all.replace('%total-count', all).replace('%filter-count', selected));
        } else if (this._conf.html.some !== '') {
            this.root().html(this._conf.html.some.replace('%total-count', all).replace('%filter-count', selected));
        } else {
            this.selectAll('.total-count').text(all);
            this.selectAll('.filter-count').text(selected);
        }
        return this;
    }

    public _doRedraw () {
        return this._doRender();
    }

    public crossfilter (): CF;
    public crossfilter (cf: CF): this;
    public crossfilter (cf?) {
        if (!arguments.length) {
            return this._crossfilter;
        }
        this._crossfilter = cf;
        return this;
    }

    public groupAll ():MinimalGroupAll;
    public groupAll (groupAll:MinimalGroupAll): this;
    public groupAll (groupAll?) {
        if (!arguments.length) {
            return this._groupAll;
        }
        this._groupAll = groupAll;
        return this;
    }
}
