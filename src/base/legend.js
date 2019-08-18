import {pluck, utils} from '../core/utils';

/**
 * Legend is a attachable widget that can be added to other dc charts to render horizontal legend
 * labels.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
 * @class Legend
 * @memberof dc
 * @example
 * chart.legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
 * @returns {Legend}
 */
export class Legend {
    constructor () {
        const LABEL_GAP = 2;

        let _parent;
        let _x = 0;
        let _y = 0;
        let _itemHeight = 12;
        let _gap = 5;
        let _horizontal = false;
        let _legendWidth = 560;
        let _itemWidth = 70;
        let _autoItemWidth = false;
        let _legendText = pluck('name');
        let _maxItems;

        let _g;

        this.parent = function (p) {
            if (!arguments.length) {
                return _parent;
            }
            _parent = p;
            return this;
        };

        this.render = function () {
            _parent.svg().select('g.dc-legend').remove();
            _g = _parent.svg().append('g')
                .attr('class', 'dc-legend')
                .attr('transform', 'translate(' + _x + ',' + _y + ')');
            let legendables = _parent.legendables();

            if (_maxItems !== undefined) {
                legendables = legendables.slice(0, _maxItems);
            }

            const itemEnter = _g.selectAll('g.dc-legend-item')
                .data(legendables)
                .enter()
                .append('g')
                .attr('class', 'dc-legend-item')
                .on('mouseover', function (d) {
                    _parent.legendHighlight(d);
                })
                .on('mouseout', function (d) {
                    _parent.legendReset(d);
                })
                .on('click', function (d) {
                    d.chart.legendToggle(d);
                });

            _g.selectAll('g.dc-legend-item')
                .classed('fadeout', function (d) {
                    return d.chart.isLegendableHidden(d);
                });

            if (legendables.some(pluck('dashstyle'))) {
                itemEnter
                    .append('line')
                    .attr('x1', 0)
                    .attr('y1', _itemHeight / 2)
                    .attr('x2', _itemHeight)
                    .attr('y2', _itemHeight / 2)
                    .attr('stroke-width', 2)
                    .attr('stroke-dasharray', pluck('dashstyle'))
                    .attr('stroke', pluck('color'));
            } else {
                itemEnter
                    .append('rect')
                    .attr('width', _itemHeight)
                    .attr('height', _itemHeight)
                    .attr('fill', function (d) {
                        return d ? d.color : 'blue';
                    });
            }

            itemEnter.append('text')
                .text(_legendText)
                .attr('x', _itemHeight + LABEL_GAP)
                .attr('y', function () {
                    return _itemHeight / 2 + (this.clientHeight ? this.clientHeight : 13) / 2 - 2;
                });

            let _cumulativeLegendTextWidth = 0;
            let row = 0;
            itemEnter.attr('transform', function (d, i) {
                if (_horizontal) {
                    const itemWidth = _autoItemWidth === true ? this.getBBox().width + _gap : _itemWidth;
                    if ((_cumulativeLegendTextWidth + itemWidth) > _legendWidth && _cumulativeLegendTextWidth > 0) {
                        ++row;
                        _cumulativeLegendTextWidth = 0;
                    }
                    const translateBy = 'translate(' + _cumulativeLegendTextWidth + ',' + row * legendItemHeight() + ')';
                    _cumulativeLegendTextWidth += itemWidth;
                    return translateBy;
                } else {
                    return 'translate(0,' + i * legendItemHeight() + ')';
                }
            });
        };

        function legendItemHeight () {
            return _gap + _itemHeight;
        }

        /**
         * Set or get x coordinate for legend widget.
         * @method x
         * @memberof dc.legend
         * @instance
         * @param  {Number} [x=0]
         * @returns {Number|dc.legend}
         */
        this.x = function (x) {
            if (!arguments.length) {
                return _x;
            }
            _x = x;
            return this;
        };

        /**
         * Set or get y coordinate for legend widget.
         * @method y
         * @memberof dc.legend
         * @instance
         * @param  {Number} [y=0]
         * @returns {Number|dc.legend}
         */
        this.y = function (y) {
            if (!arguments.length) {
                return _y;
            }
            _y = y;
            return this;
        };

        /**
         * Set or get gap between legend items.
         * @method gap
         * @memberof dc.legend
         * @instance
         * @param  {Number} [gap=5]
         * @returns {Number|dc.legend}
         */
        this.gap = function (gap) {
            if (!arguments.length) {
                return _gap;
            }
            _gap = gap;
            return this;
        };

        /**
         * Set or get legend item height.
         * @method itemHeight
         * @memberof dc.legend
         * @instance
         * @param  {Number} [itemHeight=12]
         * @returns {Number|dc.legend}
         */
        this.itemHeight = function (itemHeight) {
            if (!arguments.length) {
                return _itemHeight;
            }
            _itemHeight = itemHeight;
            return this;
        };

        /**
         * Position legend horizontally instead of vertically.
         * @method horizontal
         * @memberof dc.legend
         * @instance
         * @param  {Boolean} [horizontal=false]
         * @returns {Boolean|dc.legend}
         */
        this.horizontal = function (horizontal) {
            if (!arguments.length) {
                return _horizontal;
            }
            _horizontal = horizontal;
            return this;
        };

        /**
         * Maximum width for horizontal legend.
         * @method legendWidth
         * @memberof dc.legend
         * @instance
         * @param  {Number} [legendWidth=500]
         * @returns {Number|dc.legend}
         */
        this.legendWidth = function (legendWidth) {
            if (!arguments.length) {
                return _legendWidth;
            }
            _legendWidth = legendWidth;
            return this;
        };

        /**
         * Legend item width for horizontal legend.
         * @method itemWidth
         * @memberof dc.legend
         * @instance
         * @param  {Number} [itemWidth=70]
         * @returns {Number|dc.legend}
         */
        this.itemWidth = function (itemWidth) {
            if (!arguments.length) {
                return _itemWidth;
            }
            _itemWidth = itemWidth;
            return this;
        };

        /**
         * Turn automatic width for legend items on or off. If true, {@link dc.legend#itemWidth itemWidth} is ignored.
         * This setting takes into account the {@link dc.legend#gap gap}.
         * @method autoItemWidth
         * @memberof dc.legend
         * @instance
         * @param  {Boolean} [autoItemWidth=false]
         * @returns {Boolean|dc.legend}
         */
        this.autoItemWidth = function (autoItemWidth) {
            if (!arguments.length) {
                return _autoItemWidth;
            }
            _autoItemWidth = autoItemWidth;
            return this;
        };

        /**
         * Set or get the legend text function. The legend widget uses this function to render the legend
         * text for each item. If no function is specified the legend widget will display the names
         * associated with each group.
         * @method legendText
         * @memberof dc.legend
         * @instance
         * @param  {Function} [legendText]
         * @returns {Function|dc.legend}
         * @example
         * // default legendText
         * legend.legendText(dc.pluck('name'))
         *
         * // create numbered legend items
         * chart.legend(dc.legend().legendText(function(d, i) { return i + '. ' + d.name; }))
         *
         * // create legend displaying group counts
         * chart.legend(dc.legend().legendText(function(d) { return d.name + ': ' d.data; }))
         **/
        this.legendText = function (legendText) {
            if (!arguments.length) {
                return _legendText;
            }
            _legendText = legendText;
            return this;
        };

        /**
         * Maximum number of legend items to display
         * @method maxItems
         * @memberof dc.legend
         * @instance
         * @param  {Number} [maxItems]
         * @return {dc.legend}
         */
        this.maxItems = function (maxItems) {
            if (!arguments.length) {
                return _maxItems;
            }
            _maxItems = utils.isNumber(maxItems) ? maxItems : undefined;
            return this;
        };

        return this;
    }
}

export const legend = function () {
    return new Legend();
};

