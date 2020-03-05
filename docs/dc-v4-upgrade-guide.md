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

    - `dc.dateFormat` --> `dc.config.dateFormat`
    - `dc.disableTransitions` --> `dc.config.disableTransitions`
    - `dc.errors.InvalidStateException` --> `dc.InvalidStateException`
    - `dc.errors.BadArgumentException` --> `dc.BadArgumentException`

- Functions from `dc.round` have been removed.
  Please change as follows:

    - `dc.round.floor` --> `Math.floor`
    - `dc.round.round` --> `Math.round`
    - `dc.round.ceil` --> `Math.ceil`

- The previous way of instantiating a chart is still supported.
  However, it is recommended to use the `new` operator instead. For example:

    - `dc.pieChart(parent, chartGroup)` --> `new dc.PieChart(parent, chartGroup)`

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

- The following synonyms (from the 2.0 migration) have been removed:

    - `dc.abstractBubbleChart` --> `dc.bubbleMixin`
    - `dc.baseChart` --> `dc.baseMixin`
    - `dc.capped` --> `dc.capMixin`
    - `dc.colorChart` --> `dc.colorMixin`
    - `dc.coordinateGridChart` --> `dc.coordinateGridMixin`
    - `dc.marginable` --> `dc.marginMixin`
    - `dc.stackableChart` --> `dc.stackMixin`

- `dc.override` has been removed.
   It was used to override a method in an object (typically a chart).
   You can either create a derived class extending the chart class,
   or you can override specific methods on your instance of a chart, e.g.:
   
```javascript
        // Using inheritance
        class MyLineChart extends dc.LineChart {
            yAxisMin () {
                // you can access super.yAxisMin() in this approach
                const min = d3.min(this.data(), layer => d3.min(layer.values, p => p.y + p.y0));
                return dc.utils.subtract(min, this.yAxisPadding());
            }
        }
        const chart01 = new MyLineChart('#chart01');
    
        // Or, using direct assignment
        const chart02 = new dc.BarChart('#chart02');
        chart02.yAxisMin = function() {
            const min = d3.min(this.data(), layer => d3.min(layer.values, p => p.y + p.y0));
            return dc.utils.subtract(min, this.yAxisPadding());
        };
```
   Please see: 
   http://dc-js.github.io/dc.js/examples/focus-dynamic-interval.html
   and http://dc-js.github.io/dc.js/examples/stacked-bar.html
   for example.

- [bower](https://bower.io/) support is dropped from version 4.0. Please use version 3.* for
   Bower support.
