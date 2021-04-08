import {BaseMixin} from '../base/base-mixin';
import {BubbleMixin} from '../base/bubble-mixin';
import {transition} from '../core/core';
import {constants} from '../core/constants';
import {utils} from '../core/utils';
import {d3compat} from '../core/config';

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
export class BubbleOverlay extends BubbleMixin(BaseMixin) {
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
    constructor (parent, chartGroup) {
        super();

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
        this._points = [];
        this._keyboardAccessible = false;

        this.transitionDuration(750);

        this.transitionDelay(0);

        this.radiusValueAccessor(d => d.value);

        this.anchor(parent, chartGroup);
    }

    /**
     * **mandatory**
     *
     * Set up a data point on the overlay. The name of a data point should match a specific 'key' among
     * data groups generated using keyAccessor.  If a match is found (point name <-> data group key)
     * then a bubble will be generated at the position specified by the function. x and y
     * value specified here are relative to the underlying svg.
     * @param {String} name
     * @param {Number} x
     * @param {Number} y
     * @returns {BubbleOverlay}
     */
    point (name, x, y) {
        this._points.push({name: name, x: x, y: y});
        return this;
    }

    _doRender () {
        this._g = this._initOverlayG();

        this.r().range([this.MIN_RADIUS, this.width() * this.maxBubbleRelativeSize()]);

        this._initializeBubbles();

        this.fadeDeselectedArea(this.filter());

        return this;
    }

    _initOverlayG () {
        this._g = this.select(`g.${BUBBLE_OVERLAY_CLASS}`);
        if (this._g.empty()) {
            this._g = this.svg().append('g').attr('class', BUBBLE_OVERLAY_CLASS);
        }
        return this._g;
    }

    _initializeBubbles () {
        const data = this._mapData();
        this.calculateRadiusDomain();

        this._points.forEach(point => {
            const nodeG = this._getNodeG(point, data);

            let circle = nodeG.select(`circle.${BUBBLE_CLASS}`);

            if (circle.empty()) {
                circle = nodeG.append('circle')
                    .attr('class', BUBBLE_CLASS)
                    .classed('dc-tabbable', this._keyboardAccessible)
                    .attr('r', 0)
                    .attr('fill', this.getColor)
                    .on('click', d3compat.eventHandler(d => this.onClick(d)));
            }

            if (this._keyboardAccessible) {
                this._makeKeyboardAccessible(this.onClick);
            }

            transition(circle, this.transitionDuration(), this.transitionDelay())
                .attr('r', d => this.bubbleR(d));

            this._doRenderLabel(nodeG);

            this._doRenderTitles(nodeG);
        });
    }

    _mapData () {
        const data = {};
        this.data().forEach(datum => {
            data[this.keyAccessor()(datum)] = datum;
        });
        return data;
    }

    _getNodeG (point, data) {
        const bubbleNodeClass = `${BUBBLE_NODE_CLASS} ${utils.nameToId(point.name)}`;

        let nodeG = this._g.select(`g.${utils.nameToId(point.name)}`);

        if (nodeG.empty()) {
            nodeG = this._g.append('g')
                .attr('class', bubbleNodeClass)
                .attr('transform', `translate(${point.x},${point.y})`);
        }

        nodeG.datum(data[point.name]);

        return nodeG;
    }

    _doRedraw () {
        this._updateBubbles();

        this.fadeDeselectedArea(this.filter());

        return this;
    }

    _updateBubbles () {
        const data = this._mapData();
        this.calculateRadiusDomain();

        this._points.forEach(point => {
            const nodeG = this._getNodeG(point, data);

            const circle = nodeG.select(`circle.${BUBBLE_CLASS}`);

            transition(circle, this.transitionDuration(), this.transitionDelay())
                .attr('r', d => this.bubbleR(d))
                .attr('fill', this.getColor);

            this.doUpdateLabels(nodeG);

            this.doUpdateTitles(nodeG);
        });
    }

    debug (flag) {
        if (flag) {
            let debugG = this.select(`g.${constants.DEBUG_GROUP_CLASS}`);

            if (debugG.empty()) {
                debugG = this.svg()
                    .append('g')
                    .attr('class', constants.DEBUG_GROUP_CLASS);
            }

            const debugText = debugG.append('text')
                .attr('x', 10)
                .attr('y', 20);

            debugG
                .append('rect')
                .attr('width', this.width())
                .attr('height', this.height())
                .on('mousemove', d3compat.eventHandler((d, evt) => {
                    const position = d3compat.pointer(evt, debugG.node());
                    const msg = `${position[0]}, ${position[1]}`;
                    debugText.text(msg);
                }));
        } else {
            this.selectAll('.debug').remove();
        }

        return this;
    }

}

export const bubbleOverlay = (parent, chartGroup) => new BubbleOverlay(parent, chartGroup);
