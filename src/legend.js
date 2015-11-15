/**
 * Legend is a attachable widget that can be added to other dc charts to render horizontal legend
 * labels.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
 * @name legend
 * @memberof dc
 * @example
 * chart.legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
 * @return {dc.legend}
 */
dc.legend = function () {
    var LEGEND_GAP = 5;
    var LABEL_GAP = 4;
    var LEGEND_CLASS = 'dc-legend';
    var LEGEND_ITEM_CLASS = 'dc-legend-item';

    var _legend = {};
    var _parent;
    var _itemHeight = 12;
    var _position = 'bottom';
    var _legendText = dc.pluck('name');
    var _g;

    function getInfo() {
        var x = 0;
        var y = 0;
        var horizontal = false;

        switch(_position) {
            case 'top':
                x = _parent.width() / 2;
                y = LEGEND_GAP;
                horizontal = true;
                break;

            case 'bottom':
                x = _parent.width() / 2;
                y = _parent.height() - LEGEND_GAP;
                horizontal = true;
                break;

            case 'left':
                x = LEGEND_GAP
                y = _parent.height() / 2;
                horizontal = false;
                break;

            case 'right':
                x = _parent.width() - LEGEND_GAP
                y = _parent.height() / 2;
                horizontal = false;
                break;
        }

        return {
            x: x,
            y: y,
            horizontal: horizontal,
        }
    }

    function getPosition(info) {
        var bBox = _g.node().getBBox();

        switch(_position) {
            case 'top':
                _parent.legendTopPadding = bBox.height;
                info.x -= (bBox.width / 2);
                break;

            case 'bottom':
                _parent.legendBottomPadding = bBox.height;
                info.x -= (bBox.width / 2);
                info.y -= bBox.height;
                break;

            case 'left':
                _parent.legendLeftPadding = bBox.width;
                info.y -= (bBox.height / 2);
                break;

            case 'right':
                _parent.legendRightPadding = bBox.width;
                info.x -= bBox.width;
                info.y -= (bBox.height / 2);
                break;
        }

        return info.x + ',' + info.y;
    }

    _legend.parent = function (p) {
        if (!arguments.length) {
            return _parent;
        }
        _parent = p;
        return _legend;
    };

    _legend.render = function () {
        var info = getInfo();

        _parent.svg().select('g.' + LEGEND_CLASS).remove();

        _g = _parent.svg().append('g')
            .attr('class', LEGEND_CLASS);

        var legendables = _parent.legendables();

        var itemEnter = _g.selectAll('g.' + LEGEND_ITEM_CLASS)
            .data(legendables)
            .enter()
            .append('g')
            .attr('class', LEGEND_ITEM_CLASS)
            .on('mouseover', function (d) {
                _parent.legendHighlight(d);
            })
            .on('mouseout', function (d) {
                _parent.legendReset(d);
            })
            .on('click', function (d) {
                d.chart.legendToggle(d);
            });

        _g.selectAll('g.' + LEGEND_ITEM_CLASS)
            .classed('fadeout', function (d) {
                return d.chart.isLegendableHidden(d);
            });

        if (legendables.some(dc.pluck('dashstyle'))) {
            itemEnter
                .append('line')
                .attr('x1', 0)
                .attr('y1', _itemHeight / 2)
                .attr('x2', _itemHeight)
                .attr('y2', _itemHeight / 2)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', dc.pluck('dashstyle'))
                .attr('stroke', dc.pluck('color'));
        } else {
            itemEnter
                .append('rect')
                .attr('width', _itemHeight)
                .attr('height', _itemHeight)
                .attr('fill', function (d) {return d ? d.color : 'blue';});
        }

        itemEnter.append('text')
                .text(_legendText)
                .attr('x', _itemHeight + LABEL_GAP)
                .attr('y', function () {
                    return _itemHeight / 2 + (this.clientHeight ? this.clientHeight : 13) / 2 - 2;
                });

        var _cumulativeLegendTextWidth = 0;
        var row = 0;
        itemEnter.attr('transform', function (d, i) {
            if (info.horizontal) {
                var itemWidth = this.getBBox().width + LABEL_GAP;

                _cumulativeLegendTextWidth += itemWidth;

                if (_cumulativeLegendTextWidth >= _parent.width()) {
                    ++row;
                    _cumulativeLegendTextWidth = itemWidth;
                }

                var translateBy = {
                    x: _cumulativeLegendTextWidth - itemWidth,
                    y: row * (_itemHeight + LABEL_GAP)
                };


                return 'translate(' + translateBy.x + ', ' + translateBy.y + ')';
            } else {
                return 'translate(0,' + i * (_itemHeight + LABEL_GAP) + ')';
            }
        });

        _g.attr('transform', 'translate(' + getPosition(info) + ')');
    };

    _legend.position = function (_) {
        if (!arguments.length) {
            return _position;
        }

        _position = _;

        return _legend;
    };

    /**
    #### .legendText([legendTextFunction])
    Set or get the legend text function. The legend widget uses this function to render
    the legend text on each item. If no function is specified the legend widget will display
    the names associated with each group.

    Default: dc.pluck('name')

    ```js
    // create numbered legend items
    chart.legend(dc.legend().legendText(function(d, i) { return i + '. ' + d.name; }))

    // create legend displaying group counts
    chart.legend(dc.legend().legendText(function(d) { return d.name + ': ' d.data; }))
    ```
    **/
    _legend.legendText = function (_) {
        if (!arguments.length) {
            return _legendText;
        }
        _legendText = _;
        return _legend;
    };

    return _legend;
};
