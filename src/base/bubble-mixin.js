import { ascending, descending, min, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import {ColorMixin} from './color-mixin';
import {transition} from '../core/core';
import {events} from '../core/events';
import {d3compat} from '../core/config';

/**
 * This Mixin provides reusable functionalities for any chart that needs to visualize data using bubbles.
 * @mixin BubbleMixin
 * @mixes ColorMixin
 * @param {Object} Base
 * @returns {BubbleMixin}
 */
export const BubbleMixin = Base => class extends ColorMixin(Base) {
    constructor () {
        super();

        this._maxBubbleRelativeSize = 0.3;
        this._minRadiusWithLabel = 10;
        this._sortBubbleSize = false;
        this._elasticRadius = false;
        this._excludeElasticZero = true;

        // These cane be used by derived classes as well, so member status
        this.BUBBLE_NODE_CLASS = 'node';
        this.BUBBLE_CLASS = 'bubble';
        this.MIN_RADIUS = 10;

        this.renderLabel(true);

        this.data(group => {
            const data = group.all();

            if (this._keyboardAccessible) {
                // sort based on the x value (key)
                data.sort((a, b) => ascending(this.keyAccessor()(a), this.keyAccessor()(b)));
            }

            if (this._sortBubbleSize) {
                // sort descending so smaller bubbles are on top
                const radiusAccessor = this.radiusValueAccessor();
                data.sort((a, b) => descending(radiusAccessor(a), radiusAccessor(b)));
            }
            return data;
        });

        this._r = scaleLinear().domain([0, 100]);
    }

    _rValueAccessor (d) {
        return d.r;
    }

    /**
         * Get or set the bubble radius scale. By default the bubble chart uses
         * {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear d3.scaleLinear().domain([0, 100])}
         * as its radius scale.
         * @memberof BubbleMixin
         * @instance
         * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
         * @param {d3.scale} [bubbleRadiusScale=d3.scaleLinear().domain([0, 100])]
         * @returns {d3.scale|BubbleMixin}
         */
    r (bubbleRadiusScale) {
        if (!arguments.length) {
            return this._r;
        }
        this._r = bubbleRadiusScale;
        return this;
    }

    /**
         * Turn on or off the elastic bubble radius feature, or return the value of the flag. If this
         * feature is turned on, then bubble radii will be automatically rescaled to fit the chart better.
         * @memberof BubbleMixin
         * @instance
         * @param {Boolean} [elasticRadius=false]
         * @returns {Boolean|BubbleChart}
         */
    elasticRadius (elasticRadius) {
        if (!arguments.length) {
            return this._elasticRadius;
        }
        this._elasticRadius = elasticRadius;
        return this;
    }

    calculateRadiusDomain () {
        if (this._elasticRadius) {
            this.r().domain([this.rMin(), this.rMax()]);
        }
    }

    /**
         * Get or set the radius value accessor function. If set, the radius value accessor function will
         * be used to retrieve a data value for each bubble. The data retrieved then will be mapped using
         * the r scale to the actual bubble radius. This allows you to encode a data dimension using bubble
         * size.
         * @memberof BubbleMixin
         * @instance
         * @param {Function} [radiusValueAccessor]
         * @returns {Function|BubbleMixin}
         */
    radiusValueAccessor (radiusValueAccessor) {
        if (!arguments.length) {
            return this._rValueAccessor;
        }
        this._rValueAccessor = radiusValueAccessor;
        return this;
    }

    rMin () {
        let values = this.data().map(this.radiusValueAccessor());
        if(this._excludeElasticZero) {
            values = values.filter(value => value > 0);
        }
        return min(values);
    }

    rMax () {
        return max(this.data(), e => this.radiusValueAccessor()(e));
    }

    bubbleR (d) {
        const value = this.radiusValueAccessor()(d);
        let r = this.r()(value);
        if (isNaN(r) || value <= 0) {
            r = 0;
        }
        return r;
    }

    _labelFunction (d) {
        return this.label()(d);
    }

    _shouldLabel (d) {
        return (this.bubbleR(d) > this._minRadiusWithLabel);
    }

    _labelOpacity (d) {
        return this._shouldLabel(d) ? 1 : 0;
    }

    _labelPointerEvent (d) {
        return this._shouldLabel(d) ? 'all' : 'none';
    }

    _doRenderLabel (bubbleGEnter) {
        if (this.renderLabel()) {
            let label = bubbleGEnter.select('text');

            if (label.empty()) {
                label = bubbleGEnter.append('text')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '.3em')
                        .on('click', d3compat.eventHandler(d => this.onClick(d)));
            }

            label
                    .attr('opacity', 0)
                    .attr('pointer-events', d => this._labelPointerEvent(d))
                    .text(d => this._labelFunction(d));
            transition(label, this.transitionDuration(), this.transitionDelay())
                    .attr('opacity', d => this._labelOpacity(d));
        }
    }

    doUpdateLabels (bubbleGEnter) {
        if (this.renderLabel()) {
            const labels = bubbleGEnter.select('text')
                    .attr('pointer-events', d => this._labelPointerEvent(d))
                    .text(d => this._labelFunction(d));
            transition(labels, this.transitionDuration(), this.transitionDelay())
                    .attr('opacity', d => this._labelOpacity(d));
        }
    }

    _titleFunction (d) {
        return this.title()(d);
    }

    _doRenderTitles (g) {
        if (this.renderTitle()) {
            const title = g.select('title');

            if (title.empty()) {
                g.append('title').text(d => this._titleFunction(d));
            }
        }
    }

    doUpdateTitles (g) {
        if (this.renderTitle()) {
            g.select('title').text(d => this._titleFunction(d));
        }
    }

    /**
         * Turn on or off the bubble sorting feature, or return the value of the flag. If enabled,
         * bubbles will be sorted by their radius, with smaller bubbles in front.
         * @memberof BubbleChart
         * @instance
         * @param {Boolean} [sortBubbleSize=false]
         * @returns {Boolean|BubbleChart}
         */
    sortBubbleSize (sortBubbleSize) {
        if (!arguments.length) {
            return this._sortBubbleSize;
        }
        this._sortBubbleSize = sortBubbleSize;
        return this;
    }

    /**
         * Get or set the minimum radius. This will be used to initialize the radius scale's range.
         * @memberof BubbleMixin
         * @instance
         * @param {Number} [radius=10]
         * @returns {Number|BubbleMixin}
         */
    minRadius (radius) {
        if (!arguments.length) {
            return this.MIN_RADIUS;
        }
        this.MIN_RADIUS = radius;
        return this;
    }

    /**
         * Get or set the minimum radius for label rendering. If a bubble's radius is less than this value
         * then no label will be rendered.
         * @memberof BubbleMixin
         * @instance
         * @param {Number} [radius=10]
         * @returns {Number|BubbleMixin}
         */

    minRadiusWithLabel (radius) {
        if (!arguments.length) {
            return this._minRadiusWithLabel;
        }
        this._minRadiusWithLabel = radius;
        return this;
    }

    /**
         * Get or set the maximum relative size of a bubble to the length of x axis. This value is useful
         * when the difference in radius between bubbles is too great.
         * @memberof BubbleMixin
         * @instance
         * @param {Number} [relativeSize=0.3]
         * @returns {Number|BubbleMixin}
         */
    maxBubbleRelativeSize (relativeSize) {
        if (!arguments.length) {
            return this._maxBubbleRelativeSize;
        }
        this._maxBubbleRelativeSize = relativeSize;
        return this;
    }

    /**
     * Should the chart exclude zero when calculating elastic bubble radius?
     * @memberof BubbleMixin
     * @instance
     * @param  {Boolean} [excludeZero=true]
     * @returns {Boolean|BubbleMixin}
     */
    excludeElasticZero (excludeZero) {
        if (!arguments.length) {
            return this._excludeElasticZero;
        }
        this._excludeElasticZero = excludeZero;
        return this;
    }

    fadeDeselectedArea (selection) {
        if (this.hasFilter()) {
            const chart = this;
            this.selectAll(`g.${chart.BUBBLE_NODE_CLASS}`).each(function (d) {
                if (chart.isSelectedNode(d)) {
                    chart.highlightSelected(this);
                } else {
                    chart.fadeDeselected(this);
                }
            });
        } else {
            const chart = this;
            this.selectAll(`g.${chart.BUBBLE_NODE_CLASS}`).each(function () {
                chart.resetHighlight(this);
            });
        }
    }

    isSelectedNode (d) {
        return this.hasFilter(d.key);
    }

    onClick (d) {
        const filter = d.key;
        events.trigger(() => {
            this.filter(filter);
            this.redrawGroup();
        });
    }
};
