/**
 * A scatter plot chart
 *
 * Examples:
 * - {@link http://dc-js.github.io/dc.js/examples/scatter.html Scatter Chart}
 * - {@link http://dc-js.github.io/dc.js/examples/multi-scatter.html Multi-Scatter Chart}
 * @class scatterPlot
 * @memberof dc
 * @mixes dc.coordinateGridMixin
 * @example
 * // create a scatter plot under #chart-container1 element using the default global chart group
 * var chart1 = dc.scatterPlot('#chart-container1');
 * // create a scatter plot under #chart-container2 element using chart group A
 * var chart2 = dc.scatterPlot('#chart-container2', 'chartGroupA');
 * // create a sub-chart under a composite parent chart
 * var chart3 = dc.scatterPlot(compositeChart);
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.scatterPlot}
 */
dc.scatterPlot = function (parent, chartGroup) {
    var _chart = dc.coordinateGridMixin({});
    var _symbol = d3.symbol();

    var _existenceAccessor = function (d) { return d.value; };

    var originalKeyAccessor = _chart.keyAccessor();
    _chart.keyAccessor(function (d) { return originalKeyAccessor(d)[0]; });
    _chart.valueAccessor(function (d) { return originalKeyAccessor(d)[1]; });
    _chart.colorAccessor(function () { return _chart._groupName; });

    _chart.title(function (d) {
        // this basically just counteracts the setting of its own key/value accessors
        // see https://github.com/dc-js/dc.js/issues/702
        return _chart.keyAccessor()(d) + ',' + _chart.valueAccessor()(d) + ': ' +
            _chart.existenceAccessor()(d);
    });

    var _locator = function (d) {
        return 'translate(' + _chart.x()(_chart.keyAccessor()(d)) + ',' +
                              _chart.y()(_chart.valueAccessor()(d)) + ')';
    };

    var _highlightedSize = 7;
    var _symbolSize = 5;
    var _excludedSize = 3;
    var _excludedColor = null;
    var _excludedOpacity = 1.0;
    var _emptySize = 0;
    var _emptyOpacity = 0;
    var _nonemptyOpacity = 1;
    var _emptyColor = null;
    var _filtered = [];
    var _canvas = null;
    var _context = null;
    var _useCanvas = false;

    // Calculates element radius for canvas plot to be comparable to D3 area based symbol sizes
    function canvasElementSize (d, isFiltered) {
        if (!_existenceAccessor(d)) {
            return _emptySize / Math.sqrt(Math.PI);
        } else if (isFiltered) {
            return _symbolSize / Math.sqrt(Math.PI);
        } else {
            return _excludedSize / Math.sqrt(Math.PI);
        }
    }

    // Use a 2 dimensional brush
    _chart.brush(d3.brush());

    function elementSize (d, i) {
        if (!_existenceAccessor(d)) {
            return Math.pow(_emptySize, 2);
        } else if (_filtered[i]) {
            return Math.pow(_symbolSize, 2);
        } else {
            return Math.pow(_excludedSize, 2);
        }
    }
    _symbol.size(elementSize);

    dc.override(_chart, '_filter', function (filter) {
        if (!arguments.length) {
            return _chart.__filter();
        }

        return _chart.__filter(dc.filters.RangedTwoDimensionalFilter(filter));
    });

    _chart._resetSvgOld = _chart.resetSvg; // Copy original closure from base-mixin

    /**
     * Method that replaces original resetSvg and appropriately inserts canvas
     * element along with svg element and sets their CSS properties appropriately
     * so they are overlapped on top of each other.
     * Remove the chart's SVGElements from the dom and recreate the container SVGElement.
     * @method resetSvg
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SVGElement SVGElement}
     * @returns {SVGElement}
     */
    _chart.resetSvg = function () {
        if (!_useCanvas) {
            return _chart._resetSvgOld();
        } else {
            _chart._resetSvgOld(); // Perform original svgReset inherited from baseMixin
            _chart.select('canvas').remove(); // remove old canvas

            var svgSel = _chart.svg();
            var rootSel = _chart.root();

            // Set root node to relative positioning and svg to absolute
            rootSel.style('position', 'relative');
            svgSel.style('position', 'relative');

            // Check if SVG element already has any extra top/left CSS offsets
            var svgLeft = isNaN(parseInt(svgSel.style('left'), 10)) ? 0 : parseInt(svgSel.style('left'), 10);
            var svgTop = isNaN(parseInt(svgSel.style('top'), 10)) ? 0 : parseInt(svgSel.style('top'), 10);
            var width = _chart.effectiveWidth();
            var height = _chart.effectiveHeight();
            var margins = _chart.margins(); // {top: 10, right: 130, bottom: 42, left: 42}

            // Add the canvas element such that it perfectly overlaps the plot area of the scatter plot SVG
            var devicePixelRatio = window.devicePixelRatio || 1;
            _canvas = _chart.root().append('canvas')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', (width) * devicePixelRatio)
                .attr('height', (height) * devicePixelRatio)
                .style('width', width + 'px')
                .style('height', height + 'px')
                .style('position', 'absolute')
                .style('top', margins.top + svgTop + 'px')
                .style('left', margins.left + svgLeft + 'px')
                .style('z-index', -1) // Place behind SVG
                .style('pointer-events', 'none'); // Disable pointer events on canvas so SVG can capture brushing

            // Define canvas context and set clipping path
            _context = _canvas.node().getContext('2d');
            _context.scale(devicePixelRatio, devicePixelRatio);
            _context.rect(0, 0, width, height);
            _context.clip(); // Setup clipping path
            _context.imageSmoothingQuality = 'high';

            return _chart.svg(); // Respect original return param for _chart.resetSvg;
        }
    };

    _chart.resizeCanvas = function () {
        var width = _chart.effectiveWidth();
        var height = _chart.effectiveHeight();

        var devicePixelRatio = window.devicePixelRatio || 1;
        _canvas
            .attr('width', (width) * devicePixelRatio)
            .attr('height', (height) * devicePixelRatio)
            .style('width', width + 'px')
            .style('height', height + 'px');
        _context.scale(devicePixelRatio, devicePixelRatio);
    };

    /**
     * Set or get whether to use canvas backend for plotting scatterPlot. Note that the
     * canvas backend does not currently support
     * {@link dc.scatterPlot#customSymbol customSymbol} or
     * {@link dc.scatterPlot#symbol symbol} methods and is limited to always plotting
     * with filled circles. Symbols are drawn with
     * {@link dc.scatterPlot#symbolSize symbolSize} radius. By default, the SVG backend
     * is used when `useCanvas` is set to `false`.
     * @method useCanvas
     * @memberof dc.scatterPlot
     * @instance
     * @param {Boolean} [useCanvas=false]
     * @return {Boolean|d3.selection}
     */
    _chart.useCanvas = function (useCanvas) {
        if (!arguments.length) {
            return _useCanvas;
        }
        _useCanvas = useCanvas;
        return _chart;
    };

    /**
     * Set or get canvas element. You should usually only ever use the get method as
     * dc.js will handle canvas element generation.  Provides valid canvas only when
     * {@link dc.scatterPlot#useCanvas useCanvas} is set to `true`
     * @method canvas
     * @memberof dc.scatterPlot
     * @instance
     * @param {CanvasElement|d3.selection} [canvasElement]
     * @return {CanvasElement|d3.selection}
     */
    _chart.canvas = function (canvasElement) {
        if (!arguments.length) {
            return _canvas;
        }
        _canvas = canvasElement;
        return _chart;
    };

    /**
     * Get canvas 2D context. Provides valid context only when
     * {@link dc.scatterPlot#useCanvas useCanvas} is set to `true`
     * @method context
     * @memberof dc.scatterPlot
     * @instance
     * @return {CanvasContext}
     */
    _chart.context = function () {
        return _context;
    };

    /*eslint complexity: [2,11] */
    // Plots data on canvas element. If argument provided, assumes legend is
    // currently being highlighted and modifies opacity/size of symbols accordingly
    // @param {Object} [legendHighlightDatum] - Datum provided to legendHighlight method
    function plotOnCanvas (legendHighlightDatum) {
        _chart.resizeCanvas();
        var context = _chart.context();
        context.clearRect(0, 0, (context.canvas.width + 2) * 1, (context.canvas.height + 2) * 1);
        var data = _chart.data();

        // Draw the data on canvas
        data.forEach(function (d, i) {
            var isFiltered = !_chart.filter() || _chart.filter().isFiltered([d.key[0], d.key[1]]);
            // Calculate opacity for current data point
            var cOpacity = 1;
            if (!_existenceAccessor(d)) {
                cOpacity = _emptyOpacity;
            } else if (isFiltered) {
                cOpacity = _nonemptyOpacity;
            } else {
                cOpacity = _chart.excludedOpacity();
            }
            // Calculate color for current data point
            var cColor = null;
            if (_emptyColor && !_existenceAccessor(d)) {
                cColor = _emptyColor;
            } else if (_chart.excludedColor() && !isFiltered) {
                cColor = _chart.excludedColor();
            } else {
                cColor = _chart.getColor(d);
            }
            var cSize = canvasElementSize(d, isFiltered);

            // Adjust params for data points if legend is highlighted
            if (legendHighlightDatum) {
                var isHighlighted = (cColor === legendHighlightDatum.color);
                // Calculate opacity for current data point
                var fadeOutOpacity = 0.1; // TODO: Make this programmatically setable
                if (!isHighlighted) { // Fade out non-highlighted colors + highlighted colors outside filter
                    cOpacity = fadeOutOpacity;
                }
                if (isHighlighted) { // Set size for highlighted color data points
                    cSize = _highlightedSize / Math.sqrt(Math.PI);
                }
            }

            // Draw point on canvas
            context.save();
            context.globalAlpha = cOpacity;
            context.beginPath();
            context.arc(_chart.x()(_chart.keyAccessor()(d)), _chart.y()(_chart.valueAccessor()(d)), cSize, 0, 2 * Math.PI, true);
            context.fillStyle = cColor;
            context.fill();
            // context.lineWidth = 0.5; // Commented out code to add stroke around scatter points if desired
            // context.strokeStyle = '#333';
            // context.stroke();
            context.restore();
        });
    }

    function plotOnSVG () {
        var symbols = _chart.chartBodyG().selectAll('path.symbol')
            .data(_chart.data());

        dc.transition(symbols.exit(), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('opacity', 0).remove();

        symbols = symbols
            .enter()
                .append('path')
                .attr('class', 'symbol')
                .attr('opacity', 0)
                .attr('fill', _chart.getColor)
                .attr('transform', _locator)
            .merge(symbols);

        symbols.call(renderTitles, _chart.data());

        symbols.each(function (d, i) {
            _filtered[i] = !_chart.filter() || _chart.filter().isFiltered([_chart.keyAccessor()(d), _chart.valueAccessor()(d)]);
        });

        dc.transition(symbols, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('opacity', function (d, i) {
                if (!_existenceAccessor(d)) {
                    return _emptyOpacity;
                } else if (_filtered[i]) {
                    return _nonemptyOpacity;
                } else {
                    return _chart.excludedOpacity();
                }
            })
            .attr('fill', function (d, i) {
                if (_emptyColor && !_existenceAccessor(d)) {
                    return _emptyColor;
                } else if (_chart.excludedColor() && !_filtered[i]) {
                    return _chart.excludedColor();
                } else {
                    return _chart.getColor(d);
                }
            })
            .attr('transform', _locator)
            .attr('d', _symbol);
    }

    _chart.plotData = function () {
        if (_useCanvas) {
            plotOnCanvas();
        } else {
            plotOnSVG();
        }
    };

    function renderTitles (symbol, d) {
        if (_chart.renderTitle()) {
            symbol.selectAll('title').remove();
            symbol.append('title').text(function (d) {
                return _chart.title()(d);
            });
        }
    }

    /**
     * Get or set the existence accessor.  If a point exists, it is drawn with
     * {@link dc.scatterPlot#symbolSize symbolSize} radius and
     * opacity 1; if it does not exist, it is drawn with
     * {@link dc.scatterPlot#emptySize emptySize} radius and opacity 0. By default,
     * the existence accessor checks if the reduced value is truthy.
     * @method existenceAccessor
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link dc.scatterPlot#symbolSize symbolSize}
     * @see {@link dc.scatterPlot#emptySize emptySize}
     * @example
     * // default accessor
     * chart.existenceAccessor(function (d) { return d.value; });
     * @param {Function} [accessor]
     * @returns {Function|dc.scatterPlot}
     */
    _chart.existenceAccessor = function (accessor) {
        if (!arguments.length) {
            return _existenceAccessor;
        }
        _existenceAccessor = accessor;
        return this;
    };

    /**
     * Get or set the symbol type used for each point. By default the symbol is a circle (d3.symbolCircle).
     * Type can be a constant or an accessor.
     * @method symbol
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_type symbol.type}
     * @example
     * // Circle type
     * chart.symbol(d3.symbolCircle);
     * // Square type
     * chart.symbol(d3.symbolSquare);
     * @param {Function} [type=d3.symbolCircle]
     * @returns {Function|dc.scatterPlot}
     */
    _chart.symbol = function (type) {
        if (!arguments.length) {
            return _symbol.type();
        }
        _symbol.type(type);
        return _chart;
    };

    /**
     * Get or set the symbol generator. By default `dc.scatterPlot` will use
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol d3.symbol()}
     * to generate symbols. `dc.scatterPlot` will set the
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size symbol size accessor}
     * on the symbol generator.
     * @method customSymbol
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol d3.symbol}
     * @see {@link https://stackoverflow.com/questions/25332120/create-additional-d3-js-symbols Create additional D3.js symbols}
     * @param {String|Function} [customSymbol=d3.symbol()]
     * @returns {String|Function|dc.scatterPlot}
     */
    _chart.customSymbol = function (customSymbol) {
        if (!arguments.length) {
            return _symbol;
        }
        _symbol = customSymbol;
        _symbol.size(elementSize);
        return _chart;
    };

    /**
     * Set or get radius for symbols.
     * @method symbolSize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [symbolSize=3]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.symbolSize = function (symbolSize) {
        if (!arguments.length) {
            return _symbolSize;
        }
        _symbolSize = symbolSize;
        return _chart;
    };

    /**
     * Set or get radius for highlighted symbols.
     * @method highlightedSize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [highlightedSize=5]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.highlightedSize = function (highlightedSize) {
        if (!arguments.length) {
            return _highlightedSize;
        }
        _highlightedSize = highlightedSize;
        return _chart;
    };

    /**
     * Set or get size for symbols excluded from this chart's filter. If null, no
     * special size is applied for symbols based on their filter status.
     * @method excludedSize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [excludedSize=null]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.excludedSize = function (excludedSize) {
        if (!arguments.length) {
            return _excludedSize;
        }
        _excludedSize = excludedSize;
        return _chart;
    };

    /**
     * Set or get color for symbols excluded from this chart's filter. If null, no
     * special color is applied for symbols based on their filter status.
     * @method excludedColor
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [excludedColor=null]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.excludedColor = function (excludedColor) {
        if (!arguments.length) {
            return _excludedColor;
        }
        _excludedColor = excludedColor;
        return _chart;
    };

    /**
     * Set or get opacity for symbols excluded from this chart's filter.
     * @method excludedOpacity
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [excludedOpacity=1.0]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.excludedOpacity = function (excludedOpacity) {
        if (!arguments.length) {
            return _excludedOpacity;
        }
        _excludedOpacity = excludedOpacity;
        return _chart;
    };

    /**
     * Set or get radius for symbols when the group is empty.
     * @method emptySize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [emptySize=0]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.hiddenSize = _chart.emptySize = function (emptySize) {
        if (!arguments.length) {
            return _emptySize;
        }
        _emptySize = emptySize;
        return _chart;
    };

    /**
     * Set or get color for symbols when the group is empty. If null, just use the
     * {@link dc.colorMixin#colors colorMixin.colors} color scale zero value.
     * @name emptyColor
     * @memberof dc.scatterPlot
     * @instance
     * @param {String} [emptyColor=null]
     * @return {String}
     * @return {dc.scatterPlot}/
     */
    _chart.emptyColor = function (emptyColor) {
        if (!arguments.length) {
            return _emptyColor;
        }
        _emptyColor = emptyColor;
        return _chart;
    };

    /**
     * Set or get opacity for symbols when the group is empty.
     * @name emptyOpacity
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [emptyOpacity=0]
     * @return {Number}
     * @return {dc.scatterPlot}
     */
    _chart.emptyOpacity = function (emptyOpacity) {
        if (!arguments.length) {
            return _emptyOpacity;
        }
        _emptyOpacity = emptyOpacity;
        return _chart;
    };

    /**
     * Set or get opacity for symbols when the group is not empty.
     * @name nonemptyOpacity
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [nonemptyOpacity=1]
     * @return {Number}
     * @return {dc.scatterPlot}
     */
    _chart.nonemptyOpacity = function (nonemptyOpacity) {
        if (!arguments.length) {
            return _emptyOpacity;
        }
        _nonemptyOpacity = nonemptyOpacity;
        return _chart;
    };

    _chart.legendables = function () {
        return [{chart: _chart, name: _chart._groupName, color: _chart.getColor()}];
    };

    _chart.legendHighlight = function (d) {
        if (_useCanvas) {
            plotOnCanvas(d); // Supply legend datum to plotOnCanvas
        } else {
            resizeSymbolsWhere(function (symbol) {
                return symbol.attr('fill') === d.color;
            }, _highlightedSize);
            _chart.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
                return d3.select(this).attr('fill') !== d.color;
            }).classed('fadeout', true);
        }
    };

    _chart.legendReset = function (d) {
        if (_useCanvas) {
            plotOnCanvas();
        } else {
            resizeSymbolsWhere(function (symbol) {
                return symbol.attr('fill') === d.color;
            }, _symbolSize);
            _chart.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
                return d3.select(this).attr('fill') !== d.color;
            }).classed('fadeout', false);
        }
    };

    function resizeSymbolsWhere (condition, size) {
        var symbols = _chart.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
            return condition(d3.select(this));
        });
        var oldSize = _symbol.size();
        _symbol.size(Math.pow(size, 2));
        dc.transition(symbols, _chart.transitionDuration(), _chart.transitionDelay()).attr('d', _symbol);
        _symbol.size(oldSize);
    }

    _chart.createBrushHandlePaths = function () {
        // no handle paths for poly-brushes
    };

    _chart.extendBrush = function (brushSelection) {
        if (_chart.round()) {
            brushSelection[0] = brushSelection[0].map(_chart.round());
            brushSelection[1] = brushSelection[1].map(_chart.round());
        }
        return brushSelection;
    };

    _chart.brushIsEmpty = function (brushSelection) {
        return !brushSelection || brushSelection[0][0] >= brushSelection[1][0] || brushSelection[0][1] >= brushSelection[1][1];
    };

    _chart._brushing = function () {
        // Avoids infinite recursion (mutual recursion between range and focus operations)
        // Source Event will be null when brush.move is called programmatically (see below as well).
        if (!d3.event.sourceEvent) { return; }

        // Ignore event if recursive event - i.e. not directly generated by user action (like mouse/touch etc.)
        // In this case we are more worried about this handler causing brush move programmatically which will
        // cause this handler to be invoked again with a new d3.event (and current event set as sourceEvent)
        // This check avoids recursive calls
        if (d3.event.sourceEvent.type && ['start', 'brush', 'end'].indexOf(d3.event.sourceEvent.type) !== -1) {
            return;
        }

        var brushSelection = d3.event.selection;

        // Testing with pixels is more reliable
        var brushIsEmpty = _chart.brushIsEmpty(brushSelection);

        if (brushSelection) {
            brushSelection = brushSelection.map(function (point) {
                return point.map(function (coord, i) {
                    var scale = i === 0 ? _chart.x() : _chart.y();
                    return scale.invert(coord);
                });
            });

            brushSelection = _chart.extendBrush(brushSelection);

            // The rounding process might have made brushSelection empty, so we need to recheck
            brushIsEmpty = brushIsEmpty && _chart.brushIsEmpty(brushSelection);
        }

        _chart.redrawBrush(brushSelection, false);

        var ranged2DFilter = brushIsEmpty ? null : dc.filters.RangedTwoDimensionalFilter(brushSelection);

        dc.events.trigger(function () {
            _chart.replaceFilter(ranged2DFilter);
            _chart.redrawGroup();
        }, dc.constants.EVENT_DELAY);
    };

    _chart.redrawBrush = function (brushSelection, doTransition) {
        // override default x axis brush from parent chart
        var _brush = _chart.brush();
        var _gBrush = _chart.gBrush();

        if (_chart.brushOn() && _gBrush) {
            if (_chart.resizing()) {
                _chart.setBrushExtents(doTransition);
            }

            if (!brushSelection) {
                _gBrush
                    .call(_brush.move, brushSelection);

            } else {
                brushSelection = brushSelection.map(function (point) {
                    return point.map(function (coord, i) {
                        var scale = i === 0 ? _chart.x() : _chart.y();
                        return scale(coord);
                    });
                });

                var gBrush =
                    dc.optionalTransition(doTransition, _chart.transitionDuration(), _chart.transitionDelay())(_gBrush);

                gBrush
                    .call(_brush.move, brushSelection);

            }
        }

        _chart.fadeDeselectedArea(brushSelection);
    };

    _chart.setBrushY = function (gBrush) {
        gBrush.call(_chart.brush().y(_chart.y()));
    };

    return _chart.anchor(parent, chartGroup);
};
