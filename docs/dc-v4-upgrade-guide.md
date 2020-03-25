# dc v4 Upgrade Guide

The underlying code has undergone heavy changes, but great care has been
taken to ensure API compatibility.

Typical usage of this library should see very little difference.
However sophisticated usage, including the ones that alter and extend
dc, are likely to need changes.

Please raise an issue on GitHub if you run into problems not covered here!

## Key changes

- The code base has been upgraded to ES6.
- As an implication, any browser that does not natively support ES6 (specifically
  Internet Explorer) is no longer supported. Use v3.x if you need legacy support.
- The library is distributed as a UMD bundle that can be used from any environment.
  It is friendly to bundlers like rollup and webpack.
- If you are using dc.js as ES6 modules, you do not need to prefix `dc`
  to classes and functions.
- When using in the web-browser via the script tag, the entire library is exposed
  within the `dc` namespace.
- `dc` no longer lists `crossfilter2` as npm dependency.
  As a side effect `dc` no longer exports `dc.crossfilter`.
  If your code relied on `dc.crossfilter`, please update your code to use `crossfilter` directly.

## Steps to upgrade

- Packages for some variables/classes have changed:

    - `dc.dateFormat` &#10137; `dc.config.dateFormat`
    - `dc.disableTransitions` &#10137; `dc.config.disableTransitions`
    - `dc.errors.InvalidStateException` &#10137; `dc.InvalidStateException`
    - `dc.errors.BadArgumentException` &#10137; `dc.BadArgumentException`

- Functions from `dc.round` have been removed.
  Please change as follows:

    - `dc.round.floor` &#10137; `Math.floor`
    - `dc.round.round` &#10137; `Math.round`
    - `dc.round.ceil` &#10137; `Math.ceil`

- The previous functions for instantiating charts are still supported.
  However, it is recommended to use the `new` operator instead. For example:

    - `dc.pieChart(parent, chartGroup)` &#10137; `new dc.PieChart(parent, chartGroup)`

- In dcv4, inside a `dc` chart functions expect `this` to be the chart
  instance. However `d3` sets it to the d3 element.
  This might cause failures in callbacks where a dc chart function
  is passed as a callback. For example, the following will fail in dcv4:

```javascript
chart.on('renderlet', function (_chart) {
    _chart.selectAll('rect.bar').on('click', _chart.onClick);
});
```

Change it to:

```javascript
chart.on('renderlet', function (_chart) {
    _chart.selectAll('rect.bar').on('click', d => _chart.onClick(d));
});
```

- The mixins no longer have instantiation functions:

    - the mixin classes must be instantiated with `new`
    - instead of passing a chart *instance* to be initialized, new classes extend mixins
    - the Bubble, Cap, and Color mixins take a base mixin *class* to extend
    - the CoordinateGrid, Margin, and Stack mixins extend the mixins they were used with in v3

  Old synonyms for the mixins from v1.0 have been removed.

  For example,

    - `var _chart = dc.bubbleMixin(dc.coordinateGridMixin({})` (or `dc.abstractBubbleChart`)\
    &#10137; `class ___ extends dc.BubbleMixin(dc.CoordinateGridMixin)`
    - `dc.baseMixin` (or `dc.baseChart`) &#10137; `new dc.BaseMixin`
    - `var _chart = dc.capMixin(dc.colorMixin(dc.baseMixin({})));` (or `dc.capped`, `dc.colorChart`))\
    &#10137; `class ___ extends dc.CapMixin(dc.ColorMixin(dc.BaseMixin))`
    - `var _chart = dc.coordinateGridMixin({})` (or `dc.coordinateGridChart`)\
    &#10137; `class ___ extends dc.CoordinateGridChart`
    - `var _chart = dc.colorMixin(dc.marginMixin(dc.baseMixin(_chart)))` (or `dc.marginable`)\
    &#10137; `class ___ extends dc.ColorMixin(dc.MarginMixin)`
    - `var _chart = dc.stackMixin(dc.coordinateGridMixin({}))` (or `dc.stackableChart`)\
    &#10137; `class ___ extends StackMixin`

  See [this commit in dc.leaflet.js](https://github.com/dc-js/dc.leaflet.js/commit/c086a04c1dbf879fca70195c0a2fdafbf191355c)
  (v0.5.0) for an example of using ES5 closure "classes" with dc@4.

- `dc.override` has been removed.
   It was used to override a method in an object (typically a chart).
   You can either create a derived class extending the chart class,
   or you can override specific methods on your instance of a chart, e.g.:

```javascript
        // Using inheritance
        class MyLineChart extends dc.LineChart {
            yAxisMin () {
                const ymin = super.yAxisMin();
                if(ymin < 0) ymin = 0;
                return ymin;
            }
        }
        const chart01 = new MyLineChart('#chart01');

        // Or, using direct assignment
        const chart02 = new dc.BarChart('#chart02');
        const super_yAxisMin = chart02.yAxisMin;
        chart02.yAxisMin = function() {
            const ymin = super_yAxisMin.call(this);
            if(ymin < 0) ymin = 0;
            return ymin;
        };
```
   Please see:
   http://dc-js.github.io/dc.js/examples/focus-dynamic-interval.html
   and http://dc-js.github.io/dc.js/examples/stacked-bar.html
   for example.

- [bower](https://bower.io/) support is dropped from version 4.0. Please use version 3.* for
   Bower support.
