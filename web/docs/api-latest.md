<a name="dc"></a>
## dc : <code>object</code>
The entire dc.js library is scoped under the **dc** name space. It does not introduce
anything else into the global name space.

Most `dc` functions are designed to allow function chaining, meaning they return the current chart
instance whenever it is appropriate.  The getter forms of functions do not participate in function
chaining because they necessarily return values that are not the chart.  Although some,
such as `.svg` and `.xAxis`, return values that are chainable d3 objects.

**Kind**: global namespace  
**Version**: &lt;%= conf.pkg.version %&gt;  
**Example**  
```js
// Example chaining
chart.width(300)
     .height(300)
     .filter('sunday');
```

* [dc](#dc) : <code>object</code>
  * [.baseMixin](#dc.baseMixin) ⇒ <code>Chart</code>
    * [.width](#dc.baseMixin+width) ⇒ <code>Number</code>
    * [.height](#dc.baseMixin+height) ⇒ <code>Number</code>
    * [.minWidth](#dc.baseMixin+minWidth) ⇒ <code>Number</code>
    * [.minHeight](#dc.baseMixin+minHeight) ⇒ <code>Number</code>
    * [.dimension](#dc.baseMixin+dimension) ⇒ <code>Dimension</code>
    * [.data](#dc.baseMixin+data) ⇒ <code>\*</code>
    * [.group](#dc.baseMixin+group) ⇒ <code>Group</code>
    * [.ordering](#dc.baseMixin+ordering) ⇒ <code>function</code>
    * [.filterAll](#dc.baseMixin+filterAll) ⇒ <code>Chart</code>
    * [.select](#dc.baseMixin+select) ⇒ <code>Selection</code>
    * [.selectAll](#dc.baseMixin+selectAll) ⇒ <code>Selection</code>
    * [.anchor](#dc.baseMixin+anchor) ⇒ <code>Chart</code>
    * [.anchorName](#dc.baseMixin+anchorName) ⇒ <code>String</code>
    * [.root](#dc.baseMixin+root) ⇒ <code>Element</code>
    * [.svg](#dc.baseMixin+svg) ⇒ <code>SVGElement</code>
    * [.resetSvg](#dc.baseMixin+resetSvg) ⇒ <code>SVGElement</code>
    * [.filterPrinter](#dc.baseMixin+filterPrinter) ⇒ <code>function</code>
    * [.turnOnControls](#dc.baseMixin+turnOnControls) ⇒ <code>Chart</code>
    * [.turnOffControls](#dc.baseMixin+turnOffControls) ⇒ <code>Chart</code>
    * [.transitionDuration](#dc.baseMixin+transitionDuration) ⇒ <code>Number</code>
    * [.render](#dc.baseMixin+render) ⇒ <code>Chart</code>
    * [.redraw](#dc.baseMixin+redraw) ⇒ <code>Chart</code>
    * [.hasFilterHandler](#dc.baseMixin+hasFilterHandler) ⇒ <code>Chart</code>
    * [.hasFilter](#dc.baseMixin+hasFilter) ⇒ <code>Boolean</code>
    * [.removeFilterHandler](#dc.baseMixin+removeFilterHandler) ⇒ <code>Chart</code>
    * [.addFilterHandler](#dc.baseMixin+addFilterHandler) ⇒ <code>Chart</code>
    * [.resetFilterHandler](#dc.baseMixin+resetFilterHandler) ⇒ <code>Chart</code>
    * [.filter](#dc.baseMixin+filter) ⇒ <code>Chart</code>
    * [.filters](#dc.baseMixin+filters) ⇒ <code>Array.&lt;\*&gt;</code>
    * [.onClick](#dc.baseMixin+onClick)
    * [.filterHandler](#dc.baseMixin+filterHandler) ⇒ <code>Chart</code>
    * [.keyAccessor](#dc.baseMixin+keyAccessor) ⇒ <code>Chart</code>
    * [.valueAccessor](#dc.baseMixin+valueAccessor) ⇒ <code>Chart</code>
    * [.label](#dc.baseMixin+label) ⇒ <code>Chart</code>
    * [.renderLabel](#dc.baseMixin+renderLabel) ⇒ <code>Boolean</code>
    * [.title](#dc.baseMixin+title) ⇒ <code>function</code>
    * [.renderTitle](#dc.baseMixin+renderTitle) ⇒ <code>Boolean</code>
    * ~~[.renderlet](#dc.baseMixin+renderlet) ⇒ <code>function</code>~~
    * [.chartGroup](#dc.baseMixin+chartGroup) ⇒ <code>String</code>
    * [.expireCache](#dc.baseMixin+expireCache) ⇒ <code>Chart</code>
    * [.legend](#dc.baseMixin+legend) ⇒ <code>[legend](#dc.legend)</code>
    * [.chartID](#dc.baseMixin+chartID) ⇒ <code>String</code>
    * [.options](#dc.baseMixin+options) ⇒ <code>Chart</code>
    * [.on](#dc.baseMixin+on) ⇒ <code>Chart</code>
  * [.bubbleMixin](#dc.bubbleMixin) ⇒ <code>Chart</code>
    * [.r](#dc.bubbleMixin+r) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.radiusValueAccessor](#dc.bubbleMixin+radiusValueAccessor) ⇒ <code>function</code>
    * [.minRadiusWithLabel](#dc.bubbleMixin+minRadiusWithLabel) ⇒ <code>Number</code>
    * [.maxBubbleRelativeSize](#dc.bubbleMixin+maxBubbleRelativeSize) ⇒ <code>Number</code>
  * [.capMixin](#dc.capMixin) ⇒ <code>Chart</code>
    * [.cap](#dc.capMixin+cap) ⇒ <code>Number</code>
    * [.othersLabel](#dc.capMixin+othersLabel) ⇒ <code>String</code>
    * [.othersGrouper](#dc.capMixin+othersGrouper) ⇒ <code>function</code>
  * [.colorMixin](#dc.colorMixin) ⇒ <code>Chart</code>
    * [.colors](#dc.colorMixin+colors) ⇒ <code>Chart</code>
    * [.ordinalColors](#dc.colorMixin+ordinalColors) ⇒ <code>Chart</code>
    * [.linearColors](#dc.colorMixin+linearColors) ⇒ <code>Chart</code>
    * [.linearColors](#dc.colorMixin+linearColors) ⇒ <code>function</code>
    * [.colorDomain](#dc.colorMixin+colorDomain) ⇒ <code>function</code>
    * [.calculateColorDomain](#dc.colorMixin+calculateColorDomain) ⇒ <code>Chart</code>
    * [.getColor](#dc.colorMixin+getColor) ⇒ <code>String</code>
    * [.colorCalculator](#dc.colorMixin+colorCalculator) ⇒ <code>\*</code>
  * [.marginMixin](#dc.marginMixin) ⇒ <code>Chart</code>
    * [.margins](#dc.marginMixin+margins) ⇒ <code>Chart</code>
  * [.stackMixin](#dc.stackMixin) ⇒ <code>Chart</code>
    * [.stack](#dc.stackMixin+stack) ⇒ <code>Chart</code>
    * [.hidableStacks](#dc.stackMixin+hidableStacks) ⇒ <code>Chart</code>
    * [.hideStack](#dc.stackMixin+hideStack) ⇒ <code>Chart</code>
    * [.showStack](#dc.stackMixin+showStack) ⇒ <code>Chart</code>
    * [.title](#dc.stackMixin+title) ⇒ <code>Chart</code>
    * [.stackLayout](#dc.stackMixin+stackLayout) ⇒ <code>Chart</code>
  * [.barChart](#dc.barChart) ⇒ <code>BarChart</code>
    * [.centerBar](#dc.barChart+centerBar) ⇒ <code>Boolean</code>
    * [.barPadding](#dc.barChart+barPadding) ⇒ <code>Number</code>
    * [.outerPadding](#dc.barChart+outerPadding) ⇒ <code>Number</code>
    * [.gap](#dc.barChart+gap) ⇒ <code>Number</code>
    * [.alwaysUseRounding](#dc.barChart+alwaysUseRounding) ⇒ <code>Boolean</code>
  * [.boxPlot](#dc.boxPlot) ⇒ <code>BoxPlot</code>
    * [.boxPadding](#dc.boxPlot+boxPadding) ⇒ <code>Number</code>
    * [.outerPadding](#dc.boxPlot+outerPadding) ⇒ <code>Number</code>
    * [.boxWidth](#dc.boxPlot+boxWidth) ⇒ <code>Number</code> &#124; <code>function</code>
    * [.tickFormat](#dc.boxPlot+tickFormat) ⇒ <code>Number</code> &#124; <code>function</code>
  * [.bubbleChart](#dc.bubbleChart) ⇒ <code>BubbleChart</code>
    * [.elasticRadius](#dc.bubbleChart+elasticRadius) ⇒ <code>Boolean</code>
  * [.bubbleOverlay](#dc.bubbleOverlay) ⇒ <code>BubbleOverlay</code>
    * [.svg](#dc.bubbleOverlay+svg) ⇒ <code>Chart</code>
    * [.point](#dc.bubbleOverlay+point) ⇒ <code>Chart</code>
  * [.filterAll](#dc.filterAll)
  * [.refocusAll](#dc.refocusAll)
  * [.renderAll](#dc.renderAll)
  * [.redrawAll](#dc.redrawAll)
  * [.disableTransitions](#dc.disableTransitions) : <code>Boolean</code>
  * [.units](#dc.units) : <code>Object</code>
    * [.integers](#dc.units.integers) ⇒ <code>Number</code>
    * [.ordinal](#dc.units.ordinal) ⇒ <code>Array.&lt;String&gt;</code>
    * [.fp](#dc.units.fp) : <code>Object</code>
      * [.precision](#dc.units.fp.precision) ⇒ <code>function</code>
  * [.geoChoroplethChart](#dc.geoChoroplethChart) ⇒ <code>GeoChoroplethChart</code>
    * [.overlayGeoJson](#dc.geoChoroplethChart+overlayGeoJson) ⇒ <code>Chart</code>
    * [.projection](#dc.geoChoroplethChart+projection) ⇒ <code>Chart</code>
    * [.geoJsons](#dc.geoChoroplethChart+geoJsons) ⇒ <code>Array.&lt;{name:String, data: Object, accessor: function()}&gt;</code>
    * [.geoPath](#dc.geoChoroplethChart+geoPath) ⇒ <code>d3.geo.path</code>
    * [.removeGeoJson](#dc.geoChoroplethChart+removeGeoJson) ⇒ <code>Chart</code>
  * [.heatMap](#dc.heatMap) ⇒ <code>HeatMap</code>
    * [.colsLabel](#dc.heatMap+colsLabel) ⇒ <code>Chart</code>
    * [.rowsLabel](#dc.heatMap+rowsLabel) ⇒ <code>Chart</code>
    * [.rows](#dc.heatMap+rows) ⇒ <code>Chart</code>
    * [.cols](#dc.heatMap+cols) ⇒ <code>Chart</code>
    * [.boxOnClick](#dc.heatMap+boxOnClick) ⇒ <code>Chart</code>
    * [.xAxisOnClick](#dc.heatMap+xAxisOnClick) ⇒ <code>Chart</code>
    * [.yAxisOnClick](#dc.heatMap+yAxisOnClick) ⇒ <code>Chart</code>
    * [.xBorderRadius](#dc.heatMap+xBorderRadius) ⇒ <code>Chart</code>
    * [.yBorderRadius](#dc.heatMap+yBorderRadius) ⇒ <code>Chart</code>
  * [.legend](#dc.legend) ⇒ <code>Legend</code>
    * [.x](#dc.legend+x) ⇒ <code>Legend</code>
    * [.y](#dc.legend+y) ⇒ <code>Legend</code>
    * [.gap](#dc.legend+gap) ⇒ <code>Legend</code>
    * [.itemHeight](#dc.legend+itemHeight) ⇒ <code>Legend</code>
    * [.horizontal](#dc.legend+horizontal) ⇒ <code>Legend</code>
    * [.legendWidth](#dc.legend+legendWidth) ⇒ <code>Legend</code>
    * [.itemWidth](#dc.legend+itemWidth) ⇒ <code>Legend</code>
    * [.autoItemWidth](#dc.legend+autoItemWidth) ⇒ <code>Legend</code>
  * [.lineChart](#dc.lineChart) ⇒ <code>LineChart</code>
    * [.interpolate](#dc.lineChart+interpolate) ⇒ <code>Chart</code>
    * [.tension](#dc.lineChart+tension) ⇒ <code>Chart</code>
    * [.defined](#dc.lineChart+defined) ⇒ <code>Chart</code>
    * [.dashStyle](#dc.lineChart+dashStyle) ⇒ <code>Chart</code>
    * [.renderArea](#dc.lineChart+renderArea) ⇒ <code>Chart</code>
    * [.xyTipsOn](#dc.lineChart+xyTipsOn) ⇒ <code>Chart</code>
    * [.dotRadius](#dc.lineChart+dotRadius) ⇒ <code>Chart</code>
    * [.renderDataPoints](#dc.lineChart+renderDataPoints) ⇒ <code>Chart</code>
  * [.numberDisplay](#dc.numberDisplay) ⇒ <code>NumberDisplay</code>
    * [.html](#dc.numberDisplay+html) ⇒ <code>Chart</code>
    * [.value](#dc.numberDisplay+value) ⇒ <code>Number</code>
    * [.formatNumber](#dc.numberDisplay+formatNumber) ⇒ <code>Chart</code>
  * [.pieChart](#dc.pieChart) ⇒ <code>PieChart</code>
    * [.slicesCap](#dc.pieChart+slicesCap) ⇒ <code>Chart</code>
    * [.externalRadiusPadding](#dc.pieChart+externalRadiusPadding) ⇒ <code>Chart</code>
    * [.innerRadius](#dc.pieChart+innerRadius) ⇒ <code>Chart</code>
    * [.radius](#dc.pieChart+radius) ⇒ <code>Chart</code>
    * [.cx](#dc.pieChart+cx) ⇒ <code>Chart</code>
    * [.cy](#dc.pieChart+cy) ⇒ <code>Chart</code>
    * [.minAngleForLabel](#dc.pieChart+minAngleForLabel) ⇒ <code>Chart</code>
    * [.emptyTitle](#dc.pieChart+emptyTitle) ⇒ <code>Chart</code>
    * [.externalLabels](#dc.pieChart+externalLabels) ⇒ <code>Chart</code>
  * [.rowChart](#dc.rowChart) ⇒ <code>RowChart</code>
    * [.x](#dc.rowChart+x) ⇒ <code>Chart</code>
    * [.renderTitleLabel](#dc.rowChart+renderTitleLabel) ⇒ <code>Chart</code>
    * [.xAxis](#dc.rowChart+xAxis) ⇒ <code>d3.svg.Axis</code>
    * [.fixedBarHeight](#dc.rowChart+fixedBarHeight) ⇒ <code>Chart</code>
    * [.gap](#dc.rowChart+gap) ⇒ <code>Chart</code>
    * [.elasticX](#dc.rowChart+elasticX) ⇒ <code>Chart</code>
    * [.labelOffsetX](#dc.rowChart+labelOffsetX) ⇒ <code>Chart</code>
    * [.labelOffsetY](#dc.rowChart+labelOffsetY) ⇒ <code>Chart</code>
    * [.titleLabelOffsetX](#dc.rowChart+titleLabelOffsetX) ⇒ <code>Chart</code>
  * [.scatterPlot](#dc.scatterPlot) ⇒ <code>SeriesChart</code>
    * [.existenceAccessor](#dc.scatterPlot+existenceAccessor) ⇒ <code>Chart</code>
    * [.symbol](#dc.scatterPlot+symbol) ⇒ <code>Chart</code>
    * [.symbolSize](#dc.scatterPlot+symbolSize) ⇒ <code>Chart</code>
    * [.highlightedSize](#dc.scatterPlot+highlightedSize) ⇒ <code>Chart</code>
    * [.hiddenSize](#dc.scatterPlot+hiddenSize) ⇒ <code>Chart</code>
  * [.seriesChart](#dc.seriesChart) ⇒ <code>SeriesChart</code>
    * [.chart](#dc.seriesChart+chart) ⇒ <code>Chart</code>
    * [.seriesAccessor](#dc.seriesChart+seriesAccessor) ⇒ <code>Chart</code>
    * [.seriesSort](#dc.seriesChart+seriesSort) ⇒ <code>Chart</code>
    * [.valueSort](#dc.seriesChart+valueSort) ⇒ <code>Chart</code>

<a name="dc.baseMixin"></a>
### dc.baseMixin ⇒ <code>Chart</code>
Base Mixin is an abstract functional object representing a basic dc chart object
for all chart and widget implementations. Methods from the Base Mixin are inherited
and available on all chart implementation in the DC library.

**Kind**: static mixin of <code>[dc](#dc)</code>  

| Param | Type |
| --- | --- |
| _chart | <code>Chart</code> | 


* [.baseMixin](#dc.baseMixin) ⇒ <code>Chart</code>
  * [.width](#dc.baseMixin+width) ⇒ <code>Number</code>
  * [.height](#dc.baseMixin+height) ⇒ <code>Number</code>
  * [.minWidth](#dc.baseMixin+minWidth) ⇒ <code>Number</code>
  * [.minHeight](#dc.baseMixin+minHeight) ⇒ <code>Number</code>
  * [.dimension](#dc.baseMixin+dimension) ⇒ <code>Dimension</code>
  * [.data](#dc.baseMixin+data) ⇒ <code>\*</code>
  * [.group](#dc.baseMixin+group) ⇒ <code>Group</code>
  * [.ordering](#dc.baseMixin+ordering) ⇒ <code>function</code>
  * [.filterAll](#dc.baseMixin+filterAll) ⇒ <code>Chart</code>
  * [.select](#dc.baseMixin+select) ⇒ <code>Selection</code>
  * [.selectAll](#dc.baseMixin+selectAll) ⇒ <code>Selection</code>
  * [.anchor](#dc.baseMixin+anchor) ⇒ <code>Chart</code>
  * [.anchorName](#dc.baseMixin+anchorName) ⇒ <code>String</code>
  * [.root](#dc.baseMixin+root) ⇒ <code>Element</code>
  * [.svg](#dc.baseMixin+svg) ⇒ <code>SVGElement</code>
  * [.resetSvg](#dc.baseMixin+resetSvg) ⇒ <code>SVGElement</code>
  * [.filterPrinter](#dc.baseMixin+filterPrinter) ⇒ <code>function</code>
  * [.turnOnControls](#dc.baseMixin+turnOnControls) ⇒ <code>Chart</code>
  * [.turnOffControls](#dc.baseMixin+turnOffControls) ⇒ <code>Chart</code>
  * [.transitionDuration](#dc.baseMixin+transitionDuration) ⇒ <code>Number</code>
  * [.render](#dc.baseMixin+render) ⇒ <code>Chart</code>
  * [.redraw](#dc.baseMixin+redraw) ⇒ <code>Chart</code>
  * [.hasFilterHandler](#dc.baseMixin+hasFilterHandler) ⇒ <code>Chart</code>
  * [.hasFilter](#dc.baseMixin+hasFilter) ⇒ <code>Boolean</code>
  * [.removeFilterHandler](#dc.baseMixin+removeFilterHandler) ⇒ <code>Chart</code>
  * [.addFilterHandler](#dc.baseMixin+addFilterHandler) ⇒ <code>Chart</code>
  * [.resetFilterHandler](#dc.baseMixin+resetFilterHandler) ⇒ <code>Chart</code>
  * [.filter](#dc.baseMixin+filter) ⇒ <code>Chart</code>
  * [.filters](#dc.baseMixin+filters) ⇒ <code>Array.&lt;\*&gt;</code>
  * [.onClick](#dc.baseMixin+onClick)
  * [.filterHandler](#dc.baseMixin+filterHandler) ⇒ <code>Chart</code>
  * [.keyAccessor](#dc.baseMixin+keyAccessor) ⇒ <code>Chart</code>
  * [.valueAccessor](#dc.baseMixin+valueAccessor) ⇒ <code>Chart</code>
  * [.label](#dc.baseMixin+label) ⇒ <code>Chart</code>
  * [.renderLabel](#dc.baseMixin+renderLabel) ⇒ <code>Boolean</code>
  * [.title](#dc.baseMixin+title) ⇒ <code>function</code>
  * [.renderTitle](#dc.baseMixin+renderTitle) ⇒ <code>Boolean</code>
  * ~~[.renderlet](#dc.baseMixin+renderlet) ⇒ <code>function</code>~~
  * [.chartGroup](#dc.baseMixin+chartGroup) ⇒ <code>String</code>
  * [.expireCache](#dc.baseMixin+expireCache) ⇒ <code>Chart</code>
  * [.legend](#dc.baseMixin+legend) ⇒ <code>[legend](#dc.legend)</code>
  * [.chartID](#dc.baseMixin+chartID) ⇒ <code>String</code>
  * [.options](#dc.baseMixin+options) ⇒ <code>Chart</code>
  * [.on](#dc.baseMixin+on) ⇒ <code>Chart</code>

<a name="dc.baseMixin+width"></a>
#### baseMixin.width ⇒ <code>Number</code>
Set or get the width attribute of a chart. See `.height` below for further description of the
behavior.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| w | <code>Number</code> &#124; <code>function</code> | 

<a name="dc.baseMixin+height"></a>
#### baseMixin.height ⇒ <code>Number</code>
Set or get the height attribute of a chart. The height is applied to the SVG element generated by
the chart when rendered (or rerendered). If a value is given, then it will be used to calculate
the new height and the chart returned for method chaining.  The value can either be a numeric, a
function, or falsy. If no value is specified then the value of the current height attribute will
be returned.

By default, without an explicit height being given, the chart will select the width of its
anchor element. If that isn't possible it defaults to 200. Setting the value falsy will return
the chart to the default behavior

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| h | <code>Number</code> &#124; <code>function</code> | 

**Example**  
```js
chart.height(250); // Set the chart's height to 250px;
chart.height(function(anchor) { return doSomethingWith(anchor); }); // set the chart's height with a function
chart.height(null); // reset the height to the default auto calculation
```
<a name="dc.baseMixin+minWidth"></a>
#### baseMixin.minWidth ⇒ <code>Number</code>
Set or get the minimum width attribute of a chart. This only applicable if the width is
calculated by dc.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| w | <code>Number</code> | 

<a name="dc.baseMixin+minHeight"></a>
#### baseMixin.minHeight ⇒ <code>Number</code>
Set or get the minimum height attribute of a chart. This only applicable if the height is
calculated by dc.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| h | <code>Number</code> | 

<a name="dc.baseMixin+dimension"></a>
#### baseMixin.dimension ⇒ <code>Dimension</code>
**mandatory**

Set or get the dimension attribute of a chart. In dc a dimension can be any valid [crossfilter
dimension](https://github.com/square/crossfilter/wiki/API-Reference#wiki-dimension).

If a value is given, then it will be used as the new dimension. If no value is specified then
the current dimension will be returned.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| d | <code>Dimension</code> | 

<a name="dc.baseMixin+data"></a>
#### baseMixin.data ⇒ <code>\*</code>
Set the data callback or retrieve the chart's data set. The data callback is passed the chart's
group and by default will return `group.all()`. This behavior may be modified to, for instance,
return only the top 5 groups.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [callback] | <code>function</code> | 

**Example**  
```js
chart.data(function(group) {
    return group.top(5);
});
```
<a name="dc.baseMixin+group"></a>
#### baseMixin.group ⇒ <code>Group</code>
**mandatory**

Set or get the group attribute of a chart. In dc a group is a [crossfilter
group](https://github.com/square/crossfilter/wiki/API-Reference#wiki-group). Usually the group
should be created from the particular dimension associated with the same chart. If a value is
given, then it will be used as the new group.

If no value specified then the current group will be returned.
If `name` is specified then it will be used to generate legend label.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [group] | <code>Group</code> | 
| [name] | <code>String</code> | 

<a name="dc.baseMixin+ordering"></a>
#### baseMixin.ordering ⇒ <code>function</code>
Get or set an accessor to order ordinal charts

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [orderFunction] | <code>function</code> | 

<a name="dc.baseMixin+filterAll"></a>
#### baseMixin.filterAll ⇒ <code>Chart</code>
Clear all filters associated with this chart.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+select"></a>
#### baseMixin.select ⇒ <code>Selection</code>
Execute d3 single selection in the chart's scope using the given selector and return the d3
selection.

This function is **not chainable** since it does not return a chart instance; however the d3
selection result can be chained to d3 function calls.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
**Example**  
```js
// Similar to:
d3.select('#chart-id').select(selector);
```
<a name="dc.baseMixin+selectAll"></a>
#### baseMixin.selectAll ⇒ <code>Selection</code>
Execute in scope d3 selectAll using the given selector and return d3 selection result.

This function is **not chainable** since it does not return a chart instance; however the d3
selection result can be chained to d3 function calls.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
**Example**  
```js
// Similar to:
d3.select('#chart-id').selectAll(selector);
```
<a name="dc.baseMixin+anchor"></a>
#### baseMixin.anchor ⇒ <code>Chart</code>
Set the svg root to either be an existing chart's root; or any valid [d3 single
selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom
block element such as a div; or a dom element or d3 selection. Optionally registers the chart
within the chartGroup. This class is called internally on chart initialization, but be called
again to relocate the chart. However, it will orphan any previously created SVG elements.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [a] | <code>anchorChart</code> &#124; <code>anchorSelector</code> &#124; <code>anchorNode</code> | 
| [chartGroup] | <code>chartGroup</code> | 

<a name="dc.baseMixin+anchorName"></a>
#### baseMixin.anchorName ⇒ <code>String</code>
Returns the dom id for the chart's anchored location.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+root"></a>
#### baseMixin.root ⇒ <code>Element</code>
Returns the root element where a chart resides. Usually it will be the parent div element where
the svg was created. You can also pass in a new root element however this is usually handled by
dc internally. Resetting the root element on a chart outside of dc internals may have
unexpected consequences.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [rootElement] | <code>Element</code> | 

<a name="dc.baseMixin+svg"></a>
#### baseMixin.svg ⇒ <code>SVGElement</code>
Returns the top svg element for this specific chart. You can also pass in a new svg element,
however this is usually handled by dc internally. Resetting the svg element on a chart outside
of dc internals may have unexpected consequences.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [svgElement] | <code>SVGElement</code> | 

<a name="dc.baseMixin+resetSvg"></a>
#### baseMixin.resetSvg ⇒ <code>SVGElement</code>
Remove the chart's SVG elements from the dom and recreate the container SVG element.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+filterPrinter"></a>
#### baseMixin.filterPrinter ⇒ <code>function</code>
Set or get the filter printer function. The filter printer function is used to generate human
friendly text for filter value(s) associated with the chart instance. By default dc charts use a
default filter printer `dc.printers.filter` that provides simple printing support for both
single value and ranged filters.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [filterPrinterFunction] | <code>function</code> | 

<a name="dc.baseMixin+turnOnControls"></a>
#### baseMixin.turnOnControls ⇒ <code>Chart</code>
Turn on optional control elements within the root element. dc currently supports the
following html control elements.
* root.selectAll('.reset') - elements are turned on if the chart has an active filter. This type
of control element is usually used to store a reset link to allow user to reset filter on a
certain chart. This element will be turned off automatically if the filter is cleared.
* root.selectAll('.filter') elements are turned on if the chart has an active filter. The text
content of this element is then replaced with the current filter value using the filter printer
function. This type of element will be turned off automatically if the filter is cleared.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+turnOffControls"></a>
#### baseMixin.turnOffControls ⇒ <code>Chart</code>
Turn off optional control elements within the root element.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+transitionDuration"></a>
#### baseMixin.transitionDuration ⇒ <code>Number</code>
Set or get the animation transition duration (in milliseconds) for this chart instance.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [duration] | <code>Number</code> | 

<a name="dc.baseMixin+render"></a>
#### baseMixin.render ⇒ <code>Chart</code>
Invoking this method will force the chart to re-render everything from scratch. Generally it
should only be used to render the chart for the first time on the page or if you want to make
sure everything is redrawn from scratch instead of relying on the default incremental redrawing
behaviour.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+redraw"></a>
#### baseMixin.redraw ⇒ <code>Chart</code>
Calling redraw will cause the chart to re-render data changes incrementally. If there is no
change in the underlying data dimension then calling this method will have no effect on the
chart. Most chart interaction in dc will automatically trigger this method through internal
events (in particular [dc.redrawAll](#dcredrawallchartgroup)); therefore, you only need to
manually invoke this function if data is manipulated outside of dc's control (for example if
data is loaded in the background using `crossfilter.add()`).

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+hasFilterHandler"></a>
#### baseMixin.hasFilterHandler ⇒ <code>Chart</code>
Set or get the has filter handler. The has filter handler is a function that checks to see if
the chart's current filters include a specific filter.  Using a custom has filter handler allows
you to change the way filters are checked for and replaced.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [hasFilterHandler] | <code>function</code> | 

**Example**  
```js
// default has filter handler
function (filters, filter) {
    if (filter === null || typeof(filter) === 'undefined') {
        return filters.length > 0;
    }
    return filters.some(function (f) {
        return filter <= f && filter >= f;
    });
}

// custom filter handler (no-op)
chart.hasFilterHandler(function(filters, filter) {
    return false;
});
```
<a name="dc.baseMixin+hasFilter"></a>
#### baseMixin.hasFilter ⇒ <code>Boolean</code>
Check whether any active filter or a specific filter is associated with particular chart instance.
This function is **not chainable**.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [hasFilter] | <code>\*</code> | 

<a name="dc.baseMixin+removeFilterHandler"></a>
#### baseMixin.removeFilterHandler ⇒ <code>Chart</code>
Set or get the remove filter handler. The remove filter handler is a function that removes a
filter from the chart's current filters. Using a custom remove filter handler allows you to
change how filters are removed or perform additional work when removing a filter, e.g. when
using a filter server other than crossfilter.

Any changes should modify the `filters` array argument and return that array.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [removeFilterHandler] | <code>function</code> | 

**Example**  
```js
// default remove filter handler
function (filters, filter) {
    for (var i = 0; i < filters.length; i++) {
        if (filters[i] <= filter && filters[i] >= filter) {
            filters.splice(i, 1);
            break;
        }
    }
    return filters;
}

// custom filter handler (no-op)
chart.removeFilterHandler(function(filters, filter) {
    return filters;
});
```
<a name="dc.baseMixin+addFilterHandler"></a>
#### baseMixin.addFilterHandler ⇒ <code>Chart</code>
Set or get the add filter handler. The add filter handler is a function that adds a filter to
the chart's filter list. Using a custom add filter handler allows you to change the way filters
are added or perform additional work when adding a filter, e.g. when using a filter server other
than crossfilter.

Any changes should modify the `filters` array argument and return that array.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [addFilterHandler] | <code>function</code> | 

**Example**  
```js
// default add filter handler
function (filters, filter) {
    filters.push(filter);
    return filters;
}

// custom filter handler (no-op)
chart.addFilterHandler(function(filters, filter) {
    return filters;
});
```
<a name="dc.baseMixin+resetFilterHandler"></a>
#### baseMixin.resetFilterHandler ⇒ <code>Chart</code>
Set or get the reset filter handler. The reset filter handler is a function that resets the
chart's filter list by returning a new list. Using a custom reset filter handler allows you to
change the way filters are reset, or perform additional work when resetting the filters,
e.g. when using a filter server other than crossfilter.

This function should return an array.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [resetFilterHandler] | <code>function</code> | 

**Example**  
```js
// default remove filter handler
function (filters) {
    return [];
}

// custom filter handler (no-op)
chart.resetFilterHandler(function(filters) {
    return filters;
});
```
<a name="dc.baseMixin+filter"></a>
#### baseMixin.filter ⇒ <code>Chart</code>
Filter the chart by the given value or return the current filter if the input parameter is missing.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [filterValue] | <code>\*</code> | 

**Example**  
```js
// filter by a single string
chart.filter('Sunday');
// filter by a single age
chart.filter(18);
```
<a name="dc.baseMixin+filters"></a>
#### baseMixin.filters ⇒ <code>Array.&lt;\*&gt;</code>
Returns all current filters. This method does not perform defensive cloning of the internal
filter array before returning, therefore any modification of the returned array will effect the
chart's internal filter storage.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+onClick"></a>
#### baseMixin.onClick
This function is passed to d3 as the onClick handler for each chart. The default behavior is to
filter on the clicked datum (passed to the callback) and redraw the chart group.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| datum | <code>\*</code> | 

<a name="dc.baseMixin+filterHandler"></a>
#### baseMixin.filterHandler ⇒ <code>Chart</code>
Set or get the filter handler. The filter handler is a function that performs the filter action
on a specific dimension. Using a custom filter handler allows you to perform additional logic
before or after filtering.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| filterHandler | <code>function</code> | 

**Example**  
```js
// default filter handler
function(dimension, filter){
    dimension.filter(filter); // perform filtering
    return filter; // return the actual filter value
}

// custom filter handler
chart.filterHandler(function(dimension, filter){
    var newFilter = filter + 10;
    dimension.filter(newFilter);
    return newFilter; // set the actual filter value to the new value
});
```
<a name="dc.baseMixin+keyAccessor"></a>
#### baseMixin.keyAccessor ⇒ <code>Chart</code>
Set or get the key accessor function. The key accessor function is used to retrieve the key
value from the crossfilter group. Key values are used differently in different charts, for
example keys correspond to slices in a pie chart and x axis positions in a grid coordinate chart.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| keyAccessor | <code>function</code> | 

**Example**  
```js
// default key accessor
chart.keyAccessor(function(d) { return d.key; });
// custom key accessor for a multi-value crossfilter reduction
chart.keyAccessor(function(p) { return p.value.absGain; });
```
<a name="dc.baseMixin+valueAccessor"></a>
#### baseMixin.valueAccessor ⇒ <code>Chart</code>
Set or get the value accessor function. The value accessor function is used to retrieve the
value from the crossfilter group. Group values are used differently in different charts, for
example values correspond to slice sizes in a pie chart and y axis positions in a grid
coordinate chart.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| valueAccessor | <code>function</code> | 

**Example**  
```js
// default value accessor
chart.valueAccessor(function(d) { return d.value; });
// custom value accessor for a multi-value crossfilter reduction
chart.valueAccessor(function(p) { return p.value.percentageGain; });
```
<a name="dc.baseMixin+label"></a>
#### baseMixin.label ⇒ <code>Chart</code>
Set or get the label function. The chart class will use this function to render labels for each
child element in the chart, e.g. slices in a pie chart or bubbles in a bubble chart. Not every
chart supports the label function for example bar chart and line chart do not use this function
at all.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| labelFunction | <code>function</code> | 

**Example**  
```js
// default label function just return the key
chart.label(function(d) { return d.key; });
// label function has access to the standard d3 data binding and can get quite complicated
chart.label(function(d) { return d.data.key + '(' + Math.floor(d.data.value / all.value() * 100) + '%)'; });
```
<a name="dc.baseMixin+renderLabel"></a>
#### baseMixin.renderLabel ⇒ <code>Boolean</code>
Turn on/off label rendering

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| renderLabel | <code>Boolean</code> | 

<a name="dc.baseMixin+title"></a>
#### baseMixin.title ⇒ <code>function</code>
Set or get the title function. The chart class will use this function to render the svg title
(usually interpreted by browser as tooltips) for each child element in the chart, e.g. a slice
in a pie chart or a bubble in a bubble chart. Almost every chart supports the title function;
however in grid coordinate charts you need to turn off the brush in order to see titles, because
otherwise the brush layer will block tooltip triggering.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| titleFunction | <code>function</code> | 

**Example**  
```js
// default title function just return the key
chart.title(function(d) { return d.key + ': ' + d.value; });
// title function has access to the standard d3 data binding and can get quite complicated
chart.title(function(p) {
   return p.key.getFullYear()
       + '\n'
       + 'Index Gain: ' + numberFormat(p.value.absGain) + '\n'
       + 'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%\n'
       + 'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%';
});
```
<a name="dc.baseMixin+renderTitle"></a>
#### baseMixin.renderTitle ⇒ <code>Boolean</code>
Turn on/off title rendering, or return the state of the render title flag if no arguments are
given.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| renderTitle | <code>Boolean</code> | 

<a name="dc.baseMixin+renderlet"></a>
#### ~~baseMixin.renderlet ⇒ <code>function</code>~~
***Deprecated***

A renderlet is similar to an event listener on rendering event. Multiple renderlets can be added
to an individual chart.  Each time a chart is rerendered or redrawn the renderlets are invoked
right after the chart finishes its transitions, giving you a way to modify the svg
elements. Renderlet functions take the chart instance as the only input parameter and you can
use the dc API or use raw d3 to achieve pretty much any effect.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| renderletFunction | <code>function</code> | 

**Example**  
```js
// do this instead of .renderlet(function(chart) { ... })
chart.on("renderlet", function(chart){
    // mix of dc API and d3 manipulation
    chart.select('g.y').style('display', 'none');
    // its a closure so you can also access other chart variable available in the closure scope
    moveChart.filter(chart.filter());
});
```
<a name="dc.baseMixin+chartGroup"></a>
#### baseMixin.chartGroup ⇒ <code>String</code>
Get or set the chart group to which this chart belongs. Chart groups are rendered or redrawn
together since it is expected they share the same underlying crossfilter data set.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| chartGroup | <code>String</code> | 

<a name="dc.baseMixin+expireCache"></a>
#### baseMixin.expireCache ⇒ <code>Chart</code>
Expire the internal chart cache. dc charts cache some data internally on a per chart basis to
speed up rendering and avoid unnecessary calculation; however it might be useful to clear the
cache if you have changed state which will affect rendering.  For example if you invoke the
`crossfilter.add` function or reset group or dimension after rendering it is a good idea to
clear the cache to make sure charts are rendered properly.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+legend"></a>
#### baseMixin.legend ⇒ <code>[legend](#dc.legend)</code>
Attach a dc.legend widget to this chart. The legend widget will automatically draw legend labels
based on the color setting and names associated with each group.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| [legend] | <code>[legend](#dc.legend)</code> | 

**Example**  
```js
chart.legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
```
<a name="dc.baseMixin+chartID"></a>
#### baseMixin.chartID ⇒ <code>String</code>
Returns the internal numeric ID of the chart.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  
<a name="dc.baseMixin+options"></a>
#### baseMixin.options ⇒ <code>Chart</code>
Set chart options using a configuration object. Each key in the object will cause the method of
the same name to be called with the value to set that attribute for the chart.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| opts | <code>Object</code> | 

**Example**  
```js
chart.options({dimension: myDimension, group: myGroup});
```
<a name="dc.baseMixin+on"></a>
#### baseMixin.on ⇒ <code>Chart</code>
All dc chart instance supports the following listeners.
Supports the following events:
* 'renderlet' - This listener function will be invoked after transitions after redraw and render. Replaces the
deprecated `.renderlet()` method.
* 'pretransition' - Like `.on('renderlet', ...)` but the event is fired before transitions start.
* 'preRender' - This listener function will be invoked before chart rendering.
* 'postRender' - This listener function will be invoked after chart finish rendering including
all renderlets' logic.
* 'preRedraw' - This listener function will be invoked before chart redrawing.
* 'postRedraw' - This listener function will be invoked after chart finish redrawing
including all renderlets' logic.
* 'filtered' - This listener function will be invoked after a filter is applied, added or removed.
* 'zoomed' - This listener function will be invoked after a zoom is triggered.

**Kind**: instance property of <code>[baseMixin](#dc.baseMixin)</code>  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| listener | <code>function</code> | 

**Example**  
```js
.on('renderlet', function(chart, filter){...})
.on('pretransition', function(chart, filter){...})
.on('preRender', function(chart){...})
.on('postRender', function(chart){...})
.on('preRedraw', function(chart){...})
.on('postRedraw', function(chart){...})
.on('filtered', function(chart, filter){...})
.on('zoomed', function(chart, filter){...})
```
<a name="dc.bubbleMixin"></a>
### dc.bubbleMixin ⇒ <code>Chart</code>
This Mixin provides reusable functionalities for any chart that needs to visualize data using bubbles.

**Kind**: static mixin of <code>[dc](#dc)</code>  
**Mixes**: <code>colorMixin</code>  

| Param | Type |
| --- | --- |
| _chart | <code>Chart</code> | 


* [.bubbleMixin](#dc.bubbleMixin) ⇒ <code>Chart</code>
  * [.r](#dc.bubbleMixin+r) ⇒ <code>Array.&lt;Number&gt;</code>
  * [.radiusValueAccessor](#dc.bubbleMixin+radiusValueAccessor) ⇒ <code>function</code>
  * [.minRadiusWithLabel](#dc.bubbleMixin+minRadiusWithLabel) ⇒ <code>Number</code>
  * [.maxBubbleRelativeSize](#dc.bubbleMixin+maxBubbleRelativeSize) ⇒ <code>Number</code>

<a name="dc.bubbleMixin+r"></a>
#### bubbleMixin.r ⇒ <code>Array.&lt;Number&gt;</code>
Get or set the bubble radius scale. By default the bubble chart uses
`d3.scale.linear().domain([0, 100])` as its r scale .

**Kind**: instance property of <code>[bubbleMixin](#dc.bubbleMixin)</code>  

| Param | Type |
| --- | --- |
| [bubbleRadiusScale] | <code>Array.&lt;Number&gt;</code> | 

<a name="dc.bubbleMixin+radiusValueAccessor"></a>
#### bubbleMixin.radiusValueAccessor ⇒ <code>function</code>
Get or set the radius value accessor function. If set, the radius value accessor function will
be used to retrieve a data value for each bubble. The data retrieved then will be mapped using
the r scale to the actual bubble radius. This allows you to encode a data dimension using bubble
size.

**Kind**: instance property of <code>[bubbleMixin](#dc.bubbleMixin)</code>  

| Param | Type |
| --- | --- |
| [radiusValueAccessor] | <code>function</code> | 

<a name="dc.bubbleMixin+minRadiusWithLabel"></a>
#### bubbleMixin.minRadiusWithLabel ⇒ <code>Number</code>
Get or set the minimum radius for label rendering. If a bubble's radius is less than this value
then no label will be rendered.

**Kind**: instance property of <code>[bubbleMixin](#dc.bubbleMixin)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [radius] | <code>Number</code> | <code>10</code> | 

<a name="dc.bubbleMixin+maxBubbleRelativeSize"></a>
#### bubbleMixin.maxBubbleRelativeSize ⇒ <code>Number</code>
Get or set the maximum relative size of a bubble to the length of x axis. This value is useful
when the difference in radius between bubbles is too great.

**Kind**: instance property of <code>[bubbleMixin](#dc.bubbleMixin)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [relativeSize] | <code>Number</code> | <code>0.3</code> | 

<a name="dc.capMixin"></a>
### dc.capMixin ⇒ <code>Chart</code>
Cap is a mixin that groups small data elements below a _cap_ into an *others* grouping for both the
Row and Pie Charts.

The top ordered elements in the group up to the cap amount will be kept in the chart, and the rest
will be replaced with an *others* element, with value equal to the sum of the replaced values. The
keys of the elements below the cap limit are recorded in order to filter by those keys when the
others* element is clicked.

**Kind**: static mixin of <code>[dc](#dc)</code>  

| Param | Type |
| --- | --- |
| _chart | <code>Chart</code> | 


* [.capMixin](#dc.capMixin) ⇒ <code>Chart</code>
  * [.cap](#dc.capMixin+cap) ⇒ <code>Number</code>
  * [.othersLabel](#dc.capMixin+othersLabel) ⇒ <code>String</code>
  * [.othersGrouper](#dc.capMixin+othersGrouper) ⇒ <code>function</code>

<a name="dc.capMixin+cap"></a>
#### capMixin.cap ⇒ <code>Number</code>
Get or set the count of elements to that will be included in the cap.

**Kind**: instance property of <code>[capMixin](#dc.capMixin)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [count] | <code>Number</code> | <code>Infinity</code> | 

<a name="dc.capMixin+othersLabel"></a>
#### capMixin.othersLabel ⇒ <code>String</code>
Get or set the label for *Others* slice when slices cap is specified

**Kind**: instance property of <code>[capMixin](#dc.capMixin)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [label] | <code>String</code> | <code>Others</code> | 

<a name="dc.capMixin+othersGrouper"></a>
#### capMixin.othersGrouper ⇒ <code>function</code>
Get or set the grouper function that will perform the insertion of data for the *Others* slice
if the slices cap is specified. If set to a falsy value, no others will be added. By default the
grouper function computes the sum of all values below the cap.

**Kind**: instance property of <code>[capMixin](#dc.capMixin)</code>  

| Param | Type |
| --- | --- |
| [grouperFunction] | <code>function</code> | 

**Example**  
```js
chart.othersGrouper(function (data) {
    // compute the value for others, presumably the sum of all values below the cap
    var othersSum  = yourComputeOthersValueLogic(data)

    // the keys are needed to properly filter when the others element is clicked
    var othersKeys = yourComputeOthersKeysArrayLogic(data);

    // add the others row to the dataset
    data.push({'key': 'Others', 'value': othersSum, 'others': othersKeys });

    return data;
});
```
<a name="dc.colorMixin"></a>
### dc.colorMixin ⇒ <code>Chart</code>
The Color Mixin is an abstract chart functional class providing universal coloring support
as a mix-in for any concrete chart implementation.

**Kind**: static mixin of <code>[dc](#dc)</code>  

| Param | Type |
| --- | --- |
| _chart | <code>Chart</code> | 


* [.colorMixin](#dc.colorMixin) ⇒ <code>Chart</code>
  * [.colors](#dc.colorMixin+colors) ⇒ <code>Chart</code>
  * [.ordinalColors](#dc.colorMixin+ordinalColors) ⇒ <code>Chart</code>
  * [.linearColors](#dc.colorMixin+linearColors) ⇒ <code>Chart</code>
  * [.linearColors](#dc.colorMixin+linearColors) ⇒ <code>function</code>
  * [.colorDomain](#dc.colorMixin+colorDomain) ⇒ <code>function</code>
  * [.calculateColorDomain](#dc.colorMixin+calculateColorDomain) ⇒ <code>Chart</code>
  * [.getColor](#dc.colorMixin+getColor) ⇒ <code>String</code>
  * [.colorCalculator](#dc.colorMixin+colorCalculator) ⇒ <code>\*</code>

<a name="dc.colorMixin+colors"></a>
#### colorMixin.colors ⇒ <code>Chart</code>
Retrieve current color scale or set a new color scale. This methods accepts any function that
operates like a d3 scale.

**Kind**: instance property of <code>[colorMixin](#dc.colorMixin)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [colorScale] | <code>D3Scale</code> | <code>d3.scale.category20c()</code> | 

**Example**  
```js
// alternate categorical scale
chart.colors(d3.scale.category20b());

// ordinal scale
chart.colors(d3.scale.ordinal().range(['red','green','blue']));
// convenience method, the same as above
chart.ordinalColors(['red','green','blue']);

// set a linear scale
chart.linearColors(["#4575b4", "#ffffbf", "#a50026"]);
```
<a name="dc.colorMixin+ordinalColors"></a>
#### colorMixin.ordinalColors ⇒ <code>Chart</code>
Convenience method to set the color scale to d3.scale.ordinal with range `r`.

**Kind**: instance property of <code>[colorMixin](#dc.colorMixin)</code>  

| Param | Type |
| --- | --- |
| r | <code>Array.&lt;String&gt;</code> | 

<a name="dc.colorMixin+linearColors"></a>
#### colorMixin.linearColors ⇒ <code>Chart</code>
Convenience method to set the color scale to an Hcl interpolated linear scale with range `r`.

**Kind**: instance property of <code>[colorMixin](#dc.colorMixin)</code>  

| Param | Type |
| --- | --- |
| r | <code>Array.&lt;Number&gt;</code> | 

<a name="dc.colorMixin+linearColors"></a>
#### colorMixin.linearColors ⇒ <code>function</code>
Set or the get color accessor function. This function will be used to map a data point in a
crossfilter group to a color value on the color scale. The default function uses the key
accessor.

**Kind**: instance property of <code>[colorMixin](#dc.colorMixin)</code>  

| Param | Type |
| --- | --- |
| [colorAccessorFunction] | <code>function</code> | 

**Example**  
```js
// default index based color accessor
.colorAccessor(function (d, i){return i;})
// color accessor for a multi-value crossfilter reduction
.colorAccessor(function (d){return d.value.absGain;})
```
<a name="dc.colorMixin+colorDomain"></a>
#### colorMixin.colorDomain ⇒ <code>function</code>
Set or get the current domain for the color mapping function. The domain must be supplied as an
array.

Note: previously this method accepted a callback function. Instead you may use a custom scale
set by `.colors`.

**Kind**: instance property of <code>[colorMixin](#dc.colorMixin)</code>  

| Param | Type |
| --- | --- |
| [domain] | <code>Array.&lt;String&gt;</code> | 

<a name="dc.colorMixin+calculateColorDomain"></a>
#### colorMixin.calculateColorDomain ⇒ <code>Chart</code>
Set the domain by determining the min and max values as retrieved by `.colorAccessor` over the
chart's dataset.

**Kind**: instance property of <code>[colorMixin](#dc.colorMixin)</code>  
<a name="dc.colorMixin+getColor"></a>
#### colorMixin.getColor ⇒ <code>String</code>
Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.

**Kind**: instance property of <code>[colorMixin](#dc.colorMixin)</code>  

| Param | Type |
| --- | --- |
| d | <code>\*</code> | 
| [i] | <code>Number</code> | 

<a name="dc.colorMixin+colorCalculator"></a>
#### colorMixin.colorCalculator ⇒ <code>\*</code>
Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.

**Kind**: instance property of <code>[colorMixin](#dc.colorMixin)</code>  

| Param | Type |
| --- | --- |
| [value] | <code>\*</code> | 

<a name="dc.marginMixin"></a>
### dc.marginMixin ⇒ <code>Chart</code>
Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
Charts.

**Kind**: static mixin of <code>[dc](#dc)</code>  

| Param | Type |
| --- | --- |
| _chart | <code>Chart</code> | 

<a name="dc.marginMixin+margins"></a>
#### marginMixin.margins ⇒ <code>Chart</code>
Get or set the margins for a particular coordinate grid chart instance. The margins is stored as
an associative Javascript array.

**Kind**: instance property of <code>[marginMixin](#dc.marginMixin)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [margins] | <code>Object</code> | <code>{top: 10, right: 50, bottom: 30, left: 30}</code> | 

**Example**  
```js
var leftMargin = chart.margins().left; // 30 by default
chart.margins().left = 50;
leftMargin = chart.margins().left; // now 50
```
<a name="dc.stackMixin"></a>
### dc.stackMixin ⇒ <code>Chart</code>
Stack Mixin is an mixin that provides cross-chart support of stackability using d3.layout.stack.

**Kind**: static mixin of <code>[dc](#dc)</code>  

| Param | Type |
| --- | --- |
| _chart | <code>Chart</code> | 


* [.stackMixin](#dc.stackMixin) ⇒ <code>Chart</code>
  * [.stack](#dc.stackMixin+stack) ⇒ <code>Chart</code>
  * [.hidableStacks](#dc.stackMixin+hidableStacks) ⇒ <code>Chart</code>
  * [.hideStack](#dc.stackMixin+hideStack) ⇒ <code>Chart</code>
  * [.showStack](#dc.stackMixin+showStack) ⇒ <code>Chart</code>
  * [.title](#dc.stackMixin+title) ⇒ <code>Chart</code>
  * [.stackLayout](#dc.stackMixin+stackLayout) ⇒ <code>Chart</code>

<a name="dc.stackMixin+stack"></a>
#### stackMixin.stack ⇒ <code>Chart</code>
Stack a new crossfilter group onto this chart with an optional custom value accessor. All stacks
in the same chart will share the same key accessor and therefore the same set of keys.

For example, in a stacked bar chart, the bars of each stack will be positioned using the same set
of keys on the x axis, while stacked vertically. If name is specified then it will be used to
generate the legend label.

**Kind**: instance property of <code>[stackMixin](#dc.stackMixin)</code>  

| Param | Type |
| --- | --- |
| group | <code>CrossfilterGroup</code> | 
| [name] | <code>String</code> | 
| [accessor] | <code>function</code> | 

**Example**  
```js
// stack group using default accessor
chart.stack(valueSumGroup)
// stack group using custom accessor
.stack(avgByDayGroup, function(d){return d.value.avgByDay;});
```
<a name="dc.stackMixin+hidableStacks"></a>
#### stackMixin.hidableStacks ⇒ <code>Chart</code>
Allow named stacks to be hidden or shown by clicking on legend items.
This does not affect the behavior of hideStack or showStack.

**Kind**: instance property of <code>[stackMixin](#dc.stackMixin)</code>  

| Param | Type |
| --- | --- |
| hidableStacks | <code>Boolean</code> | 

<a name="dc.stackMixin+hideStack"></a>
#### stackMixin.hideStack ⇒ <code>Chart</code>
Hide all stacks on the chart with the given name.
The chart must be re-rendered for this change to appear.

**Kind**: instance property of <code>[stackMixin](#dc.stackMixin)</code>  

| Param | Type |
| --- | --- |
| stackName | <code>String</code> | 

<a name="dc.stackMixin+showStack"></a>
#### stackMixin.showStack ⇒ <code>Chart</code>
Show all stacks on the chart with the given name.
The chart must be re-rendered for this change to appear.

**Kind**: instance property of <code>[stackMixin](#dc.stackMixin)</code>  

| Param | Type |
| --- | --- |
| stackName | <code>String</code> | 

<a name="dc.stackMixin+title"></a>
#### stackMixin.title ⇒ <code>Chart</code>
Set or get the title function. Chart class will use this function to render svg title (usually interpreted by
browser as tooltips) for each child element in the chart, i.e. a slice in a pie chart or a bubble in a bubble chart.
Almost every chart supports title function however in grid coordinate chart you need to turn off brush in order to
use title otherwise the brush layer will block tooltip trigger.

If the first argument is a stack name, the title function will get or set the title for that stack. If stackName
is not provided, the first stack is implied.

**Kind**: instance property of <code>[stackMixin](#dc.stackMixin)</code>  

| Param | Type |
| --- | --- |
| [stackName] | <code>String</code> | 
| [titleAccessor] | <code>function</code> | 

**Example**  
```js
// set a title function on 'first stack'
chart.title('first stack', function(d) { return d.key + ': ' + d.value; });
// get a title function from 'second stack'
var secondTitleFunction = chart.title('second stack');
```
<a name="dc.stackMixin+stackLayout"></a>
#### stackMixin.stackLayout ⇒ <code>Chart</code>
Gets or sets the stack layout algorithm, which computes a baseline for each stack and
propagates it to the next

**Kind**: instance property of <code>[stackMixin](#dc.stackMixin)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [stack] | <code>function</code> | <code>d3.layout.stack</code> | 

<a name="dc.barChart"></a>
### dc.barChart ⇒ <code>BarChart</code>
Concrete bar chart/histogram implementation.
Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>baseMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a bar chart under #chart-container1 element using the default global chart group
var chart1 = dc.barChart('#chart-container1');
// create a bar chart under #chart-container2 element using chart group A
var chart2 = dc.barChart('#chart-container2', 'chartGroupA');
// create a sub-chart under a composite parent chart
var chart3 = dc.barChart(compositeChart);
```

* [.barChart](#dc.barChart) ⇒ <code>BarChart</code>
  * [.centerBar](#dc.barChart+centerBar) ⇒ <code>Boolean</code>
  * [.barPadding](#dc.barChart+barPadding) ⇒ <code>Number</code>
  * [.outerPadding](#dc.barChart+outerPadding) ⇒ <code>Number</code>
  * [.gap](#dc.barChart+gap) ⇒ <code>Number</code>
  * [.alwaysUseRounding](#dc.barChart+alwaysUseRounding) ⇒ <code>Boolean</code>

<a name="dc.barChart+centerBar"></a>
#### barChart.centerBar ⇒ <code>Boolean</code>
Whether the bar chart will render each bar centered around the data position on x axis

**Kind**: instance property of <code>[barChart](#dc.barChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [centerBar] | <code>Boolean</code> | <code>false</code> | 

<a name="dc.barChart+barPadding"></a>
#### barChart.barPadding ⇒ <code>Number</code>
Get or set the spacing between bars as a fraction of bar size. Valid values are between 0-1.
Setting this value will also remove any previously set `gap`. See the
[d3 docs](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands)
for a visual description of how the padding is applied.

**Kind**: instance property of <code>[barChart](#dc.barChart)</code>  

| Param | Type |
| --- | --- |
| [barPadding] | <code>Number</code> | 

<a name="dc.barChart+outerPadding"></a>
#### barChart.outerPadding ⇒ <code>Number</code>
Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
Will pad the width by `padding * barWidth` on each side of the chart.

**Kind**: instance property of <code>[barChart](#dc.barChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> | <code>0.5</code> | 

<a name="dc.barChart+gap"></a>
#### barChart.gap ⇒ <code>Number</code>
Manually set fixed gap (in px) between bars instead of relying on the default auto-generated
gap.  By default the bar chart implementation will calculate and set the gap automatically
based on the number of data points and the length of the x axis.

**Kind**: instance property of <code>[barChart](#dc.barChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [gap] | <code>Number</code> | <code>2</code> | 

<a name="dc.barChart+alwaysUseRounding"></a>
#### barChart.alwaysUseRounding ⇒ <code>Boolean</code>
Set or get whether rounding is enabled when bars are centered.  Default: false.  If false, using
rounding with centered bars will result in a warning and rounding will be ignored.  This flag
has no effect if bars are not centered.
When using standard d3.js rounding methods, the brush often doesn't align correctly with
centered bars since the bars are offset.  The rounding function must add an offset to
compensate, such as in the following example.

**Kind**: instance property of <code>[barChart](#dc.barChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [alwaysUseRounding] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
chart.round(function(n) {return Math.floor(n)+0.5});
```
<a name="dc.boxPlot"></a>
### dc.boxPlot ⇒ <code>BoxPlot</code>
A box plot is a chart that depicts numerical data via their quartile ranges.
Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>coordinateGridMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a box plot under #chart-container1 element using the default global chart group
var boxPlot1 = dc.boxPlot('#chart-container1');
// create a box plot under #chart-container2 element using chart group A
var boxPlot2 = dc.boxPlot('#chart-container2', 'chartGroupA');
```

* [.boxPlot](#dc.boxPlot) ⇒ <code>BoxPlot</code>
  * [.boxPadding](#dc.boxPlot+boxPadding) ⇒ <code>Number</code>
  * [.outerPadding](#dc.boxPlot+outerPadding) ⇒ <code>Number</code>
  * [.boxWidth](#dc.boxPlot+boxWidth) ⇒ <code>Number</code> &#124; <code>function</code>
  * [.tickFormat](#dc.boxPlot+tickFormat) ⇒ <code>Number</code> &#124; <code>function</code>

<a name="dc.boxPlot+boxPadding"></a>
#### boxPlot.boxPadding ⇒ <code>Number</code>
Get or set the spacing between boxes as a fraction of box size. Valid values are within 0-1.
See the [d3 docs](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands)
for a visual description of how the padding is applied.

**Kind**: instance property of <code>[boxPlot](#dc.boxPlot)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> | <code>0.8</code> | 

<a name="dc.boxPlot+outerPadding"></a>
#### boxPlot.outerPadding ⇒ <code>Number</code>
Get or set the outer padding on an ordinal box chart. This setting has no effect on non-ordinal charts
or on charts with a custom `.boxWidth`. Will pad the width by `padding * barWidth` on each side of the chart.

**Kind**: instance property of <code>[boxPlot](#dc.boxPlot)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> | <code>0.5</code> | 

<a name="dc.boxPlot+boxWidth"></a>
#### boxPlot.boxWidth ⇒ <code>Number</code> &#124; <code>function</code>
Get or set the numerical width of the boxplot box. The width may also be a function taking as
parameters the chart width excluding the right and left margins, as well as the number of x
units.

**Kind**: instance property of <code>[boxPlot](#dc.boxPlot)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [boxWidth] | <code>Number</code> &#124; <code>function</code> | <code>0.5</code> | 

**Example**  
```js
// Using numerical parameter
chart.boxWidth(10);
// Using function
chart.boxWidth((innerChartWidth, xUnits) { ... });
```
<a name="dc.boxPlot+tickFormat"></a>
#### boxPlot.tickFormat ⇒ <code>Number</code> &#124; <code>function</code>
Set the numerical format of the boxplot median, whiskers and quartile labels. Defaults to
integer formatting.

**Kind**: instance property of <code>[boxPlot](#dc.boxPlot)</code>  

| Param | Type |
| --- | --- |
| [tickFormat] | <code>function</code> | 

**Example**  
```js
// format ticks to 2 decimal places
chart.tickFormat(d3.format('.2f'));
```
<a name="dc.bubbleChart"></a>
### dc.bubbleChart ⇒ <code>BubbleChart</code>
A concrete implementation of a general purpose bubble chart that allows data visualization using the
following dimensions:
- x axis position
- y axis position
- bubble radius
- color
Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [US Venture Capital Landscape 2011](http://dc-js.github.com/dc.js/vc/index.html)

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>bubbleMixin,coordinateGridMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a bubble chart under #chart-container1 element using the default global chart group
var bubbleChart1 = dc.bubbleChart('#chart-container1');
// create a bubble chart under #chart-container2 element using chart group A
var bubbleChart2 = dc.bubbleChart('#chart-container2', 'chartGroupA');
```
<a name="dc.bubbleChart+elasticRadius"></a>
#### bubbleChart.elasticRadius ⇒ <code>Boolean</code>
Turn on or off the elastic bubble radius feature, or return the value of the flag. If this
feature is turned on, then bubble radii will be automatically rescaled to fit the chart better.

**Kind**: instance property of <code>[bubbleChart](#dc.bubbleChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Boolean</code> | <code>false</code> | 

<a name="dc.bubbleOverlay"></a>
### dc.bubbleOverlay ⇒ <code>BubbleOverlay</code>
The bubble overlay chart is quite different from the typical bubble chart. With the bubble overlay
chart you can arbitrarily place bubbles on an existing svg or bitmap image, thus changing the
typical x and y positioning while retaining the capability to visualize data using bubble radius
and coloring.
Examples:
- [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>bubbleMixin,baseMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a bubble overlay chart on top of the '#chart-container1 svg' element using the default global chart group
var bubbleChart1 = dc.bubbleOverlayChart('#chart-container1').svg(d3.select('#chart-container1 svg'));
// create a bubble overlay chart on top of the '#chart-container2 svg' element using chart group A
var bubbleChart2 = dc.compositeChart('#chart-container2', 'chartGroupA').svg(d3.select('#chart-container2 svg'));
```

* [.bubbleOverlay](#dc.bubbleOverlay) ⇒ <code>BubbleOverlay</code>
  * [.svg](#dc.bubbleOverlay+svg) ⇒ <code>Chart</code>
  * [.point](#dc.bubbleOverlay+point) ⇒ <code>Chart</code>

<a name="dc.bubbleOverlay+svg"></a>
#### bubbleOverlay.svg ⇒ <code>Chart</code>
**mandatory**

Set the underlying svg image element. Unlike other dc charts this chart will not generate a svg
element; therefore the bubble overlay chart will not work if this function is not invoked. If the
underlying image is a bitmap, then an empty svg will need to be created on top of the image.

**Kind**: instance property of <code>[bubbleOverlay](#dc.bubbleOverlay)</code>  

| Param | Type |
| --- | --- |
| [imageElement] | <code>Selection</code> | 

**Example**  
```js
// set up underlying svg element
chart.svg(d3.select('#chart svg'));
```
<a name="dc.bubbleOverlay+point"></a>
#### bubbleOverlay.point ⇒ <code>Chart</code>
**mandatory**

Set up a data point on the overlay. The name of a data point should match a specific 'key' among
data groups generated using keyAccessor.  If a match is found (point name <-> data group key)
then a bubble will be generated at the position specified by the function. x and y
value specified here are relative to the underlying svg.

**Kind**: instance property of <code>[bubbleOverlay](#dc.bubbleOverlay)</code>  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 
| x | <code>Number</code> | 
| y | <code>Number</code> | 

<a name="dc.filterAll"></a>
### dc.filterAll
Clear all filters on all charts within the given chart group. If the chart group is not given then
only charts that belong to the default chart group will be reset.

**Kind**: static property of <code>[dc](#dc)</code>  

| Param | Type |
| --- | --- |
| [group] | <code>String</code> | 

<a name="dc.refocusAll"></a>
### dc.refocusAll
Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
not given then only charts that belong to the default chart group will be reset.

**Kind**: static property of <code>[dc](#dc)</code>  

| Param | Type |
| --- | --- |
| [group] | <code>String</code> | 

<a name="dc.renderAll"></a>
### dc.renderAll
Re-render all charts belong to the given chart group. If the chart group is not given then only
charts that belong to the default chart group will be re-rendered.

**Kind**: static property of <code>[dc](#dc)</code>  

| Param | Type |
| --- | --- |
| [group] | <code>String</code> | 

<a name="dc.redrawAll"></a>
### dc.redrawAll
Redraw all charts belong to the given chart group. If the chart group is not given then only charts
that belong to the default chart group will be re-drawn. Redraw is different from re-render since
when redrawing dc tries to update the graphic incrementally, using transitions, instead of starting
from scratch.

**Kind**: static property of <code>[dc](#dc)</code>  

| Param | Type |
| --- | --- |
| [group] | <code>String</code> | 

<a name="dc.disableTransitions"></a>
### dc.disableTransitions : <code>Boolean</code>
If this boolean is set truthy, all transitions will be disabled, and changes to the charts will happen
immediately

**Kind**: static property of <code>[dc](#dc)</code>  
**Default**: <code>false</code>  
<a name="dc.units"></a>
### dc.units : <code>Object</code>
**Kind**: static property of <code>[dc](#dc)</code>  

* [.units](#dc.units) : <code>Object</code>
  * [.integers](#dc.units.integers) ⇒ <code>Number</code>
  * [.ordinal](#dc.units.ordinal) ⇒ <code>Array.&lt;String&gt;</code>
  * [.fp](#dc.units.fp) : <code>Object</code>
    * [.precision](#dc.units.fp.precision) ⇒ <code>function</code>

<a name="dc.units.integers"></a>
#### units.integers ⇒ <code>Number</code>
The default value for `xUnits` for the [Coordinate Grid Chart](#coordinate-grid-chart) and should
be used when the x values are a sequence of integers.
It is a function that counts the number of integers in the range supplied in its start and end parameters.

**Kind**: static property of <code>[units](#dc.units)</code>  

| Param | Type |
| --- | --- |
| start | <code>Number</code> | 
| end | <code>Number</code> | 

**Example**  
```js
chart.xUnits(dc.units.integers) // already the default
```
<a name="dc.units.ordinal"></a>
#### units.ordinal ⇒ <code>Array.&lt;String&gt;</code>
This argument can be passed to the `xUnits` function of the to specify ordinal units for the x
axis. Usually this parameter is used in combination with passing `d3.scale.ordinal()` to `.x`.
It just returns the domain passed to it, which for ordinal charts is an array of all values.

**Kind**: static property of <code>[units](#dc.units)</code>  

| Param | Type |
| --- | --- |
| start | <code>\*</code> | 
| end | <code>\*</code> | 
| domain | <code>Array.&lt;String&gt;</code> | 

**Example**  
```js
chart.xUnits(dc.units.ordinal)
     .x(d3.scale.ordinal())
```
<a name="dc.units.fp"></a>
#### units.fp : <code>Object</code>
**Kind**: static property of <code>[units](#dc.units)</code>  
<a name="dc.units.fp.precision"></a>
##### fp.precision ⇒ <code>function</code>
This function generates an argument for the [Coordinate Grid Chart's](#coordinate-grid-chart)
`xUnits` function specifying that the x values are floating-point numbers with the given
precision.
The returned function determines how many values at the given precision will fit into the range
supplied in its start and end parameters.

**Kind**: static property of <code>[fp](#dc.units.fp)</code>  
**Returns**: <code>function</code> - start-end unit function  

| Param | Type |
| --- | --- |
| precision | <code>Number</code> | 

**Example**  
```js
// specify values (and ticks) every 0.1 units
chart.xUnits(dc.units.fp.precision(0.1)
// there are 500 units between 0.5 and 1 if the precision is 0.001
var thousandths = dc.units.fp.precision(0.001);
thousandths(0.5, 1.0) // returns 500
```
<a name="dc.geoChoroplethChart"></a>
### dc.geoChoroplethChart ⇒ <code>GeoChoroplethChart</code>
The geo choropleth chart is designed as an easy way to create a crossfilter driven choropleth map
from GeoJson data. This chart implementation was inspired by [the great d3 choropleth example](http://bl.ocks.org/4060606).
Examples:
- [US Venture Capital Landscape 2011](http://dc-js.github.com/dc.js/vc/index.html)

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>colorMixin,baseMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a choropleth chart under '#us-chart' element using the default global chart group
var chart1 = dc.geoChoroplethChart('#us-chart');
// create a choropleth chart under '#us-chart2' element using chart group A
var chart2 = dc.compositeChart('#us-chart2', 'chartGroupA');
```

* [.geoChoroplethChart](#dc.geoChoroplethChart) ⇒ <code>GeoChoroplethChart</code>
  * [.overlayGeoJson](#dc.geoChoroplethChart+overlayGeoJson) ⇒ <code>Chart</code>
  * [.projection](#dc.geoChoroplethChart+projection) ⇒ <code>Chart</code>
  * [.geoJsons](#dc.geoChoroplethChart+geoJsons) ⇒ <code>Array.&lt;{name:String, data: Object, accessor: function()}&gt;</code>
  * [.geoPath](#dc.geoChoroplethChart+geoPath) ⇒ <code>d3.geo.path</code>
  * [.removeGeoJson](#dc.geoChoroplethChart+removeGeoJson) ⇒ <code>Chart</code>

<a name="dc.geoChoroplethChart+overlayGeoJson"></a>
#### geoChoroplethChart.overlayGeoJson ⇒ <code>Chart</code>
**mandatory**

Use this function to insert a new GeoJson map layer. This function can be invoked multiple times
if you have multiple GeoJson data layers to render on top of each other. If you overlay multiple
layers with the same name the new overlay will override the existing one.

**Kind**: instance property of <code>[geoChoroplethChart](#dc.geoChoroplethChart)</code>  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>Object</code> | a geojson feed |
| name | <code>String</code> | name of the layer |
| keyAccessor | <code>function</code> | accessor function used to extract 'key' from the GeoJson data. The key extracted by this function should match the keys returned by the crossfilter groups. |

**Example**  
```js
// insert a layer for rendering US states
chart.overlayGeoJson(statesJson.features, 'state', function(d) {
     return d.properties.name;
});
```
<a name="dc.geoChoroplethChart+projection"></a>
#### geoChoroplethChart.projection ⇒ <code>Chart</code>
Set custom geo projection function. See the available [d3 geo projection
functions](https://github.com/mbostock/d3/wiki/Geo-Projections).

**Kind**: instance property of <code>[geoChoroplethChart](#dc.geoChoroplethChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [projection] | <code>d3.projection</code> | <code>d3.projection.albersUsa()</code> | 

<a name="dc.geoChoroplethChart+geoJsons"></a>
#### geoChoroplethChart.geoJsons ⇒ <code>Array.&lt;{name:String, data: Object, accessor: function()}&gt;</code>
Returns all GeoJson layers currently registered with this chart. The returned array is a
reference to this chart's internal data structure, so any modification to this array will also
modify this chart's internal registration.

**Kind**: instance property of <code>[geoChoroplethChart](#dc.geoChoroplethChart)</code>  
<a name="dc.geoChoroplethChart+geoPath"></a>
#### geoChoroplethChart.geoPath ⇒ <code>d3.geo.path</code>
Returns the [d3.geo.path](https://github.com/mbostock/d3/wiki/Geo-Paths#path) object used to
render the projection and features.  Can be useful for figuring out the bounding box of the
feature set and thus a way to calculate scale and translation for the projection.

**Kind**: instance property of <code>[geoChoroplethChart](#dc.geoChoroplethChart)</code>  
<a name="dc.geoChoroplethChart+removeGeoJson"></a>
#### geoChoroplethChart.removeGeoJson ⇒ <code>Chart</code>
Remove a GeoJson layer from this chart by name

**Kind**: instance property of <code>[geoChoroplethChart](#dc.geoChoroplethChart)</code>  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="dc.heatMap"></a>
### dc.heatMap ⇒ <code>HeatMap</code>
A heat map is matrix that represents the values of two dimensions of data using colors.

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>colorMixin,marginMixin,baseMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a heat map under #chart-container1 element using the default global chart group
var heatMap1 = dc.heatMap('#chart-container1');
// create a heat map under #chart-container2 element using chart group A
var heatMap2 = dc.heatMap('#chart-container2', 'chartGroupA');
```

* [.heatMap](#dc.heatMap) ⇒ <code>HeatMap</code>
  * [.colsLabel](#dc.heatMap+colsLabel) ⇒ <code>Chart</code>
  * [.rowsLabel](#dc.heatMap+rowsLabel) ⇒ <code>Chart</code>
  * [.rows](#dc.heatMap+rows) ⇒ <code>Chart</code>
  * [.cols](#dc.heatMap+cols) ⇒ <code>Chart</code>
  * [.boxOnClick](#dc.heatMap+boxOnClick) ⇒ <code>Chart</code>
  * [.xAxisOnClick](#dc.heatMap+xAxisOnClick) ⇒ <code>Chart</code>
  * [.yAxisOnClick](#dc.heatMap+yAxisOnClick) ⇒ <code>Chart</code>
  * [.xBorderRadius](#dc.heatMap+xBorderRadius) ⇒ <code>Chart</code>
  * [.yBorderRadius](#dc.heatMap+yBorderRadius) ⇒ <code>Chart</code>

<a name="dc.heatMap+colsLabel"></a>
#### heatMap.colsLabel ⇒ <code>Chart</code>
Set or get the column label function. The chart class uses this function to render
column labels on the X axis. It is passed the column name.

**Kind**: instance property of <code>[heatMap](#dc.heatMap)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [labelFunction] | <code>function</code> | <code>function(d) { return d; }</code> | 

**Example**  
```js
// the default label function just returns the name
chart.colsLabel(function(d) { return d; });
```
<a name="dc.heatMap+rowsLabel"></a>
#### heatMap.rowsLabel ⇒ <code>Chart</code>
Set or get the row label function. The chart class uses this function to render
row labels on the Y axis. It is passed the row name.

**Kind**: instance property of <code>[heatMap](#dc.heatMap)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [labelFunction] | <code>function</code> | <code>function(d) { return d; }</code> | 

**Example**  
```js
// the default label function just returns the name
chart.rowsLabel(function(d) { return d; });
```
<a name="dc.heatMap+rows"></a>
#### heatMap.rows ⇒ <code>Chart</code>
Gets or sets the values used to create the rows of the heatmap, as an array. By default, all
the values will be fetched from the data using the value accessor, and they will be sorted in
ascending order.

**Kind**: instance property of <code>[heatMap](#dc.heatMap)</code>  

| Param | Type |
| --- | --- |
| [rows] | <code>Array.&lt;(String\|Number)&gt;</code> | 

<a name="dc.heatMap+cols"></a>
#### heatMap.cols ⇒ <code>Chart</code>
Gets or sets the keys used to create the columns of the heatmap, as an array. By default, all
the values will be fetched from the data using the key accessor, and they will be sorted in
ascending order.

**Kind**: instance property of <code>[heatMap](#dc.heatMap)</code>  

| Param | Type |
| --- | --- |
| [cols] | <code>Array.&lt;(String\|Number)&gt;</code> | 

<a name="dc.heatMap+boxOnClick"></a>
#### heatMap.boxOnClick ⇒ <code>Chart</code>
Gets or sets the handler that fires when an individual cell is clicked in the heatmap.
By default, filtering of the cell will be toggled.

**Kind**: instance property of <code>[heatMap](#dc.heatMap)</code>  

| Param | Type |
| --- | --- |
| [handler] | <code>function</code> | 

<a name="dc.heatMap+xAxisOnClick"></a>
#### heatMap.xAxisOnClick ⇒ <code>Chart</code>
Gets or sets the handler that fires when a column tick is clicked in the x axis.
By default, if any cells in the column are unselected, the whole column will be selected,
otherwise the whole column will be unselected.

**Kind**: instance property of <code>[heatMap](#dc.heatMap)</code>  

| Param | Type |
| --- | --- |
| [handler] | <code>function</code> | 

<a name="dc.heatMap+yAxisOnClick"></a>
#### heatMap.yAxisOnClick ⇒ <code>Chart</code>
Gets or sets the handler that fires when a row tick is clicked in the y axis.
By default, if any cells in the row are unselected, the whole row will be selected,
otherwise the whole row will be unselected.

**Kind**: instance property of <code>[heatMap](#dc.heatMap)</code>  

| Param | Type |
| --- | --- |
| [handler] | <code>function</code> | 

<a name="dc.heatMap+xBorderRadius"></a>
#### heatMap.xBorderRadius ⇒ <code>Chart</code>
Gets or sets the X border radius.  Set to 0 to get full rectangles.

**Kind**: instance property of <code>[heatMap](#dc.heatMap)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [xBorderRadius] | <code>Number</code> | <code>6.75</code> | 

<a name="dc.heatMap+yBorderRadius"></a>
#### heatMap.yBorderRadius ⇒ <code>Chart</code>
Gets or sets the Y border radius.  Set to 0 to get full rectangles.

**Kind**: instance property of <code>[heatMap](#dc.heatMap)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [yBorderRadius] | <code>Number</code> | <code>6.75</code> | 

<a name="dc.legend"></a>
### dc.legend ⇒ <code>Legend</code>
Legend is a attachable widget that can be added to other dc charts to render horizontal legend
labels.
Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: static property of <code>[dc](#dc)</code>  
**Example**  
```js
chart.legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
```

* [.legend](#dc.legend) ⇒ <code>Legend</code>
  * [.x](#dc.legend+x) ⇒ <code>Legend</code>
  * [.y](#dc.legend+y) ⇒ <code>Legend</code>
  * [.gap](#dc.legend+gap) ⇒ <code>Legend</code>
  * [.itemHeight](#dc.legend+itemHeight) ⇒ <code>Legend</code>
  * [.horizontal](#dc.legend+horizontal) ⇒ <code>Legend</code>
  * [.legendWidth](#dc.legend+legendWidth) ⇒ <code>Legend</code>
  * [.itemWidth](#dc.legend+itemWidth) ⇒ <code>Legend</code>
  * [.autoItemWidth](#dc.legend+autoItemWidth) ⇒ <code>Legend</code>

<a name="dc.legend+x"></a>
#### legend.x ⇒ <code>Legend</code>
Set or get x coordinate for legend widget.

**Kind**: instance property of <code>[legend](#dc.legend)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>Number</code> | <code>0</code> | 

<a name="dc.legend+y"></a>
#### legend.y ⇒ <code>Legend</code>
Set or get y coordinate for legend widget.

**Kind**: instance property of <code>[legend](#dc.legend)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [y] | <code>Number</code> | <code>0</code> | 

<a name="dc.legend+gap"></a>
#### legend.gap ⇒ <code>Legend</code>
Set or get gap between legend items.

**Kind**: instance property of <code>[legend](#dc.legend)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [gap] | <code>Number</code> | <code>5</code> | 

<a name="dc.legend+itemHeight"></a>
#### legend.itemHeight ⇒ <code>Legend</code>
Set or get legend item height.

**Kind**: instance property of <code>[legend](#dc.legend)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [itemHeight] | <code>Number</code> | <code>12</code> | 

<a name="dc.legend+horizontal"></a>
#### legend.horizontal ⇒ <code>Legend</code>
Position legend horizontally instead of vertically.

**Kind**: instance property of <code>[legend](#dc.legend)</code>  

| Param | Type |
| --- | --- |
| [horizontal] | <code>Boolean</code> | 

<a name="dc.legend+legendWidth"></a>
#### legend.legendWidth ⇒ <code>Legend</code>
Maximum width for horizontal legend.

**Kind**: instance property of <code>[legend](#dc.legend)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [legendWidth] | <code>Number</code> | <code>500</code> | 

<a name="dc.legend+itemWidth"></a>
#### legend.itemWidth ⇒ <code>Legend</code>
legendItem width for horizontal legend.

**Kind**: instance property of <code>[legend](#dc.legend)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [itemWidth] | <code>Number</code> | <code>70</code> | 

<a name="dc.legend+autoItemWidth"></a>
#### legend.autoItemWidth ⇒ <code>Legend</code>
Turn automatic width for legend items on or off. If true, itemWidth() is ignored.
This setting takes into account gap().

**Kind**: instance property of <code>[legend](#dc.legend)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [autoItemWidth] | <code>Boolean</code> | <code>false</code> | 

<a name="dc.lineChart"></a>
### dc.lineChart ⇒ <code>LineChart</code>
Concrete line/area chart implementation.
Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>stackMixin,coordinateGridMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a line chart under #chart-container1 element using the default global chart group
var chart1 = dc.lineChart('#chart-container1');
// create a line chart under #chart-container2 element using chart group A
var chart2 = dc.lineChart('#chart-container2', 'chartGroupA');
// create a sub-chart under a composite parent chart
var chart3 = dc.lineChart(compositeChart);
```

* [.lineChart](#dc.lineChart) ⇒ <code>LineChart</code>
  * [.interpolate](#dc.lineChart+interpolate) ⇒ <code>Chart</code>
  * [.tension](#dc.lineChart+tension) ⇒ <code>Chart</code>
  * [.defined](#dc.lineChart+defined) ⇒ <code>Chart</code>
  * [.dashStyle](#dc.lineChart+dashStyle) ⇒ <code>Chart</code>
  * [.renderArea](#dc.lineChart+renderArea) ⇒ <code>Chart</code>
  * [.xyTipsOn](#dc.lineChart+xyTipsOn) ⇒ <code>Chart</code>
  * [.dotRadius](#dc.lineChart+dotRadius) ⇒ <code>Chart</code>
  * [.renderDataPoints](#dc.lineChart+renderDataPoints) ⇒ <code>Chart</code>

<a name="dc.lineChart+interpolate"></a>
#### lineChart.interpolate ⇒ <code>Chart</code>
Gets or sets the interpolator to use for lines drawn, by string name, allowing e.g. step
functions, splines, and cubic interpolation.  This is passed to
[d3.svg.line.interpolate](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate) and
[d3.svg.area.interpolate](https://github.com/mbostock/d3/wiki/SVG-Shapes#area_interpolate),
where you can find a complete list of valid arguments

**Kind**: instance property of <code>[lineChart](#dc.lineChart)</code>  

| Param | Type |
| --- | --- |
| [interpolate] | <code>String</code> | 

<a name="dc.lineChart+tension"></a>
#### lineChart.tension ⇒ <code>Chart</code>
Gets or sets the tension to use for lines drawn, in the range 0 to 1.
This parameter further customizes the interpolation behavior.  It is passed to
[d3.svg.line.tension](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_tension) and
[d3.svg.area.tension](https://github.com/mbostock/d3/wiki/SVG-Shapes#area_tension).

**Kind**: instance property of <code>[lineChart](#dc.lineChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [tension] | <code>Number</code> | <code>0.7</code> | 

<a name="dc.lineChart+defined"></a>
#### lineChart.defined ⇒ <code>Chart</code>
Gets or sets a function that will determine discontinuities in the line which should be
skipped: the path will be broken into separate subpaths if some points are undefined.
This function is passed to
[d3.svg.line.defined](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_defined)

Note: crossfilter will sometimes coerce nulls to 0, so you may need to carefully write
custom reduce functions to get this to work, depending on your data. See
https://github.com/dc-js/dc.js/issues/615#issuecomment-49089248

**Kind**: instance property of <code>[lineChart](#dc.lineChart)</code>  

| Param | Type |
| --- | --- |
| [defined] | <code>function</code> | 

<a name="dc.lineChart+dashStyle"></a>
#### lineChart.dashStyle ⇒ <code>Chart</code>
Set the line's d3 dashstyle. This value becomes the 'stroke-dasharray' of line. Defaults to empty
array (solid line).

**Kind**: instance property of <code>[lineChart](#dc.lineChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [dashStyle] | <code>Array.&lt;Number&gt;</code> | <code>[]</code> | 

**Example**  
```js
// create a Dash Dot Dot Dot
chart.dashStyle([3,1,1,1]);
```
<a name="dc.lineChart+renderArea"></a>
#### lineChart.renderArea ⇒ <code>Chart</code>
Get or set render area flag. If the flag is set to true then the chart will render the area
beneath each line and the line chart effectively becomes an area chart.

**Kind**: instance property of <code>[lineChart](#dc.lineChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [renderArea] | <code>Boolean</code> | <code>false</code> | 

<a name="dc.lineChart+xyTipsOn"></a>
#### lineChart.xyTipsOn ⇒ <code>Chart</code>
Turn on/off the mouseover behavior of an individual data point which renders a circle and x/y axis
dashed lines back to each respective axis.  This is ignored if the chart brush is on (`brushOn`)

**Kind**: instance property of <code>[lineChart](#dc.lineChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [xyTipsOn] | <code>Boolean</code> | <code>false</code> | 

<a name="dc.lineChart+dotRadius"></a>
#### lineChart.dotRadius ⇒ <code>Chart</code>
Get or set the radius (in px) for dots displayed on the data points.

**Kind**: instance property of <code>[lineChart](#dc.lineChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [dotRadius] | <code>Number</code> | <code>5</code> | 

<a name="dc.lineChart+renderDataPoints"></a>
#### lineChart.renderDataPoints ⇒ <code>Chart</code>
Always show individual dots for each datapoint.
If `options` is falsy, it disables data point rendering.

If no `options` are provided, the current `options` values are instead returned.

**Kind**: instance property of <code>[lineChart](#dc.lineChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>Object</code> | <code>{fillOpacity: 0.8, strokeOpacity: 0.8, radius: 2}</code> | 

**Example**  
```js
chart.renderDataPoints({radius: 2, fillOpacity: 0.8, strokeOpacity: 0.8})
```
<a name="dc.numberDisplay"></a>
### dc.numberDisplay ⇒ <code>NumberDisplay</code>
A display of a single numeric value.
Unlike other charts, you do not need to set a dimension. Instead a group object must be provided and
a valueAccessor that returns a single value.

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>baseMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a number display under #chart-container1 element using the default global chart group
var display1 = dc.numberDisplay('#chart-container1');
```

* [.numberDisplay](#dc.numberDisplay) ⇒ <code>NumberDisplay</code>
  * [.html](#dc.numberDisplay+html) ⇒ <code>Chart</code>
  * [.value](#dc.numberDisplay+value) ⇒ <code>Number</code>
  * [.formatNumber](#dc.numberDisplay+formatNumber) ⇒ <code>Chart</code>

<a name="dc.numberDisplay+html"></a>
#### numberDisplay.html ⇒ <code>Chart</code>
Gets or sets an optional object specifying HTML templates to use depending on the number
displayed.  The text `%number` will be replaced with the current value.
- one: HTML template to use if the number is 1
- zero: HTML template to use if the number is 0
- some: HTML template to use otherwise

**Kind**: instance property of <code>[numberDisplay](#dc.numberDisplay)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [externalRadiusPadding] | <code>Object</code> | <code>0</code> | 

**Example**  
```js
numberWidget.html({
     one:'%number record',
     some:'%number records',
     none:'no records'})
```
<a name="dc.numberDisplay+value"></a>
#### numberDisplay.value ⇒ <code>Number</code>
Calculate and return the underlying value of the display

**Kind**: instance property of <code>[numberDisplay](#dc.numberDisplay)</code>  
<a name="dc.numberDisplay+formatNumber"></a>
#### numberDisplay.formatNumber ⇒ <code>Chart</code>
Get or set a function to format the value for the display.

**Kind**: instance property of <code>[numberDisplay](#dc.numberDisplay)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [formatter] | <code>function</code> | <code>d3.format(&#x27;.2s&#x27;)</code> | 

<a name="dc.pieChart"></a>
### dc.pieChart ⇒ <code>PieChart</code>
The pie chart implementation is usually used to visualize a small categorical distribution.  The pie
chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
slice relative to the sum of all values. Slices are ordered by `.ordering` which defaults to sorting
by key.

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>capMixin,colorMixin,baseMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a pie chart under #chart-container1 element using the default global chart group
var chart1 = dc.pieChart('#chart-container1');
// create a pie chart under #chart-container2 element using chart group A
var chart2 = dc.pieChart('#chart-container2', 'chartGroupA');
```

* [.pieChart](#dc.pieChart) ⇒ <code>PieChart</code>
  * [.slicesCap](#dc.pieChart+slicesCap) ⇒ <code>Chart</code>
  * [.externalRadiusPadding](#dc.pieChart+externalRadiusPadding) ⇒ <code>Chart</code>
  * [.innerRadius](#dc.pieChart+innerRadius) ⇒ <code>Chart</code>
  * [.radius](#dc.pieChart+radius) ⇒ <code>Chart</code>
  * [.cx](#dc.pieChart+cx) ⇒ <code>Chart</code>
  * [.cy](#dc.pieChart+cy) ⇒ <code>Chart</code>
  * [.minAngleForLabel](#dc.pieChart+minAngleForLabel) ⇒ <code>Chart</code>
  * [.emptyTitle](#dc.pieChart+emptyTitle) ⇒ <code>Chart</code>
  * [.externalLabels](#dc.pieChart+externalLabels) ⇒ <code>Chart</code>

<a name="dc.pieChart+slicesCap"></a>
#### pieChart.slicesCap ⇒ <code>Chart</code>
Get or set the maximum number of slices the pie chart will generate. The top slices are determined by
value from high to low. Other slices exeeding the cap will be rolled up into one single *Others* slice.

**Kind**: instance property of <code>[pieChart](#dc.pieChart)</code>  

| Param | Type |
| --- | --- |
| [cap] | <code>Number</code> | 

<a name="dc.pieChart+externalRadiusPadding"></a>
#### pieChart.externalRadiusPadding ⇒ <code>Chart</code>
Get or set the external radius padding of the pie chart. This will force the radius of the
pie chart to become smaller or larger depending on the value.

**Kind**: instance property of <code>[pieChart](#dc.pieChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [externalRadiusPadding] | <code>Number</code> | <code>0</code> | 

<a name="dc.pieChart+innerRadius"></a>
#### pieChart.innerRadius ⇒ <code>Chart</code>
Get or set the inner radius of the pie chart. If the inner radius is greater than 0px then the
pie chart will be rendered as a doughnut chart.

**Kind**: instance property of <code>[pieChart](#dc.pieChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [innerRadius] | <code>Number</code> | <code>0</code> | 

<a name="dc.pieChart+radius"></a>
#### pieChart.radius ⇒ <code>Chart</code>
Get or set the outer radius. If the radius is not set, it will be half of the minimum of the
chart width and height.

**Kind**: instance property of <code>[pieChart](#dc.pieChart)</code>  

| Param | Type |
| --- | --- |
| [radius] | <code>Number</code> | 

<a name="dc.pieChart+cx"></a>
#### pieChart.cx ⇒ <code>Chart</code>
Get or set center x coordinate position. Default is center of svg.

**Kind**: instance property of <code>[pieChart](#dc.pieChart)</code>  

| Param | Type |
| --- | --- |
| [cx] | <code>Number</code> | 

<a name="dc.pieChart+cy"></a>
#### pieChart.cy ⇒ <code>Chart</code>
Get or set center y coordinate position. Default is center of svg.

**Kind**: instance property of <code>[pieChart](#dc.pieChart)</code>  

| Param | Type |
| --- | --- |
| [cy] | <code>Number</code> | 

<a name="dc.pieChart+minAngleForLabel"></a>
#### pieChart.minAngleForLabel ⇒ <code>Chart</code>
Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
display a slice label.

**Kind**: instance property of <code>[pieChart](#dc.pieChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [minAngleForLabel] | <code>Number</code> | <code>0.5</code> | 

<a name="dc.pieChart+emptyTitle"></a>
#### pieChart.emptyTitle ⇒ <code>Chart</code>
Title to use for the only slice when there is no data.

**Kind**: instance property of <code>[pieChart](#dc.pieChart)</code>  

| Param | Type |
| --- | --- |
| [title] | <code>String</code> | 

<a name="dc.pieChart+externalLabels"></a>
#### pieChart.externalLabels ⇒ <code>Chart</code>
Position slice labels offset from the outer edge of the chart

The given argument sets the radial offset.

**Kind**: instance property of <code>[pieChart](#dc.pieChart)</code>  

| Param | Type |
| --- | --- |
| [radius] | <code>Number</code> | 

<a name="dc.rowChart"></a>
### dc.rowChart ⇒ <code>RowChart</code>
Concrete row chart implementation.

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>capMixin,marginMixin,colorMixin,baseMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a row chart under #chart-container1 element using the default global chart group
var chart1 = dc.rowChart('#chart-container1');
// create a row chart under #chart-container2 element using chart group A
var chart2 = dc.rowChart('#chart-container2', 'chartGroupA');
```

* [.rowChart](#dc.rowChart) ⇒ <code>RowChart</code>
  * [.x](#dc.rowChart+x) ⇒ <code>Chart</code>
  * [.renderTitleLabel](#dc.rowChart+renderTitleLabel) ⇒ <code>Chart</code>
  * [.xAxis](#dc.rowChart+xAxis) ⇒ <code>d3.svg.Axis</code>
  * [.fixedBarHeight](#dc.rowChart+fixedBarHeight) ⇒ <code>Chart</code>
  * [.gap](#dc.rowChart+gap) ⇒ <code>Chart</code>
  * [.elasticX](#dc.rowChart+elasticX) ⇒ <code>Chart</code>
  * [.labelOffsetX](#dc.rowChart+labelOffsetX) ⇒ <code>Chart</code>
  * [.labelOffsetY](#dc.rowChart+labelOffsetY) ⇒ <code>Chart</code>
  * [.titleLabelOffsetX](#dc.rowChart+titleLabelOffsetX) ⇒ <code>Chart</code>

<a name="dc.rowChart+x"></a>
#### rowChart.x ⇒ <code>Chart</code>
Gets or sets the x scale. The x scale can be any d3
[quantitive scale](https://github.com/mbostock/d3/wiki/Quantitative-Scales)

**Kind**: instance property of <code>[rowChart](#dc.rowChart)</code>  

| Param | Type |
| --- | --- |
| [scale] | <code>d3.scale</code> | 

<a name="dc.rowChart+renderTitleLabel"></a>
#### rowChart.renderTitleLabel ⇒ <code>Chart</code>
Turn on/off Title label rendering (values) using SVG style of text-anchor 'end'

**Kind**: instance property of <code>[rowChart](#dc.rowChart)</code>  

| Param | Type |
| --- | --- |
| [renderTitleLabel] | <code>Boolean</code> | 

<a name="dc.rowChart+xAxis"></a>
#### rowChart.xAxis ⇒ <code>d3.svg.Axis</code>
Get the x axis for the row chart instance.  Note: not settable for row charts.
See the [d3 axis object](https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-axis) documention for more information.

**Kind**: instance property of <code>[rowChart](#dc.rowChart)</code>  
**Example**  
```js
// customize x axis tick format
chart.xAxis().tickFormat(function (v) {return v + '%';});
// customize x axis tick values
chart.xAxis().tickValues([0, 100, 200, 300]);
```
<a name="dc.rowChart+fixedBarHeight"></a>
#### rowChart.fixedBarHeight ⇒ <code>Chart</code>
Get or set the fixed bar height. Default is [false] which will auto-scale bars.
For example, if you want to fix the height for a specific number of bars (useful in TopN charts)
you could fix height as follows (where count = total number of bars in your TopN and gap is
your vertical gap space).

**Kind**: instance property of <code>[rowChart](#dc.rowChart)</code>  

| Param | Type |
| --- | --- |
| [height] | <code>Number</code> | 

**Example**  
```js
chart.fixedBarHeight( chartheight - (count + 1) * gap / count);
```
<a name="dc.rowChart+gap"></a>
#### rowChart.gap ⇒ <code>Chart</code>
Get or set the vertical gap space between rows on a particular row chart instance

**Kind**: instance property of <code>[rowChart](#dc.rowChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [gap] | <code>Number</code> | <code>5</code> | 

<a name="dc.rowChart+elasticX"></a>
#### rowChart.elasticX ⇒ <code>Chart</code>
Get or set the elasticity on x axis. If this attribute is set to true, then the x axis will rescle to auto-fit the
data range when filtered.

**Kind**: instance property of <code>[rowChart](#dc.rowChart)</code>  

| Param | Type |
| --- | --- |
| [elasticX] | <code>Boolean</code> | 

<a name="dc.rowChart+labelOffsetX"></a>
#### rowChart.labelOffsetX ⇒ <code>Chart</code>
Get or set the x offset (horizontal space to the top left corner of a row) for labels on a particular row chart.

**Kind**: instance property of <code>[rowChart](#dc.rowChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [labelOffsetX] | <code>Number</code> | <code>10</code> | 

<a name="dc.rowChart+labelOffsetY"></a>
#### rowChart.labelOffsetY ⇒ <code>Chart</code>
Get or set the y offset (vertical space to the top left corner of a row) for labels on a particular row chart.

**Kind**: instance property of <code>[rowChart](#dc.rowChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [labelOffsety] | <code>Number</code> | <code>15</code> | 

<a name="dc.rowChart+titleLabelOffsetX"></a>
#### rowChart.titleLabelOffsetX ⇒ <code>Chart</code>
Get of set the x offset (horizontal space between right edge of row and right edge or text.

**Kind**: instance property of <code>[rowChart](#dc.rowChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>Number</code> | <code>2</code> | 

<a name="dc.scatterPlot"></a>
### dc.scatterPlot ⇒ <code>SeriesChart</code>
A scatter plot chart

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>coordinateGridMixin</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a scatter plot under #chart-container1 element using the default global chart group
var chart1 = dc.scatterPlot('#chart-container1');
// create a scatter plot under #chart-container2 element using chart group A
var chart2 = dc.scatterPlot('#chart-container2', 'chartGroupA');
// create a sub-chart under a composite parent chart
var chart3 = dc.scatterPlot(compositeChart);
```

* [.scatterPlot](#dc.scatterPlot) ⇒ <code>SeriesChart</code>
  * [.existenceAccessor](#dc.scatterPlot+existenceAccessor) ⇒ <code>Chart</code>
  * [.symbol](#dc.scatterPlot+symbol) ⇒ <code>Chart</code>
  * [.symbolSize](#dc.scatterPlot+symbolSize) ⇒ <code>Chart</code>
  * [.highlightedSize](#dc.scatterPlot+highlightedSize) ⇒ <code>Chart</code>
  * [.hiddenSize](#dc.scatterPlot+hiddenSize) ⇒ <code>Chart</code>

<a name="dc.scatterPlot+existenceAccessor"></a>
#### scatterPlot.existenceAccessor ⇒ <code>Chart</code>
Get or set the existence accessor.  If a point exists, it is drawn with symbolSize radius and
opacity 1; if it does not exist, it is drawn with hiddenSize radius and opacity 0. By default,
the existence accessor checks if the reduced value is truthy.

**Kind**: instance property of <code>[scatterPlot](#dc.scatterPlot)</code>  

| Param | Type |
| --- | --- |
| [accessor] | <code>function</code> | 

<a name="dc.scatterPlot+symbol"></a>
#### scatterPlot.symbol ⇒ <code>Chart</code>
Get or set the symbol type used for each point. By default the symbol is a circle. See the D3
[docs](https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-symbol_type) for acceptable types.
Type can be a constant or an accessor.

**Kind**: instance property of <code>[scatterPlot](#dc.scatterPlot)</code>  

| Param | Type |
| --- | --- |
| [type] | <code>function</code> | 

<a name="dc.scatterPlot+symbolSize"></a>
#### scatterPlot.symbolSize ⇒ <code>Chart</code>
Set or get radius for symbols.

**Kind**: instance property of <code>[scatterPlot](#dc.scatterPlot)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [radius] | <code>Number</code> | <code>3</code> | 

<a name="dc.scatterPlot+highlightedSize"></a>
#### scatterPlot.highlightedSize ⇒ <code>Chart</code>
Set or get radius for highlighted symbols.

**Kind**: instance property of <code>[scatterPlot](#dc.scatterPlot)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [radius] | <code>Number</code> | <code>4</code> | 

<a name="dc.scatterPlot+hiddenSize"></a>
#### scatterPlot.hiddenSize ⇒ <code>Chart</code>
Set or get radius for symbols when the group is empty.

**Kind**: instance property of <code>[scatterPlot](#dc.scatterPlot)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [radius] | <code>Number</code> | <code>0</code> | 

<a name="dc.seriesChart"></a>
### dc.seriesChart ⇒ <code>SeriesChart</code>
A series chart is a chart that shows multiple series of data overlaid on one chart, where the
series is specified in the data. It is a specialization of Composite Chart and inherits all
composite features other than recomposing the chart.

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>compositeChart</code>  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> &#124; <code>node</code> &#124; <code>d3.selection</code> &#124; <code>dc.compositeChart</code> | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a series chart under #chart-container1 element using the default global chart group
var seriesChart1 = dc.seriesChart("#chart-container1");
// create a series chart under #chart-container2 element using chart group A
var seriesChart2 = dc.seriesChart("#chart-container2", "chartGroupA");
```

* [.seriesChart](#dc.seriesChart) ⇒ <code>SeriesChart</code>
  * [.chart](#dc.seriesChart+chart) ⇒ <code>Chart</code>
  * [.seriesAccessor](#dc.seriesChart+seriesAccessor) ⇒ <code>Chart</code>
  * [.seriesSort](#dc.seriesChart+seriesSort) ⇒ <code>Chart</code>
  * [.valueSort](#dc.seriesChart+valueSort) ⇒ <code>Chart</code>

<a name="dc.seriesChart+chart"></a>
#### seriesChart.chart ⇒ <code>Chart</code>
Get or set the chart function, which generates the child charts.

**Kind**: instance property of <code>[seriesChart](#dc.seriesChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| chartFunction | <code>function</code> | <code>dc.lineChart</code> | 

**Example**  
```js
// put interpolation on the line charts used for the series
chart.chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
// do a scatter series chart
chart.chart(dc.scatterPlot)
```
<a name="dc.seriesChart+seriesAccessor"></a>
#### seriesChart.seriesAccessor ⇒ <code>Chart</code>
Get or set accessor function for the displayed series. Given a datum, this function
should return the series that datum belongs to.

**Kind**: instance property of <code>[seriesChart](#dc.seriesChart)</code>  

| Param | Type |
| --- | --- |
| [accessor] | <code>function</code> | 

<a name="dc.seriesChart+seriesSort"></a>
#### seriesChart.seriesSort ⇒ <code>Chart</code>
Get or set a function to sort the list of series by, given series values.

**Kind**: instance property of <code>[seriesChart](#dc.seriesChart)</code>  

| Param | Type |
| --- | --- |
| [sortFunction] | <code>function</code> | 

**Example**  
```js
chart.seriesSort(d3.descending);
```
<a name="dc.seriesChart+valueSort"></a>
#### seriesChart.valueSort ⇒ <code>Chart</code>
Get or set a function to sort each series values by. By default this is the key accessor which,
for example, will ensure a lineChart series connects its points in increasing key/x order,
rather than haphazardly.

**Kind**: instance property of <code>[seriesChart](#dc.seriesChart)</code>  

| Param | Type |
| --- | --- |
| [sortFunction] | <code>function</code> | 

