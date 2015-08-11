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
  * [.filterAll](#dc.filterAll)
  * [.refocusAll](#dc.refocusAll)
  * [.renderAll](#dc.renderAll)
  * [.redrawAll](#dc.redrawAll)
  * [.disableTransitions](#dc.disableTransitions) : <code>Boolean</code>
  * [.units](#dc.units) : <code>Object</code>
  * [.barChart](#dc.barChart) ⇒ <code>BarChart</code>
    * [.centerBar](#dc.barChart+centerBar) ⇒ <code>Boolean</code>
    * [.barPadding](#dc.barChart+barPadding) ⇒ <code>Number</code>
    * [.outerPadding](#dc.barChart+outerPadding) ⇒ <code>Number</code>
    * [.gap](#dc.barChart+gap) ⇒ <code>Number</code>
    * [.alwaysUseRounding](#dc.barChart+alwaysUseRounding) ⇒ <code>Boolean</code>

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
<a name="dc.barChart"></a>
### dc.barChart ⇒ <code>BarChart</code>
Concrete bar chart/histogram implementation.
Examples:
[Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
[Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: static property of <code>[dc](#dc)</code>  
**Mixes**: <code>StackMixin,CoordinateGridMixin</code>  

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
