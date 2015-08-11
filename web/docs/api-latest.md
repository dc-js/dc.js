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
