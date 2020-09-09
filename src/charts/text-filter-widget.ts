import { BaseMixin } from '../base/base-mixin';
import { constants } from '../core/constants';
import { events } from '../core/events';
import { ChartGroupType, ChartParentType } from '../core/types';
import { Selection } from 'd3-selection';
import { ITextFilterWidgetConf } from './i-text-filter-widget-conf';

const INPUT_CSS_CLASS = 'dc-text-filter-input';

/**
 * Text Filter Widget
 *
 * The text filter widget is a simple widget designed to display an input field allowing to filter
 * data that matches the text typed.
 * As opposed to the other charts, this doesn't display any result and doesn't update its display,
 * it's just to input an filter other charts.
 *
 * @mixes BaseMixin
 */
export class TextFilterWidget extends BaseMixin {
    protected _conf: ITextFilterWidgetConf;

    private _input: Selection<HTMLInputElement, any, any, any>;

    /**
     * Create Text Filter widget
     * @example
     *
     * var data = [{"firstName":"John","lastName":"Coltrane"}{"firstName":"Miles",lastName:"Davis"}]
     * var ndx = crossfilter(data);
     * var dimension = ndx.dimension(function(d) {
     *     return d.lastName.toLowerCase() + ' ' + d.firstName.toLowerCase();
     * });
     *
     * new TextFilterWidget('#search')
     *     .dimension(dimension);
     *     // you don't need the group() function
     *
     * @param {String|node|d3.selection|CompositeChart} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
     * specifying a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        this.configure({
            placeHolder: 'search',
            normalize: s => s.toLowerCase(),
            filterFunctionFactory: query => {
                query = this._conf.normalize(query);
                return d => this._conf.normalize(d).indexOf(query) !== -1;
            },
        });

        // @ts-ignore, signature is different in BaseMixin
        this.group(() => {
            throw new Error(
                'the group function on textFilterWidget should never be called, please report the issue'
            );
        });

        this.anchor(parent, chartGroup);
    }

    public configure(conf: ITextFilterWidgetConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): ITextFilterWidgetConf {
        return this._conf;
    }

    public _doRender(): this {
        this.select('input').remove();

        this._input = this.root().append('input').classed(INPUT_CSS_CLASS, true);

        const chart = this;
        this._input.on('input', function () {
            chart
                .dataProvider()
                .conf()
                .dimension.filterFunction(chart._conf.filterFunctionFactory(this.value));
            events.trigger(() => {
                chart.redrawGroup();
            }, constants.EVENT_DELAY);
        });

        this._doRedraw();

        return this;
    }

    public _doRedraw(): this {
        this.root().selectAll('input').attr('placeholder', this._conf.placeHolder);

        return this;
    }
}
