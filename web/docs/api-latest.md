<a name="barChart"></a>
## barChart ⇒ <code>[barChart](#barChart)</code>
Concrete bar chart/histogram implementation.

**Kind**: global variable  
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

* [barChart](#barChart) ⇒ <code>[barChart](#barChart)</code>
  * [.centerBar](#barChart.centerBar) ⇒ <code>Boolean</code>
  * [.barPadding](#barChart.barPadding) ⇒ <code>Number</code>
  * [.outerPadding](#barChart.outerPadding) ⇒ <code>Number</code>
  * [.gap](#barChart.gap) ⇒ <code>Number</code>
  * [.alwaysUseRounding](#barChart.alwaysUseRounding) ⇒ <code>Boolean</code>

<a name="barChart.centerBar"></a>
### barChart.centerBar ⇒ <code>Boolean</code>
Whether the bar chart will render each bar centered around the data position on x axis

**Kind**: static property of <code>[barChart](#barChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [centerBar] | <code>Boolean</code> | <code>false</code> | 

<a name="barChart.barPadding"></a>
### barChart.barPadding ⇒ <code>Number</code>
Get or set the spacing between bars as a fraction of bar size. Valid values are between 0-1.
Setting this value will also remove any previously set `gap`. See the
[d3 docs](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands)
for a visual description of how the padding is applied.

**Kind**: static property of <code>[barChart](#barChart)</code>  

| Param | Type |
| --- | --- |
| [barPadding] | <code>Number</code> | 

<a name="barChart.outerPadding"></a>
### barChart.outerPadding ⇒ <code>Number</code>
Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
Will pad the width by `padding * barWidth` on each side of the chart.

**Kind**: static property of <code>[barChart](#barChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> | <code>0.5</code> | 

<a name="barChart.gap"></a>
### barChart.gap ⇒ <code>Number</code>
Manually set fixed gap (in px) between bars instead of relying on the default auto-generated
gap.  By default the bar chart implementation will calculate and set the gap automatically
based on the number of data points and the length of the x axis.

**Kind**: static property of <code>[barChart](#barChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [gap] | <code>Number</code> | <code>2</code> | 

<a name="barChart.alwaysUseRounding"></a>
### barChart.alwaysUseRounding ⇒ <code>Boolean</code>
Set or get whether rounding is enabled when bars are centered.  Default: false.  If false, using
rounding with centered bars will result in a warning and rounding will be ignored.  This flag
has no effect if bars are not centered.
When using standard d3.js rounding methods, the brush often doesn't align correctly with
centered bars since the bars are offset.  The rounding function must add an offset to
compensate, such as in the following example.

**Kind**: static property of <code>[barChart](#barChart)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [alwaysUseRounding] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
chart.round(function(n) {return Math.floor(n)+0.5});
```
