### [Work in Progress]

The entire dc.js library is scoped under **dc** name space. It does not introduce anything else into the global name space.

### Function Chain
Majority of dc functions are designed to allow function chaining, meaning it will return the current chart instance whenever it is appropriate. Therefore configuration of a chart can be written in the following style.
```js
chart.width(300)
    .height(300)
    .filter("sunday")
```
The API references will highlight the fact if a particular function is not chainable.

## Base Chart [Abstract]
Base chart is an abstract functional object representing a basic dc chart object for all chart and widget implementation. Every function on base chart are also inherited available on all concrete chart implementation in dc library.

#### .width([value])
Set or get width attribute of a chart. If the value is given, then it will be used as the new width.

If no value specified then value of the current width attribute will be returned.

#### .height([value])
Set or get height attribute of a chart. If the value is given, then it will be used as the new height.

If no value specified then value of the current height attribute will be returned.

#### .dimension([value]) - **mandatory**
Set or get dimension attribute of a chart. In dc a dimension can be any valid [crossfilter dimension](https://github.com/square/crossfilter/wiki/API-Reference#wiki-dimension). If the value is given, then it will be used as the new dimension.

If no value specified then the current dimension will be returned.

#### .group([value]) - **mandatory**
Set or get group attribute of a chart. In dc a group is a [crossfilter group](https://github.com/square/crossfilter/wiki/API-Reference#wiki-group). Usually the group should be created from the particular dimension associated with the same chart. If the value is given, then it will be used as the new group.

If no value specified then the current group will be returned.

#### .filterAll()
Clear all filters associated with this chart.

#### .select(selector)
Execute in scope d3 single selection using the given selector and return d3 selection result. Roughly the same as:
```js
d3.select("#chart-id").select(selector);
```
This function is **not chainable** since it does not return a chart instance; however the d3 selection result is chainable from d3's perspective.

#### .selectAll(selector)
Execute in scope d3 selectAll using the given selector and return d3 selection result. Roughly the same as:
```js
d3.select("#chart-id").selectAll(selector);
```
This function is **not chainable** since it does not return a chart instance; however the d3 selection result is chainable from d3's perspective.

#### .root([rootElement])
Returns the root element where a chart resides. Usually it will be the parent div element where svg was created. You can also pass in a new root element however this is usually handled as part of the dc internal. Resetting root element on a chart outside of dc internal might have unexpected consequences.

#### .svg([svgElement])
Returns the top svg element for this specific chart. You can also pass in a new svg element however this is usually handled as part of the dc internal. Resetting svg element on a chart outside of dc internal might have unexpected consequences.

#### .filterPrinter([filterPrinterFunction])
Set or get filter printer function. Filter printer function is used to generate human friendly text for filter value(s) associated with the chart instance. By default dc charts shipped with a default filter printer implementation dc.printers.filter that provides simple printing support for both single value and ranged filters.

#### .turnOnControls() & .turnOffControls
Turn on/off optional control elements within the root element. dc.js currently support the following html control elements.
* root.selectAll(".reset") elements are turned on if the chart has an active filter. This type of control elements are usually used to store reset link to allow user to reset filter on a certain chart. This element will be turned off automatically if the filter is cleared.
* root.selectAll(".filter") elements are turned on if the chart has an active filter. The text content of this element is then replaced with the current filter value using the filter printer function. This type of element will be turned off automatically if the filter is cleared.

#### .transitionDuration([duration])
Set or get animation transition duration(in milliseconds) for specific chart instance. Default duration is 750ms.

#### .render()
Invoke this method will force the chart to re-render everything from scratch. Generally it should be only used to render the chart for the first time on the page or if you want to make sure everything is redrawn from scratch instead of relying on the default incremental redrawing behaviour.

#### .redraw()
Calling redraw will cause the chart to re-render delta in data change incrementally. If there is no change in the underlying data dimension then calling this method will have no effect on the chart. Most of the chart interaction in dc library will automatically trigger this method through its internal event engine, therefore you only need to manually invoke this function if data is manipulated outside of dc's control; for example if data is loaded on a periodic basis in the background using crossfilter.add().

#### .keyAccessor([keyAccessorFunction])
Set or get the key accessor function. Key accessor function is used to retrieve key value in crossfilter group. Key values are used differently in different charts, for example keys correspond to slices in pie chart and x axis position in grid coordinate chart.
```js
// default key accessor
chart.keyAccessor(function(d) { return d.key; });
// custom key accessor for a multi-value crossfilter reduction
chart.keyAccessor(function(p) { return p.value.absGain; });
```

#### .valueAccessor([valueAccessorFunction])
Set or get the value accessor function. Value accessor function is used to retrieve value in crossfilter group. Group values are used differently in different charts, for example group values correspond to slices size in pie chart and y axis position in grid coordinate chart.
```js
// default value accessor
chart.valueAccessor(function(d) { return d.value; });
// custom value accessor for a multi-value crossfilter reduction
chart.valueAccessor(function(p) { return p.value.percentageGain; });
```

#### .label([labelFunction])
Set or get the label function. Chart class will use this function to render label for each child element in the chart, i.e. a slice in a pie chart or a bubble in a bubble chart. Not every chart supports label function for example bar chart and line chart do not use this function at all.
```js
// default label function just return the key
chart.label(function(d) { return d.key; });
// label function has access to the standard d3 data binding and can get quite complicated
chart.label(function(d) { return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)"; });
```

#### .renderLabel(boolean)
Turn on/off label rendering

#### .title([titleFunction])
Set or get the title function. Chart class will use this function to render svg title(usually interrupted by browser as tooltips) for each child element in the chart, i.e. a slice in a pie chart or a bubble in a bubble chart. Almost every chart supports title function however in grid coordinate chart you need to turn off brush in order to use title otherwise the brush layer will block tooltip trigger.
```js
// default title function just return the key
chart.title(function(d) { return d.key + ": " + d.value; });
// title function has access to the standard d3 data binding and can get quite complicated
chart.title(function(p) {
    return p.key.getFullYear()
        + "\n"
        + "Index Gain: " + numberFormat(p.value.absGain) + "\n"
        + "Index Gain in Percentage: " + numberFormat(p.value.percentageGain) + "%\n"
        + "Fluctuation / Index Ratio: " + numberFormat(p.value.fluctuationPercentage) + "%";
});
```

#### .renderTitle(boolean)
Turn on/off title rendering

#### .renderlet(renderletFunction)
Renderlet is similar to an event listener on rendering event. Multiple renderlets can be added to an individual chart. Every time when chart is rerendered or redrawn renderlet then will be invoked right after the chart finishes its own drawing routine hence given you a way to override or modify certain behaviour. Renderlet function accepts the chart instance as the only input parameter and you can either rely on dc API or use raw d3 to achieve pretty much any effect.
```js
// renderlet function
chart.renderlet(function(chart){
    // mix of dc API and d3 manipulation
    chart.select("g.y").style("display", "none");
    // its a closure so you can also access other chart variable available in the closure scope
    moveChart.filter(chart.filter());
});
```

## Color Chart [Abstract]
Color chart is an abstract chart functional class created to provide universal coloring support as a mix-in for any concrete chart implementation.

#### .colors([colorScale or colorArray])
Retrieve current color scale or set a new color scale. This function accepts both d3 color scale and arbitrary color array. By default d3.scale.category20c() is used.
```js
// color scale
chart.colors(d3.scale.category20b());
// arbitrary color array
chart.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"]);
```

#### .colorAccessor([colorAccessorFunction])
Set or get color accessor function. This function will be used to map a data point on crossfilter group to a specific color value on the color scale. Default implementation of this function simply returns the next color on the scale using the index of a group.
```js
// default index based color accessor
.colorAccessor(function(d, i){return i;})
// color accessor for a multi-value crossfilter reduction
.colorAccessor(function(d){return d.value.absGain;})
```

#### .colorDomain([domain])
Set or get the current domain for the color mapping function. This allows user to provide a custom domain for the mapping function used to map the return value of the colorAccessor function to the target color range calculated based on the color scale.
```js
// custom domain for month of year
chart.colorDomain([0, 11])
// custom domain for day of year
chart.colorDomain([0, 364])
```

## Single Selection Chart [Abstract]
Single selection chart is an abstract functional class created to provide cross-chart support for single value filtering capability.

#### .filter([filterValue])
Filter the chart by the given value or return the current filter if the input parameter is missing.
```js
// filter by a single string
chart.filter("Sunday");
// filter by a single age
chart.filter(18);
```

#### .hasFilter()
Check whether is an active filter associated with particular chart instance. This function is **not chainable**.

## Stackable Chart [Abstract]
Stackable chart is an abstract chart introduced to provide cross-chart support of stackability. Concrete implementation of charts can then selectively mix-in this capability.

#### .stack(group[, retriever])
Stack a new crossfilter group into this chart with optionally a custom value retriever. All stacks in the same chart will share the same key accessor therefore share the same set of keys. In more concrete words, imagine in a stacked bar chart all bars will be positioned using the same set of keys on the x axis while stacked vertically.
```js
// stack group using default accessor
chart.stack(valueSumGroup)
// stack group using custom accessor
.stack(avgByDayGroup, function(d){return d.value.avgByDay;});
```

## CoordinateGrid Chart [Abstract] < Base Chart
Coordinate grid chart is an abstract base chart designed to support a number of coordinate grid based concrete chart types, i.e. bar chart, line chart, and bubble chart.

#### .g([gElement])
Get or set the root g element. This method is usually used to retrieve the g element in order to overlay custom svg drawing programatically. **Caution**: The root g element is usually generated by the dc.js internals, and resetting it might produce unpredictable result.

#### .margins([margins])
Get or set the margins for a particular coordinate grid chart instance. The margins is stored as an associative Javascript array. Default margins: {top: 10, right: 50, bottom: 30, left: 30}.

#### .x([xScale]) - **mandatory**
Get or set the x scale. x scale is typically a time scale for histogram or a d3 linear/ordinal scale for visualizing data distribution.
```js
// set x to a linear scale
chart.x(d3.scale.linear().domain([-2500, 2500]))
// set x to a time scale to generate histogram
chart.x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
```

#### .xUnits([xUnits function])
Set or get the xUnits function. xUnits function is the coordinate grid chart uses to calculate number of data projections on x axis such as number bars for a bar chart and number of dots for a line chart. This function is expected to return an Javascript array of all data points on x axis. d3 time range functions d3.time.days, d3.time.months, and d3.time.years are all valid xUnits function. dc.js also provides a simple dc.units.integers function to support linear sequential units in integer. Default xUnits function is dc.units.integers.
```js
// set x units to day for a histogram
chart.xUnits(d3.time.days);
// set x units to month for a histogram
chart.xUnits(d3.time.months);
```

#### .round([rounding function])
Set or get the rounding function for x axis. Rounding is mainly used to provide stepping capability when in place selection based filter is enable.
```js
// set x unit round to by month, this will make sure range selection brash will
// extend on a month-by-month basis
chart.round(d3.time.month.round);
```

#### .xAxis([xAxis])
Set or get the x axis used by a particular coordinate grid chart instance. This function is most useful when certain x axis customization is required. x axis in dc.js is simply an instance of [d3 axis object](https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-_axis) therefore it supports any valid d3 axis manipulation. **Caution**: The x axis is typically generated by the chart internal, resetting it might cause unexpected outcome.
```js
// customize x axis tick format
chart.xAxis().tickFormat(function(v) {return v + "%";});
// customize x axis tick values
chart.xAxis().tickValues([0, 100, 200, 300]);
```

#### .elasticX([boolean])
Turn on/off elastic x axis. If x axis elasticity is turned on, then the grid chart will attempt to generate and recalculate x axis range whenever redraw event is triggered.

#### .xAxisPadding([padding])
Set or get x axis padding when elastic x axis is turned on. The padding will be added to both end of the x axis if and only if elasticX is turned on otherwise it will be simply ignored.

#### .y([yScale])
Get or set the y scale. y scale is typically automatically generated by the chart implementation.

#### .yAxis([yAxis])
Set or get the y axis used by a particular coordinate grid chart instance. This function is most useful when certain y axis customization is required. y axis in dc.js is simply an instance of [d3 axis object](https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-_axis) therefore it supports any valid d3 axis manipulation. **Caution**: The y axis is typically generated by the chart internal, resetting it might cause unexpected outcome.
```js
// customize y axis tick format
chart.yAxis().tickFormat(function(v) {return v + "%";});
// customize y axis tick values
chart.yAxis().tickValues([0, 100, 200, 300]);
```

#### .elasticY([boolean])
Turn on/off elastic y axis. If y axis elasticity is turned on, then the grid chart will attempt to generate and recalculate y axis range whenever redraw event is triggered.

#### .yAxisPadding([padding])
Set or get y axis padding when elastic y axis is turned on. The padding will be added to the top of the y axis if and only if elasticY is turned on otherwise it will be simply ignored.

#### .renderHorizontalGridLines([boolean])
Turn on/off horizontal grid lines.

#### .renderVerticalGridLines([boolean])
Turn on/off vertical grid lines.

#### .brushOn([boolean])
Turn on/off the brush based in-place range filter. When the brush is on then user will be able to  simply drag the mouse across the chart to perform range filtering based on the extend of the brush. However turning on brush filter will essentially disable other interactive elements on the chart such as the highlighting, tooltip, and reference lines on a chart. Default value is "true".

## Pie Chart [Concrete] < Single Selection Chart < Color Chart < Base Chart
This chart is a concrete pie chart implementation usually used to visualize small number of categorical distributions. Pie chart implementation uses keyAccessor to generate slices, and valueAccessor to calculate the size of each slice(key) relatively to the total sum of all values.

#### .radius([radius])
Get or set the radius on a particular pie chart instance. Default radius is 90px.

#### .innerRadius([innerRadius])
Get or set the inner radius on a particular pie chart instance. If inner radius is greater than 0px then the pie chart will be essentially rendered as a donut chart. Default inner radius is 0px.

#### .cx()
Get center x coordinate position. This function is **not chainable**.

#### .cy()
Get center y coordinate position. This function is **not chainable**.

#### .minAngelForLabel([minAngle])
Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not render slice label. Default min angel is 0.5.
