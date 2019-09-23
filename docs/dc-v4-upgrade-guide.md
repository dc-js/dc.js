# dc v4 Upgrade Guide

## Key changes

Underlying code has been undergone heavy changed.
Great care has been taken to ensure API compatibility.
Typical usage of this library should see very little differences.
However sophisticated usage, including the ones that alter and extend
dc, are likely to need changes.
Please raise an issue if instructions in this guide are not sufficient
for your case. 

- The code base has been upgraded to ES6.
- As an implication, any browser that does not natively support ES6 is no supported.
- The library distributed as a UMD bundle that can be used from any environment.
  It is friendly to bundler like rollup and webpack.
- If you are using it as ES6 modules, you do not need to prefix `dc`
  to classes and functions.
- When using in the web-browser via script tag, entire library is exposed
  within `dc` namespace.

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

- The previous was of instantiating a chart is still supported.
  However new way is recommended. For example:
  
    - `dc.pieChart = (parent, chartGroup)` --> `new dc.PieChart(parent, chartGroup)`

- In dcv4, inside a `dc` chart functions set and expect `this` to be the chart
  instance. However `d3` sets it to the d3 element.
  This might cause failures in callbacks where dc chart function
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

- General advice, please prefer passing an => function as a callback.
