import { mouse, Selection } from 'd3-selection';

import { BaseMixin } from '../base/base-mixin';
import { BubbleMixin } from '../base/bubble-mixin';
import { transition } from '../core/core';
import { constants } from '../core/constants';
import { nameToId } from '../core/utils';
import { ColorMixin } from '../base/color-mixin';
import { ChartGroupType, ChartParentType, SVGGElementSelection } from '../core/types';
import { IBubbleOverlayConf } from './i-bubble-overlay-conf';
import { adaptHandler } from '../core/d3compat';

const BUBBLE_OVERLAY_CLASS = 'bubble-overlay';
const BUBBLE_NODE_CLASS = 'node';
const BUBBLE_CLASS = 'bubble';

/**
 * The bubble overlay chart is quite different from the typical bubble chart. With the bubble overlay
 * chart you can arbitrarily place bubbles on an existing svg or bitmap image, thus changing the
 * typical x and y positioning while retaining the capability to visualize data using bubble radius
 * and coloring.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
 * @mixes BubbleMixin
 * @mixes BaseMixin
 */
export class BubbleOverlay extends BubbleMixin(ColorMixin(BaseMixin)) {
    protected _conf: IBubbleOverlayConf;

    private _g: Selection<SVGGElement, any, any, any>;

    /**
     * Create a Bubble Overlay.
     *
     * @example
     * // create a bubble overlay chart on top of the '#chart-container1 svg' element using the default global chart group
     * var bubbleChart1 = BubbleOverlayChart('#chart-container1').svg(d3.select('#chart-container1 svg'));
     * // create a bubble overlay chart on top of the '#chart-container2 svg' element using chart group A
     * var bubbleChart2 = new CompositeChart('#chart-container2', 'chartGroupA').svg(d3.select('#chart-container2 svg'));
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        this.configure({
            points: [],
        });

        /**
         * **mandatory**
         *
         * Set the underlying svg image element. Unlike other dc charts this chart will not generate a svg
         * element; therefore the bubble overlay chart will not work if this function is not invoked. If the
         * underlying image is a bitmap, then an empty svg will need to be created on top of the image.
         * @example
         * // set up underlying svg element
         * chart.svg(d3.select('#chart svg'));
         * @param {SVGElement|d3.selection} [imageElement]
         * @returns {BubbleOverlay}
         */
        this._g = undefined;

        this.configure({
            // TODO: move following two to Mixin, BubbleChart has exactly same setup
            transitionDuration: 750,
            transitionDelay: 0,
            radiusValueAccessor: d => d.value,
        });

        this.anchor(parent, chartGroup);
    }

    public configure(conf: IBubbleOverlayConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IBubbleOverlayConf {
        return this._conf;
    }

    public _doRender(): this {
        this._g = this._initOverlayG();

        this.r().range([this.MIN_RADIUS, this.width() * this._conf.maxBubbleRelativeSize]);

        this._initializeBubbles();

        this.fadeDeselectedArea(this.filter());

        return this;
    }

    public _initOverlayG(): Selection<SVGGElement, any, any, any> {
        this._g = this.select<SVGGElement>(`g.${BUBBLE_OVERLAY_CLASS}`);
        if (this._g.empty()) {
            this._g = this.svg().append('g').attr('class', BUBBLE_OVERLAY_CLASS);
        }
        return this._g;
    }

    public _initializeBubbles() {
        const data = this._mapData();
        this.calculateRadiusDomain();

        this._conf.points.forEach(point => {
            const nodeG = this._getNodeG(point, data);

            let circle = nodeG.select(`circle.${BUBBLE_CLASS}`);

            if (circle.empty()) {
                circle = nodeG
                    .append('circle')
                    .attr('class', BUBBLE_CLASS)
                    .attr('r', 0)
                    .attr('fill', (d, i) => this.getColor(d, i))
                    .on(
                        'click',
                        adaptHandler(d => this.onClick(d))
                    );
            }

            transition(circle, this._conf.transitionDuration, this._conf.transitionDelay).attr(
                'r',
                d => this.bubbleR(d)
            );

            this._doRenderLabel(nodeG);

            this._doRenderTitles(nodeG);
        });
    }

    public _mapData() {
        const data = {};
        this.data().forEach(datum => {
            data[this._conf.keyAccessor(datum)] = datum;
        });
        return data;
    }

    public _getNodeG(point: { name: string; x: number; y: number }, data): SVGGElementSelection {
        const bubbleNodeClass = `${BUBBLE_NODE_CLASS} ${nameToId(point.name)}`;

        let nodeG: SVGGElementSelection = this._g.select(`g.${nameToId(point.name)}`);

        if (nodeG.empty()) {
            nodeG = this._g
                .append('g')
                .attr('class', bubbleNodeClass)
                .attr('transform', `translate(${point.x},${point.y})`);
        }

        nodeG.datum(data[point.name]);

        return nodeG;
    }

    public _doRedraw(): this {
        this._updateBubbles();

        this.fadeDeselectedArea(this.filter());

        return this;
    }

    public _updateBubbles(): void {
        const data = this._mapData();
        this.calculateRadiusDomain();

        this._conf.points.forEach(point => {
            const nodeG = this._getNodeG(point, data);

            const circle = nodeG.select(`circle.${BUBBLE_CLASS}`);

            transition(circle, this._conf.transitionDuration, this._conf.transitionDelay)
                .attr('r', d => this.bubbleR(d))
                .attr('fill', (d, i) => this.getColor(d, i));

            this.doUpdateLabels(nodeG);

            this.doUpdateTitles(nodeG);
        });
    }

    public debug(flag: boolean): this {
        if (flag) {
            let debugG: SVGGElementSelection = this.select(`g.${constants.DEBUG_GROUP_CLASS}`);

            if (debugG.empty()) {
                debugG = this.svg().append('g').attr('class', constants.DEBUG_GROUP_CLASS);
            }

            const debugText = debugG.append('text').attr('x', 10).attr('y', 20);

            debugG
                .append('rect')
                .attr('width', this.width())
                .attr('height', this.height())
                .on('mousemove', () => {
                    const position = mouse(debugG.node());
                    const msg = `${position[0]}, ${position[1]}`;
                    debugText.text(msg);
                });
        } else {
            this.selectAll('.debug').remove();
        }

        return this;
    }
}
