import * as d3 from 'd3';
import bubbleMixin from './bubble-mixin';
import baseMixin from './base-mixin';
import {constants, transition} from './core';
import {utils} from './utils';

/**
## Bubble Overlay Chart
Includes: [Bubble Mixin](#bubble-mixin), [Base Mixin](#base-mixin)

The bubble overlay chart is quite different from the typical bubble chart. With the bubble overlay
chart you can arbitrarily place bubbles on an existing svg or bitmap image, thus changing the
typical x and y positioning while retaining the capability to visualize data using bubble radius
and coloring.

Examples:
* [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)
#### dc.bubbleOverlay(parent[, chartGroup])
Create a bubble overlay chart instance and attach it to the given parent element.

Parameters:
* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.
 off-screen. Typically this element should also be the parent of the underlying image.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

Returns:
A newly created bubble overlay chart instance

```js
// create a bubble overlay chart on top of the '#chart-container1 svg' element using the default global chart group
var bubbleChart1 = dc.bubbleOverlayChart('#chart-container1').svg(d3.select('#chart-container1 svg'));
// create a bubble overlay chart on top of the '#chart-container2 svg' element using chart group A
var bubbleChart2 = dc.compositeChart('#chart-container2', 'chartGroupA').svg(d3.select('#chart-container2 svg'));
```
#### .svg(imageElement) - **mandatory**
Set the underlying svg image element. Unlike other dc charts this chart will not generate a svg
element; therefore the bubble overlay chart will not work if this function is not invoked. If the
underlying image is a bitmap, then an empty svg will need to be created on top of the image.

```js
// set up underlying svg element
chart.svg(d3.select('#chart svg'));
```

**/
var bubbleOverlay = function (root, chartGroup) {
    var BUBBLE_OVERLAY_CLASS = 'bubble-overlay';
    var BUBBLE_NODE_CLASS = 'node';
    var BUBBLE_CLASS = 'bubble';

    var _chart = bubbleMixin(baseMixin({}));
    var _g;
    var _points = [];

    _chart.transitionDuration(750);

    _chart.radiusValueAccessor(function (d) {
        return d.value;
    });

    /**
    #### .point(name, x, y) - **mandatory**
    Set up a data point on the overlay. The name of a data point should match a specific 'key' among
    data groups generated using keyAccessor.  If a match is found (point name <-> data group key)
    then a bubble will be generated at the position specified by the function. x and y
    value specified here are relative to the underlying svg.

    **/
    _chart.point = function (name, x, y) {
        _points.push({name: name, x: x, y: y});
        return _chart;
    };

    _chart._doRender = function () {
        _g = initOverlayG();

        _chart.r().range([_chart.MIN_RADIUS, _chart.width() * _chart.maxBubbleRelativeSize()]);

        initializeBubbles();

        _chart.fadeDeselectedArea();

        return _chart;
    };

    function initOverlayG() {
        _g = _chart.select('g.' + BUBBLE_OVERLAY_CLASS);
        if (_g.empty()) {
            _g = _chart.svg().append('g').attr('class', BUBBLE_OVERLAY_CLASS);
        }
        return _g;
    }

    function initializeBubbles() {
        var data = mapData();

        _points.forEach(function (point) {
            var nodeG = getNodeG(point, data);

            var circle = nodeG.select('circle.' + BUBBLE_CLASS);

            if (circle.empty()) {
                circle = nodeG.append('circle')
                    .attr('class', BUBBLE_CLASS)
                    .attr('r', 0)
                    .attr('fill', _chart.getColor)
                    .on('click', _chart.onClick);
            }

            transition(circle, _chart.transitionDuration())
                .attr('r', function (d) {
                    return _chart.bubbleR(d);
                });

            _chart._doRenderLabel(nodeG);

            _chart._doRenderTitles(nodeG);
        });
    }

    function mapData() {
        var data = {};
        _chart.data().forEach(function (datum) {
            data[_chart.keyAccessor()(datum)] = datum;
        });
        return data;
    }

    function getNodeG(point, data) {
        var bubbleNodeClass = BUBBLE_NODE_CLASS + ' ' + utils.nameToId(point.name);

        var nodeG = _g.select('g.' + utils.nameToId(point.name));

        if (nodeG.empty()) {
            nodeG = _g.append('g')
                .attr('class', bubbleNodeClass)
                .attr('transform', 'translate(' + point.x + ',' + point.y + ')');
        }

        nodeG.datum(data[point.name]);

        return nodeG;
    }

    _chart._doRedraw = function () {
        updateBubbles();

        _chart.fadeDeselectedArea();

        return _chart;
    };

    function updateBubbles() {
        var data = mapData();

        _points.forEach(function (point) {
            var nodeG = getNodeG(point, data);

            var circle = nodeG.select('circle.' + BUBBLE_CLASS);

            transition(circle, _chart.transitionDuration())
                .attr('r', function (d) {
                    return _chart.bubbleR(d);
                })
                .attr('fill', _chart.getColor);

            _chart.doUpdateLabels(nodeG);

            _chart.doUpdateTitles(nodeG);
        });
    }

    _chart.debug = function (flag) {
        if (flag) {
            var debugG = _chart.select('g.' + constants.DEBUG_GROUP_CLASS);

            if (debugG.empty()) {
                debugG = _chart.svg()
                    .append('g')
                    .attr('class', constants.DEBUG_GROUP_CLASS);
            }

            var debugText = debugG.append('text')
                .attr('x', 10)
                .attr('y', 20);

            debugG
                .append('rect')
                .attr('width', _chart.width())
                .attr('height', _chart.height())
                .on('mousemove', function () {
                    var position = d3.mouse(debugG.node());
                    var msg = position[0] + ', ' + position[1];
                    debugText.text(msg);
                });
        } else {
            _chart.selectAll('.debug').remove();
        }

        return _chart;
    };

    _chart.anchor(root, chartGroup);

    return _chart;
};

export default bubbleOverlay;
