## Classes

<dl>
<dt><a href="#Logger">Logger</a></dt>
<dd><p>Provides basis logging and deprecation utilities</p>
</dd>
<dt><a href="#Config">Config</a></dt>
<dd><p>General configuration</p>
</dd>
<dt><a href="#ChartRegistry">ChartRegistry</a></dt>
<dd><p>The ChartRegistry maintains sets of all instantiated dc.js charts under named groups
and the default group. There is a single global ChartRegistry object named <code>chartRegistry</code></p>
<p>A chart group often corresponds to a crossfilter instance. It specifies
the set of charts which should be updated when a filter changes on one of the charts or when the
global functions <a href="#filterAll">filterAll</a>, <a href="#refocusAll">refocusAll</a>,
<a href="#renderAll">renderAll</a>, <a href="#redrawAll">redrawAll</a>, or chart functions
<a href="baseMixin#renderGroup">baseMixin.renderGroup</a>,
<a href="baseMixin#redrawGroup">baseMixin.redrawGroup</a> are called.</p>
</dd>
<dt><a href="#BarChart">BarChart</a></dt>
<dd><p>Concrete bar chart/histogram implementation.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/">Nasdaq 100 Index</a></li>
<li><a href="http://dc-js.github.com/dc.js/crime/index.html">Canadian City Crime Stats</a></li>
</ul>
</dd>
<dt><a href="#BoxPlot">BoxPlot</a></dt>
<dd><p>A box plot is a chart that depicts numerical data via their quartile ranges.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.io/dc.js/examples/boxplot-basic.html">Boxplot Basic example</a></li>
<li><a href="http://dc-js.github.io/dc.js/examples/boxplot-enhanced.html">Boxplot Enhanced example</a></li>
<li><a href="http://dc-js.github.io/dc.js/examples/boxplot-render-data.html">Boxplot Render Data example</a></li>
<li><a href="http://dc-js.github.io/dc.js/examples/boxplot-time.html">Boxplot time example</a></li>
</ul>
</dd>
<dt><a href="#BubbleChart">BubbleChart</a></dt>
<dd><p>A concrete implementation of a general purpose bubble chart that allows data visualization using the
following dimensions:</p>
<ul>
<li>x axis position</li>
<li>y axis position</li>
<li>bubble radius</li>
<li>color</li>
</ul>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/">Nasdaq 100 Index</a></li>
<li><a href="http://dc-js.github.com/dc.js/vc/index.html">US Venture Capital Landscape 2011</a></li>
</ul>
</dd>
<dt><a href="#BubbleOverlay">BubbleOverlay</a></dt>
<dd><p>The bubble overlay chart is quite different from the typical bubble chart. With the bubble overlay
chart you can arbitrarily place bubbles on an existing svg or bitmap image, thus changing the
typical x and y positioning while retaining the capability to visualize data using bubble radius
and coloring.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/crime/index.html">Canadian City Crime Stats</a></li>
</ul>
</dd>
<dt><a href="#CboxMenu">CboxMenu</a></dt>
<dd><p>The CboxMenu is a simple widget designed to filter a dimension by
selecting option(s) from a set of HTML <code>&lt;input /&gt;</code> elements. The menu can be
made into a set of radio buttons (single select) or checkboxes (multiple).</p>
</dd>
<dt><a href="#CompositeChart">CompositeChart</a></dt>
<dd><p>Composite charts are a special kind of chart that render multiple charts on the same Coordinate
Grid. You can overlay (compose) different bar/line/area charts in a single composite chart to
achieve some quite flexible charting effects.</p>
</dd>
<dt><a href="#DataCount">DataCount</a></dt>
<dd><p>The data count widget is a simple widget designed to display the number of records selected by the
current filters out of the total number of records in the data set. Once created the data count widget
will automatically update the text content of child elements with the following classes:</p>
<ul>
<li><code>.total-count</code> - total number of records</li>
<li><code>.filter-count</code> - number of records matched by the current filters</li>
</ul>
<p>Note: this widget works best for the specific case of showing the number of records out of a
total. If you want a more general-purpose numeric display, please use the
<a href="#NumberDisplay">NumberDisplay</a> widget instead.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/">Nasdaq 100 Index</a></li>
</ul>
</dd>
<dt><a href="#DataGrid">DataGrid</a></dt>
<dd><p>Data grid is a simple widget designed to list the filtered records, providing
a simple way to define how the items are displayed.</p>
<p>Note: Formerly the data grid chart (and data table) used the <a href="#DataGrid+group">group</a> attribute as a
keying function for <a href="https://github.com/d3/d3-collection/blob/master/README.md#nest">nesting</a> the data
together in sections.  This was confusing so it has been renamed to <code>section</code>, although <code>group</code> still works.</p>
<p>Examples:</p>
<ul>
<li><a href="https://dc-js.github.io/dc.js/ep/">List of members of the european parliament</a></li>
</ul>
</dd>
<dt><a href="#DataTable">DataTable</a></dt>
<dd><p>The data table is a simple widget designed to list crossfilter focused data set (rows being
filtered) in a good old tabular fashion.</p>
<p>An interesting feature of the data table is that you can pass a crossfilter group to the
<code>dimension</code>, if you want to show aggregated data instead of raw data rows. This requires no
special code as long as you specify the <a href="#DataTable+order">order</a> as <code>d3.descending</code>,
since the data table will use <code>dimension.top()</code> to fetch the data in that case, and the method is
equally supported on the crossfilter group as the crossfilter dimension.</p>
<p>If you want to display aggregated data in ascending order, you will need to wrap the group
in a <a href="https://github.com/dc-js/dc.js/wiki/FAQ#fake-dimensions">fake dimension</a> to support the
<code>.bottom()</code> method. See the example linked below for more details.</p>
<p>Note: Formerly the data table (and data grid chart) used the <a href="#DataTable+group">group</a> attribute as a
keying function for <a href="https://github.com/d3/d3-collection/blob/master/README.md#nest">nesting</a> the data
together in sections.  This was confusing so it has been renamed to <code>section</code>, although <code>group</code> still works.
Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/">Nasdaq 100 Index</a></li>
<li><a href="http://dc-js.github.io/dc.js/examples/table-on-aggregated-data.html">dataTable on a crossfilter group</a>
(<a href="https://github.com/dc-js/dc.js/blob/master/web-src/examples/table-on-aggregated-data.html">source</a>)</li>
</ul>
</dd>
<dt><a href="#GeoChoroplethChart">GeoChoroplethChart</a></dt>
<dd><p>The geo choropleth chart is designed as an easy way to create a crossfilter driven choropleth map
from GeoJson data. This chart implementation was inspired by
<a href="http://bl.ocks.org/4060606">the great d3 choropleth example</a>.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/vc/index.html">US Venture Capital Landscape 2011</a></li>
</ul>
</dd>
<dt><a href="#HeatMap">HeatMap</a></dt>
<dd><p>A heat map is matrix that represents the values of two dimensions of data using colors.</p>
</dd>
<dt><a href="#HtmlLegend">HtmlLegend</a></dt>
<dd><p>htmlLegend is a attachable widget that can be added to other dc charts to render horizontal/vertical legend
labels.</p>
</dd>
<dt><a href="#Legend">Legend</a></dt>
<dd><p>Legend is a attachable widget that can be added to other dc charts to render horizontal legend
labels.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/">Nasdaq 100 Index</a></li>
<li><a href="http://dc-js.github.com/dc.js/crime/index.html">Canadian City Crime Stats</a></li>
</ul>
</dd>
<dt><a href="#LineChart">LineChart</a></dt>
<dd><p>Concrete line/area chart implementation.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/">Nasdaq 100 Index</a></li>
<li><a href="http://dc-js.github.com/dc.js/crime/index.html">Canadian City Crime Stats</a></li>
</ul>
</dd>
<dt><a href="#NumberDisplay">NumberDisplay</a></dt>
<dd><p>A display of a single numeric value.</p>
<p>Unlike other charts, you do not need to set a dimension. Instead a group object must be provided and
a valueAccessor that returns a single value.</p>
<p>If the group is a <a href="https://github.com/crossfilter/crossfilter/wiki/API-Reference#crossfilter_groupAll">groupAll</a>
then its <code>.value()</code> will be displayed. This is the recommended usage.</p>
<p>However, if it is given an ordinary group, the <code>numberDisplay</code> will show the last bin&#39;s value, after
sorting with the <a href="https://dc-js.github.io/dc.js/docs/html/dc.baseMixin.html#ordering__anchor">ordering</a>
function. <code>numberDisplay</code> defaults the <code>ordering</code> function to sorting by value, so this will display
the largest value if the values are numeric.</p>
</dd>
<dt><a href="#PieChart">PieChart</a></dt>
<dd><p>The pie chart implementation is usually used to visualize a small categorical distribution.  The pie
chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
slice relative to the sum of all values. Slices are ordered by <a href="#BaseMixin+ordering">ordering</a>
which defaults to sorting by key.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/">Nasdaq 100 Index</a></li>
</ul>
</dd>
<dt><a href="#RowChart">RowChart</a></dt>
<dd><p>Concrete row chart implementation.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.com/dc.js/">Nasdaq 100 Index</a></li>
</ul>
</dd>
<dt><a href="#ScatterPlot">ScatterPlot</a></dt>
<dd><p>A scatter plot chart</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.io/dc.js/examples/scatter.html">Scatter Chart</a></li>
<li><a href="http://dc-js.github.io/dc.js/examples/multi-scatter.html">Multi-Scatter Chart</a></li>
</ul>
</dd>
<dt><a href="#SelectMenu">SelectMenu</a></dt>
<dd><p>The select menu is a simple widget designed to filter a dimension by selecting an option from
an HTML <code>&lt;select/&gt;</code> menu. The menu can be optionally turned into a multiselect.</p>
</dd>
<dt><a href="#SeriesChart">SeriesChart</a></dt>
<dd><p>A series chart is a chart that shows multiple series of data overlaid on one chart, where the
series is specified in the data. It is a specialization of Composite Chart and inherits all
composite features other than recomposing the chart.</p>
<p>Examples:</p>
<ul>
<li><a href="http://dc-js.github.io/dc.js/examples/series.html">Series Chart</a></li>
</ul>
</dd>
<dt><a href="#SunburstChart">SunburstChart</a></dt>
<dd><p>The sunburst chart implementation is usually used to visualize a small tree distribution.  The sunburst
chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
slice relative to the sum of all values. Slices are ordered by <a href="#BaseMixin+ordering">ordering</a> which defaults to sorting
by key.</p>
<p>The keys used in the sunburst chart should be arrays, representing paths in the tree.</p>
<p>When filtering, the sunburst chart creates instances of <a href="Filters.HierarchyFilter">HierarchyFilter</a>.</p>
</dd>
<dt><a href="#TextFilterWidget">TextFilterWidget</a></dt>
<dd><p>Text Filter Widget</p>
<p>The text filter widget is a simple widget designed to display an input field allowing to filter
data that matches the text typed.
As opposed to the other charts, this doesn&#39;t display any result and doesn&#39;t update its display,
it&#39;s just to input an filter other charts.</p>
</dd>
</dl>

## Mixins

<dl>
<dt><a href="#BaseMixin">BaseMixin</a></dt>
<dd><p><code>BaseMixin</code> is an abstract functional object representing a basic <code>dc</code> chart object
for all chart and widget implementations. Methods from the <a href="#BaseMixin">BaseMixin</a> are inherited
and available on all chart implementations in the <code>dc</code> library.</p>
</dd>
<dt><a href="#ColorMixin">ColorMixin</a> ⇒ <code><a href="#ColorMixin">ColorMixin</a></code></dt>
<dd><p>The Color Mixin is an abstract chart functional class providing universal coloring support
as a mix-in for any concrete chart implementation.</p>
</dd>
<dt><a href="#BubbleMixin">BubbleMixin</a> ⇒ <code><a href="#BubbleMixin">BubbleMixin</a></code></dt>
<dd><p>This Mixin provides reusable functionalities for any chart that needs to visualize data using bubbles.</p>
</dd>
<dt><a href="#CapMixin">CapMixin</a> ⇒ <code><a href="#CapMixin">CapMixin</a></code></dt>
<dd><p>Cap is a mixin that groups small data elements below a <em>cap</em> into an <em>others</em> grouping for both the
Row and Pie Charts.</p>
<p>The top ordered elements in the group up to the cap amount will be kept in the chart, and the rest
will be replaced with an <em>others</em> element, with value equal to the sum of the replaced values. The
keys of the elements below the cap limit are recorded in order to filter by those keys when the
others* element is clicked.</p>
</dd>
<dt><a href="#MarginMixin">MarginMixin</a> ⇒ <code><a href="#MarginMixin">MarginMixin</a></code></dt>
<dd><p>Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
Charts.</p>
</dd>
<dt><a href="#CoordinateGridMixin">CoordinateGridMixin</a></dt>
<dd><p>Coordinate Grid is an abstract base chart designed to support a number of coordinate grid based
concrete chart types, e.g. bar chart, line chart, and bubble chart.</p>
</dd>
<dt><a href="#StackMixin">StackMixin</a></dt>
<dd><p>Stack Mixin is an mixin that provides cross-chart support of stackability using d3.stack.</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#filters">filters</a> : <code>object</code></dt>
<dd><p>The dc.js filters are functions which are passed into crossfilter to chose which records will be
accumulated to produce values for the charts.  In the crossfilter model, any filters applied on one
dimension will affect all the other dimensions but not that one.  dc always applies a filter
function to the dimension; the function combines multiple filters and if any of them accept a
record, it is filtered in.</p>
<p>These filter constructors are used as appropriate by the various charts to implement brushing.  We
mention below which chart uses which filter.  In some cases, many instances of a filter will be added.</p>
<p>Each of the dc.js filters is an object with the following properties:</p>
<ul>
<li><code>isFiltered</code> - a function that returns true if a value is within the filter</li>
<li><code>filterType</code> - a string identifying the filter, here the name of the constructor</li>
</ul>
<p>Currently these filter objects are also arrays, but this is not a requirement. Custom filters
can be used as long as they have the properties above.</p>
</dd>
<dt><a href="#utils">utils</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#printers">printers</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#units">units</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#registerChart">registerChart(chart, [group])</a> ⇒ <code>undefined</code></dt>
<dd><p>Add given chart instance to the given group, creating the group if necessary.
If no group is provided, the default group <code>constants.DEFAULT_CHART_GROUP</code> will be used.</p>
</dd>
<dt><a href="#deregisterChart">deregisterChart(chart, [group])</a> ⇒ <code>undefined</code></dt>
<dd><p>Remove given chart instance from the given group, creating the group if necessary.
If no group is provided, the default group <code>constants.DEFAULT_CHART_GROUP</code> will be used.</p>
</dd>
<dt><a href="#hasChart">hasChart(chart)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Determine if a given chart instance resides in any group in the registry.</p>
</dd>
<dt><a href="#deregisterAllCharts">deregisterAllCharts(group)</a> ⇒ <code>undefined</code></dt>
<dd><p>Clear given group if one is provided, otherwise clears all groups.</p>
</dd>
<dt><a href="#filterAll">filterAll([group])</a> ⇒ <code>undefined</code></dt>
<dd><p>Clear all filters on all charts within the given chart group. If the chart group is not given then
only charts that belong to the default chart group will be reset.</p>
</dd>
<dt><a href="#refocusAll">refocusAll([group])</a> ⇒ <code>undefined</code></dt>
<dd><p>Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
not given then only charts that belong to the default chart group will be reset.</p>
</dd>
<dt><a href="#renderAll">renderAll([group])</a> ⇒ <code>undefined</code></dt>
<dd><p>Re-render all charts belong to the given chart group. If the chart group is not given then only
charts that belong to the default chart group will be re-rendered.</p>
</dd>
<dt><a href="#redrawAll">redrawAll([group])</a> ⇒ <code>undefined</code></dt>
<dd><p>Redraw all charts belong to the given chart group. If the chart group is not given then only charts
that belong to the default chart group will be re-drawn. Redraw is different from re-render since
when redrawing dc tries to update the graphic incrementally, using transitions, instead of starting
from scratch.</p>
</dd>
<dt><a href="#transition">transition(selection, [duration], [delay], [name])</a> ⇒ <code>d3.transition</code> | <code>d3.selection</code></dt>
<dd><p>Start a transition on a selection if transitions are globally enabled
(<a href="disableTransitions">disableTransitions</a> is false) and the duration is greater than zero; otherwise return
the selection. Since most operations are the same on a d3 selection and a d3 transition, this
allows a common code path for both cases.</p>
</dd>
<dt><a href="#pluck">pluck(n, [f])</a> ⇒ <code>function</code></dt>
<dd><p>Returns a function that given a string property name, can be used to pluck the property off an object.  A function
can be passed as the second argument to also alter the data being returned.</p>
<p>This can be a useful shorthand method to create accessor functions.</p>
</dd>
</dl>

<a name="Logger"></a>

## Logger
Provides basis logging and deprecation utilities

**Kind**: global class  

* [Logger](#Logger)
    * [.enableDebugLog](#Logger+enableDebugLog)
    * [.warn([msg])](#Logger+warn) ⇒ [<code>Logger</code>](#Logger)
    * [.warnOnce([msg])](#Logger+warnOnce) ⇒ [<code>Logger</code>](#Logger)
    * [.debug([msg])](#Logger+debug) ⇒ [<code>Logger</code>](#Logger)

<a name="Logger+enableDebugLog"></a>

### logger.enableDebugLog
Enable debug level logging. Set to `false` by default.

**Kind**: instance property of [<code>Logger</code>](#Logger)  
<a name="Logger+warn"></a>

### logger.warn([msg]) ⇒ [<code>Logger</code>](#Logger)
Put a warning message to console

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type |
| --- | --- |
| [msg] | <code>String</code> | 

**Example**  
```js
logger.warn('Invalid use of .tension on CurveLinear');
```
<a name="Logger+warnOnce"></a>

### logger.warnOnce([msg]) ⇒ [<code>Logger</code>](#Logger)
Put a warning message to console. It will warn only on unique messages.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type |
| --- | --- |
| [msg] | <code>String</code> | 

**Example**  
```js
logger.warnOnce('Invalid use of .tension on CurveLinear');
```
<a name="Logger+debug"></a>

### logger.debug([msg]) ⇒ [<code>Logger</code>](#Logger)
Put a debug message to console. It is controlled by `logger.enableDebugLog`

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type |
| --- | --- |
| [msg] | <code>String</code> | 

**Example**  
```js
logger.debug('Total number of slices: ' + numSlices);
```
<a name="Config"></a>

## Config
General configuration

**Kind**: global class  

* [Config](#Config)
    * [.dateFormat](#Config+dateFormat) : <code>function</code>
    * [.disableTransitions](#Config+disableTransitions) : <code>Boolean</code>
    * [.defaultColors([colors])](#Config+defaultColors) ⇒ <code>Array</code> \| <code>config</code>

<a name="Config+dateFormat"></a>

### config.dateFormat : <code>function</code>
The default date format for dc.js

**Kind**: instance property of [<code>Config</code>](#Config)  
**Default**: <code>d3.timeFormat(&#x27;%m/%d/%Y&#x27;)</code>  
<a name="Config+disableTransitions"></a>

### config.disableTransitions : <code>Boolean</code>
If this boolean is set truthy, all transitions will be disabled, and changes to the charts will happen
immediately.

**Kind**: instance property of [<code>Config</code>](#Config)  
**Default**: <code>false</code>  
<a name="Config+defaultColors"></a>

### config.defaultColors([colors]) ⇒ <code>Array</code> \| <code>config</code>
Set the default color scheme for ordinal charts. Changing it will impact all ordinal charts.

By default it is set to a copy of
`d3.schemeCategory20c` for backward compatibility. This color scheme has been
[removed from D3v5](https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50).
In DC 3.1 release it will change to a more appropriate default.

**Kind**: instance method of [<code>Config</code>](#Config)  

| Param | Type |
| --- | --- |
| [colors] | <code>Array</code> | 

**Example**  
```js
config.defaultColors(d3.schemeSet1)
```
<a name="ChartRegistry"></a>

## ChartRegistry
The ChartRegistry maintains sets of all instantiated dc.js charts under named groups
and the default group. There is a single global ChartRegistry object named `chartRegistry`

A chart group often corresponds to a crossfilter instance. It specifies
the set of charts which should be updated when a filter changes on one of the charts or when the
global functions [filterAll](#filterAll), [refocusAll](#refocusAll),
[renderAll](#renderAll), [redrawAll](#redrawAll), or chart functions
[baseMixin.renderGroup](baseMixin#renderGroup),
[baseMixin.redrawGroup](baseMixin#redrawGroup) are called.

**Kind**: global class  

* [ChartRegistry](#ChartRegistry)
    * [.has(chart)](#ChartRegistry+has) ⇒ <code>Boolean</code>
    * [.register(chart, [group])](#ChartRegistry+register) ⇒ <code>undefined</code>
    * [.deregister(chart, [group])](#ChartRegistry+deregister) ⇒ <code>undefined</code>
    * [.clear(group)](#ChartRegistry+clear) ⇒ <code>undefined</code>
    * [.list([group])](#ChartRegistry+list) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="ChartRegistry+has"></a>

### chartRegistry.has(chart) ⇒ <code>Boolean</code>
Determine if a given chart instance resides in any group in the registry.

**Kind**: instance method of [<code>ChartRegistry</code>](#ChartRegistry)  

| Param | Type | Description |
| --- | --- | --- |
| chart | <code>Object</code> | dc.js chart instance |

<a name="ChartRegistry+register"></a>

### chartRegistry.register(chart, [group]) ⇒ <code>undefined</code>
Add given chart instance to the given group, creating the group if necessary.
If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.

**Kind**: instance method of [<code>ChartRegistry</code>](#ChartRegistry)  

| Param | Type | Description |
| --- | --- | --- |
| chart | <code>Object</code> | dc.js chart instance |
| [group] | <code>String</code> | Group name |

<a name="ChartRegistry+deregister"></a>

### chartRegistry.deregister(chart, [group]) ⇒ <code>undefined</code>
Remove given chart instance from the given group, creating the group if necessary.
If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.

**Kind**: instance method of [<code>ChartRegistry</code>](#ChartRegistry)  

| Param | Type | Description |
| --- | --- | --- |
| chart | <code>Object</code> | dc.js chart instance |
| [group] | <code>String</code> | Group name |

<a name="ChartRegistry+clear"></a>

### chartRegistry.clear(group) ⇒ <code>undefined</code>
Clear given group if one is provided, otherwise clears all groups.

**Kind**: instance method of [<code>ChartRegistry</code>](#ChartRegistry)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>String</code> | Group name |

<a name="ChartRegistry+list"></a>

### chartRegistry.list([group]) ⇒ <code>Array.&lt;Object&gt;</code>
Get an array of each chart instance in the given group.
If no group is provided, the charts in the default group are returned.

**Kind**: instance method of [<code>ChartRegistry</code>](#ChartRegistry)  

| Param | Type | Description |
| --- | --- | --- |
| [group] | <code>String</code> | Group name |

<a name="BarChart"></a>

## BarChart
Concrete bar chart/histogram implementation.

Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: global class  
**Mixes**: [<code>StackMixin</code>](#StackMixin)  

* [BarChart](#BarChart)
    * [new BarChart(parent, [chartGroup])](#new_BarChart_new)
    * [.outerPadding([padding])](#BarChart+outerPadding) ⇒ <code>Number</code> \| [<code>BarChart</code>](#BarChart)
    * [.centerBar([centerBar])](#BarChart+centerBar) ⇒ <code>Boolean</code> \| [<code>BarChart</code>](#BarChart)
    * [.barPadding([barPadding])](#BarChart+barPadding) ⇒ <code>Number</code> \| [<code>BarChart</code>](#BarChart)
    * [.gap([gap])](#BarChart+gap) ⇒ <code>Number</code> \| [<code>BarChart</code>](#BarChart)
    * [.alwaysUseRounding([alwaysUseRounding])](#BarChart+alwaysUseRounding) ⇒ <code>Boolean</code> \| [<code>BarChart</code>](#BarChart)

<a name="new_BarChart_new"></a>

### new BarChart(parent, [chartGroup])
Create a Bar Chart


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> \| [<code>CompositeChart</code>](#CompositeChart) | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart in a [Composite Chart](#CompositeChart) then pass in the parent composite chart instance instead. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a bar chart under #chart-container1 element using the default global chart group
var chart1 = new BarChart('#chart-container1');
// create a bar chart under #chart-container2 element using chart group A
var chart2 = new BarChart('#chart-container2', 'chartGroupA');
// create a sub-chart under a composite parent chart
var chart3 = new BarChart(compositeChart);
```
<a name="BarChart+outerPadding"></a>

### barChart.outerPadding([padding]) ⇒ <code>Number</code> \| [<code>BarChart</code>](#BarChart)
Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
Will pad the width by `padding * barWidth` on each side of the chart.

**Kind**: instance method of [<code>BarChart</code>](#BarChart)  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> | <code>0.5</code> | 

<a name="BarChart+centerBar"></a>

### barChart.centerBar([centerBar]) ⇒ <code>Boolean</code> \| [<code>BarChart</code>](#BarChart)
Whether the bar chart will render each bar centered around the data position on the x-axis.

**Kind**: instance method of [<code>BarChart</code>](#BarChart)  

| Param | Type | Default |
| --- | --- | --- |
| [centerBar] | <code>Boolean</code> | <code>false</code> | 

<a name="BarChart+barPadding"></a>

### barChart.barPadding([barPadding]) ⇒ <code>Number</code> \| [<code>BarChart</code>](#BarChart)
Get or set the spacing between bars as a fraction of bar size. Valid values are between 0-1.
Setting this value will also remove any previously set [gap](#BarChart+gap). See the
[d3 docs](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand)
for a visual description of how the padding is applied.

**Kind**: instance method of [<code>BarChart</code>](#BarChart)  

| Param | Type | Default |
| --- | --- | --- |
| [barPadding] | <code>Number</code> | <code>0</code> | 

<a name="BarChart+gap"></a>

### barChart.gap([gap]) ⇒ <code>Number</code> \| [<code>BarChart</code>](#BarChart)
Manually set fixed gap (in px) between bars instead of relying on the default auto-generated
gap.  By default the bar chart implementation will calculate and set the gap automatically
based on the number of data points and the length of the x axis.

**Kind**: instance method of [<code>BarChart</code>](#BarChart)  

| Param | Type | Default |
| --- | --- | --- |
| [gap] | <code>Number</code> | <code>2</code> | 

<a name="BarChart+alwaysUseRounding"></a>

### barChart.alwaysUseRounding([alwaysUseRounding]) ⇒ <code>Boolean</code> \| [<code>BarChart</code>](#BarChart)
Set or get whether rounding is enabled when bars are centered. If false, using
rounding with centered bars will result in a warning and rounding will be ignored.  This flag
has no effect if bars are not [centered](#BarChart+centerBar).
When using standard d3.js rounding methods, the brush often doesn't align correctly with
centered bars since the bars are offset.  The rounding function must add an offset to
compensate, such as in the following example.

**Kind**: instance method of [<code>BarChart</code>](#BarChart)  

| Param | Type | Default |
| --- | --- | --- |
| [alwaysUseRounding] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
chart.round(function(n) { return Math.floor(n) + 0.5; });
```
<a name="BoxPlot"></a>

## BoxPlot
A box plot is a chart that depicts numerical data via their quartile ranges.

Examples:
- [Boxplot Basic example](http://dc-js.github.io/dc.js/examples/boxplot-basic.html)
- [Boxplot Enhanced example](http://dc-js.github.io/dc.js/examples/boxplot-enhanced.html)
- [Boxplot Render Data example](http://dc-js.github.io/dc.js/examples/boxplot-render-data.html)
- [Boxplot time example](http://dc-js.github.io/dc.js/examples/boxplot-time.html)

**Kind**: global class  
**Mixes**: [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

* [BoxPlot](#BoxPlot)
    * [new BoxPlot(parent, [chartGroup])](#new_BoxPlot_new)
    * [.boxPadding([padding])](#BoxPlot+boxPadding) ⇒ <code>Number</code> \| [<code>BoxPlot</code>](#BoxPlot)
    * [.outerPadding([padding])](#BoxPlot+outerPadding) ⇒ <code>Number</code> \| [<code>BoxPlot</code>](#BoxPlot)
    * [.boxWidth([boxWidth])](#BoxPlot+boxWidth) ⇒ <code>Number</code> \| <code>function</code> \| [<code>BoxPlot</code>](#BoxPlot)
    * [.tickFormat([tickFormat])](#BoxPlot+tickFormat) ⇒ <code>Number</code> \| <code>function</code> \| [<code>BoxPlot</code>](#BoxPlot)
    * [.yRangePadding([yRangePadding])](#BoxPlot+yRangePadding) ⇒ <code>Number</code> \| <code>function</code> \| [<code>BoxPlot</code>](#BoxPlot)
    * [.renderDataPoints([show])](#BoxPlot+renderDataPoints) ⇒ <code>Boolean</code> \| [<code>BoxPlot</code>](#BoxPlot)
    * [.dataOpacity([opacity])](#BoxPlot+dataOpacity) ⇒ <code>Number</code> \| [<code>BoxPlot</code>](#BoxPlot)
    * [.dataWidthPortion([percentage])](#BoxPlot+dataWidthPortion) ⇒ <code>Number</code> \| [<code>BoxPlot</code>](#BoxPlot)
    * [.showOutliers([show])](#BoxPlot+showOutliers) ⇒ <code>Boolean</code> \| [<code>BoxPlot</code>](#BoxPlot)
    * [.boldOutlier([show])](#BoxPlot+boldOutlier) ⇒ <code>Boolean</code> \| [<code>BoxPlot</code>](#BoxPlot)

<a name="new_BoxPlot_new"></a>

### new BoxPlot(parent, [chartGroup])
Create a Box Plot.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a box plot under #chart-container1 element using the default global chart group
var boxPlot1 = new BoxPlot('#chart-container1');
// create a box plot under #chart-container2 element using chart group A
var boxPlot2 = new BoxPlot('#chart-container2', 'chartGroupA');
```
<a name="BoxPlot+boxPadding"></a>

### boxPlot.boxPadding([padding]) ⇒ <code>Number</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set the spacing between boxes as a fraction of box size. Valid values are within 0-1.
See the [d3 docs](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand)
for a visual description of how the padding is applied.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  
**See**: [d3.scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand)  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> | <code>0.8</code> | 

<a name="BoxPlot+outerPadding"></a>

### boxPlot.outerPadding([padding]) ⇒ <code>Number</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set the outer padding on an ordinal box chart. This setting has no effect on non-ordinal charts
or on charts with a custom [.boxWidth](#BoxPlot+boxWidth). Will pad the width by
`padding * barWidth` on each side of the chart.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> | <code>0.5</code> | 

<a name="BoxPlot+boxWidth"></a>

### boxPlot.boxWidth([boxWidth]) ⇒ <code>Number</code> \| <code>function</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set the numerical width of the boxplot box. The width may also be a function taking as
parameters the chart width excluding the right and left margins, as well as the number of x
units.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [boxWidth] | <code>Number</code> \| <code>function</code> | <code>0.5</code> | 

**Example**  
```js
// Using numerical parameter
chart.boxWidth(10);
// Using function
chart.boxWidth((innerChartWidth, xUnits) { ... });
```
<a name="BoxPlot+tickFormat"></a>

### boxPlot.tickFormat([tickFormat]) ⇒ <code>Number</code> \| <code>function</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set the numerical format of the boxplot median, whiskers and quartile labels. Defaults
to integer formatting.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  

| Param | Type |
| --- | --- |
| [tickFormat] | <code>function</code> | 

**Example**  
```js
// format ticks to 2 decimal places
chart.tickFormat(d3.format('.2f'));
```
<a name="BoxPlot+yRangePadding"></a>

### boxPlot.yRangePadding([yRangePadding]) ⇒ <code>Number</code> \| <code>function</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set the amount of padding to add, in pixel coordinates, to the top and
bottom of the chart to accommodate box/whisker labels.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [yRangePadding] | <code>function</code> | <code>8</code> | 

**Example**  
```js
// allow more space for a bigger whisker font
chart.yRangePadding(12);
```
<a name="BoxPlot+renderDataPoints"></a>

### boxPlot.renderDataPoints([show]) ⇒ <code>Boolean</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set whether individual data points will be rendered.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [show] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
// Enable rendering of individual data points
chart.renderDataPoints(true);
```
<a name="BoxPlot+dataOpacity"></a>

### boxPlot.dataOpacity([opacity]) ⇒ <code>Number</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set the opacity when rendering data.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [opacity] | <code>Number</code> | <code>0.3</code> | 

**Example**  
```js
// If individual data points are rendered increase the opacity.
chart.dataOpacity(0.7);
```
<a name="BoxPlot+dataWidthPortion"></a>

### boxPlot.dataWidthPortion([percentage]) ⇒ <code>Number</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set the portion of the width of the box to show data points.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [percentage] | <code>Number</code> | <code>0.8</code> | 

**Example**  
```js
// If individual data points are rendered increase the data box.
chart.dataWidthPortion(0.9);
```
<a name="BoxPlot+showOutliers"></a>

### boxPlot.showOutliers([show]) ⇒ <code>Boolean</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set whether outliers will be rendered.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [show] | <code>Boolean</code> | <code>true</code> | 

**Example**  
```js
// Disable rendering of outliers
chart.showOutliers(false);
```
<a name="BoxPlot+boldOutlier"></a>

### boxPlot.boldOutlier([show]) ⇒ <code>Boolean</code> \| [<code>BoxPlot</code>](#BoxPlot)
Get or set whether outliers will be drawn bold.

**Kind**: instance method of [<code>BoxPlot</code>](#BoxPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [show] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
// If outliers are rendered display as bold
chart.boldOutlier(true);
```
<a name="BubbleChart"></a>

## BubbleChart
A concrete implementation of a general purpose bubble chart that allows data visualization using the
following dimensions:
- x axis position
- y axis position
- bubble radius
- color

Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [US Venture Capital Landscape 2011](http://dc-js.github.com/dc.js/vc/index.html)

**Kind**: global class  
**Mixes**: [<code>BubbleMixin</code>](#BubbleMixin), [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

* [BubbleChart](#BubbleChart)
    * [new BubbleChart(parent, [chartGroup])](#new_BubbleChart_new)
    * [.sortBubbleSize([sortBubbleSize])](#BubbleChart+sortBubbleSize) ⇒ <code>Boolean</code> \| [<code>BubbleChart</code>](#BubbleChart)

<a name="new_BubbleChart_new"></a>

### new BubbleChart(parent, [chartGroup])
Create a Bubble Chart.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a bubble chart under #chart-container1 element using the default global chart group
var bubbleChart1 = new BubbleChart('#chart-container1');
// create a bubble chart under #chart-container2 element using chart group A
var bubbleChart2 = new BubbleChart('#chart-container2', 'chartGroupA');
```
<a name="BubbleChart+sortBubbleSize"></a>

### bubbleChart.sortBubbleSize([sortBubbleSize]) ⇒ <code>Boolean</code> \| [<code>BubbleChart</code>](#BubbleChart)
Turn on or off the bubble sorting feature, or return the value of the flag. If enabled,
bubbles will be sorted by their radius, with smaller bubbles in front.

**Kind**: instance method of [<code>BubbleChart</code>](#BubbleChart)  

| Param | Type | Default |
| --- | --- | --- |
| [sortBubbleSize] | <code>Boolean</code> | <code>false</code> | 

<a name="BubbleOverlay"></a>

## BubbleOverlay
The bubble overlay chart is quite different from the typical bubble chart. With the bubble overlay
chart you can arbitrarily place bubbles on an existing svg or bitmap image, thus changing the
typical x and y positioning while retaining the capability to visualize data using bubble radius
and coloring.

Examples:
- [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: global class  
**Mixes**: [<code>BubbleMixin</code>](#BubbleMixin), [<code>BaseMixin</code>](#BaseMixin)  

* [BubbleOverlay](#BubbleOverlay)
    * [new BubbleOverlay(parent, [chartGroup])](#new_BubbleOverlay_new)
    * [._g](#BubbleOverlay+_g) ⇒ [<code>BubbleOverlay</code>](#BubbleOverlay)
    * [.point(name, x, y)](#BubbleOverlay+point) ⇒ [<code>BubbleOverlay</code>](#BubbleOverlay)

<a name="new_BubbleOverlay_new"></a>

### new BubbleOverlay(parent, [chartGroup])
Create a Bubble Overlay.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a bubble overlay chart on top of the '#chart-container1 svg' element using the default global chart group
var bubbleChart1 = BubbleOverlayChart('#chart-container1').svg(d3.select('#chart-container1 svg'));
// create a bubble overlay chart on top of the '#chart-container2 svg' element using chart group A
var bubbleChart2 = new CompositeChart('#chart-container2', 'chartGroupA').svg(d3.select('#chart-container2 svg'));
```
<a name="BubbleOverlay+_g"></a>

### bubbleOverlay.\_g ⇒ [<code>BubbleOverlay</code>](#BubbleOverlay)
**mandatory**

Set the underlying svg image element. Unlike other dc charts this chart will not generate a svg
element; therefore the bubble overlay chart will not work if this function is not invoked. If the
underlying image is a bitmap, then an empty svg will need to be created on top of the image.

**Kind**: instance property of [<code>BubbleOverlay</code>](#BubbleOverlay)  

| Param | Type |
| --- | --- |
| [imageElement] | <code>SVGElement</code> \| <code>d3.selection</code> | 

**Example**  
```js
// set up underlying svg element
chart.svg(d3.select('#chart svg'));
```
<a name="BubbleOverlay+point"></a>

### bubbleOverlay.point(name, x, y) ⇒ [<code>BubbleOverlay</code>](#BubbleOverlay)
**mandatory**

Set up a data point on the overlay. The name of a data point should match a specific 'key' among
data groups generated using keyAccessor.  If a match is found (point name <-> data group key)
then a bubble will be generated at the position specified by the function. x and y
value specified here are relative to the underlying svg.

**Kind**: instance method of [<code>BubbleOverlay</code>](#BubbleOverlay)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 
| x | <code>Number</code> | 
| y | <code>Number</code> | 

<a name="CboxMenu"></a>

## CboxMenu
The CboxMenu is a simple widget designed to filter a dimension by
selecting option(s) from a set of HTML `<input />` elements. The menu can be
made into a set of radio buttons (single select) or checkboxes (multiple).

**Kind**: global class  
**Mixes**: [<code>BaseMixin</code>](#BaseMixin)  

* [CboxMenu](#CboxMenu)
    * [new CboxMenu(parent, [chartGroup])](#new_CboxMenu_new)
    * [.order([order])](#CboxMenu+order) ⇒ <code>function</code> \| [<code>CboxMenu</code>](#CboxMenu)
    * [.promptText([promptText])](#CboxMenu+promptText) ⇒ <code>String</code> \| [<code>CboxMenu</code>](#CboxMenu)
    * [.filterDisplayed([filterDisplayed])](#CboxMenu+filterDisplayed) ⇒ <code>function</code> \| [<code>CboxMenu</code>](#CboxMenu)
    * [.multiple([multiple])](#CboxMenu+multiple) ⇒ <code>Boolean</code> \| [<code>CboxMenu</code>](#CboxMenu)
    * [.promptValue([promptValue])](#CboxMenu+promptValue) ⇒ <code>\*</code> \| [<code>CboxMenu</code>](#CboxMenu)

<a name="new_CboxMenu_new"></a>

### new CboxMenu(parent, [chartGroup])
Create a Cbox Menu.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> \| [<code>CompositeChart</code>](#CompositeChart) | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this widget should be placed in. Interaction with the widget will only trigger events and redraws within its group. |

**Example**  
```js
// create a cboxMenu under #cbox-container using the default global chart group
var cbox = new CboxMenu('#cbox-container')
               .dimension(states)
               .group(stateGroup);
// the option text can be set via the title() function
// by default the option text is '`key`: `value`'
cbox.title(function (d){
    return 'STATE: ' + d.key;
})
```
<a name="CboxMenu+order"></a>

### cboxMenu.order([order]) ⇒ <code>function</code> \| [<code>CboxMenu</code>](#CboxMenu)
Get or set the function that controls the ordering of option tags in the
cbox menu. By default options are ordered by the group key in ascending
order.

**Kind**: instance method of [<code>CboxMenu</code>](#CboxMenu)  

| Param | Type |
| --- | --- |
| [order] | <code>function</code> | 

**Example**  
```js
// order by the group's value
chart.order(function (a,b) {
    return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
});
```
<a name="CboxMenu+promptText"></a>

### cboxMenu.promptText([promptText]) ⇒ <code>String</code> \| [<code>CboxMenu</code>](#CboxMenu)
Get or set the text displayed in the options used to prompt selection.

**Kind**: instance method of [<code>CboxMenu</code>](#CboxMenu)  

| Param | Type | Default |
| --- | --- | --- |
| [promptText] | <code>String</code> | <code>&#x27;Select all&#x27;</code> | 

**Example**  
```js
chart.promptText('All states');
```
<a name="CboxMenu+filterDisplayed"></a>

### cboxMenu.filterDisplayed([filterDisplayed]) ⇒ <code>function</code> \| [<code>CboxMenu</code>](#CboxMenu)
Get or set the function that filters options prior to display. By default options
with a value of < 1 are not displayed.

**Kind**: instance method of [<code>CboxMenu</code>](#CboxMenu)  

| Param | Type |
| --- | --- |
| [filterDisplayed] | <code>function</code> | 

**Example**  
```js
// display all options override the `filterDisplayed` function:
chart.filterDisplayed(function () {
    return true;
});
```
<a name="CboxMenu+multiple"></a>

### cboxMenu.multiple([multiple]) ⇒ <code>Boolean</code> \| [<code>CboxMenu</code>](#CboxMenu)
Controls the type of input element. Setting it to true converts
the HTML `input` tags from radio buttons to checkboxes.

**Kind**: instance method of [<code>CboxMenu</code>](#CboxMenu)  

| Param | Type | Default |
| --- | --- | --- |
| [multiple] | <code>boolean</code> | <code>false</code> | 

**Example**  
```js
chart.multiple(true);
```
<a name="CboxMenu+promptValue"></a>

### cboxMenu.promptValue([promptValue]) ⇒ <code>\*</code> \| [<code>CboxMenu</code>](#CboxMenu)
Controls the default value to be used for
[dimension.filter](https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension_filter)
when only the prompt value is selected. If `null` (the default), no filtering will occur when
just the prompt is selected.

**Kind**: instance method of [<code>CboxMenu</code>](#CboxMenu)  

| Param | Type | Default |
| --- | --- | --- |
| [promptValue] | <code>\*</code> | <code></code> | 

<a name="CompositeChart"></a>

## CompositeChart
Composite charts are a special kind of chart that render multiple charts on the same Coordinate
Grid. You can overlay (compose) different bar/line/area charts in a single composite chart to
achieve some quite flexible charting effects.

**Kind**: global class  
**Mixes**: [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

* [CompositeChart](#CompositeChart)
    * [new CompositeChart(parent, [chartGroup])](#new_CompositeChart_new)
    * [.useRightAxisGridLines([useRightAxisGridLines])](#CompositeChart+useRightAxisGridLines) ⇒ <code>Boolean</code> \| [<code>CompositeChart</code>](#CompositeChart)
    * [.childOptions([childOptions])](#CompositeChart+childOptions) ⇒ <code>Object</code> \| [<code>CompositeChart</code>](#CompositeChart)
    * [.rightYAxisLabel([rightYAxisLabel], [padding])](#CompositeChart+rightYAxisLabel) ⇒ <code>String</code> \| [<code>CompositeChart</code>](#CompositeChart)
    * [.compose([subChartArray])](#CompositeChart+compose) ⇒ [<code>CompositeChart</code>](#CompositeChart)
    * [.children()](#CompositeChart+children) ⇒ [<code>Array.&lt;BaseMixin&gt;</code>](#BaseMixin)
    * [.shareColors([shareColors])](#CompositeChart+shareColors) ⇒ <code>Boolean</code> \| [<code>CompositeChart</code>](#CompositeChart)
    * [.shareTitle([shareTitle])](#CompositeChart+shareTitle) ⇒ <code>Boolean</code> \| [<code>CompositeChart</code>](#CompositeChart)
    * [.rightY([yScale])](#CompositeChart+rightY) ⇒ <code>d3.scale</code> \| [<code>CompositeChart</code>](#CompositeChart)
    * [.alignYAxes([alignYAxes])](#CompositeChart+alignYAxes) ⇒ <code>Chart</code>
    * [.rightYAxis([rightYAxis])](#CompositeChart+rightYAxis) ⇒ <code>d3.axisRight</code> \| [<code>CompositeChart</code>](#CompositeChart)

<a name="new_CompositeChart_new"></a>

### new CompositeChart(parent, [chartGroup])
Create a Composite Chart.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a composite chart under #chart-container1 element using the default global chart group
var compositeChart1 = new CompositeChart('#chart-container1');
// create a composite chart under #chart-container2 element using chart group A
var compositeChart2 = new CompositeChart('#chart-container2', 'chartGroupA');
```
<a name="CompositeChart+useRightAxisGridLines"></a>

### compositeChart.useRightAxisGridLines([useRightAxisGridLines]) ⇒ <code>Boolean</code> \| [<code>CompositeChart</code>](#CompositeChart)
Get or set whether to draw gridlines from the right y axis.  Drawing from the left y axis is the
default behavior. This option is only respected when subcharts with both left and right y-axes
are present.

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  

| Param | Type | Default |
| --- | --- | --- |
| [useRightAxisGridLines] | <code>Boolean</code> | <code>false</code> | 

<a name="CompositeChart+childOptions"></a>

### compositeChart.childOptions([childOptions]) ⇒ <code>Object</code> \| [<code>CompositeChart</code>](#CompositeChart)
Get or set chart-specific options for all child charts. This is equivalent to calling
[.options](#BaseMixin+options) on each child chart.

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  

| Param | Type |
| --- | --- |
| [childOptions] | <code>Object</code> | 

<a name="CompositeChart+rightYAxisLabel"></a>

### compositeChart.rightYAxisLabel([rightYAxisLabel], [padding]) ⇒ <code>String</code> \| [<code>CompositeChart</code>](#CompositeChart)
Set or get the right y axis label.

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  

| Param | Type |
| --- | --- |
| [rightYAxisLabel] | <code>String</code> | 
| [padding] | <code>Number</code> | 

<a name="CompositeChart+compose"></a>

### compositeChart.compose([subChartArray]) ⇒ [<code>CompositeChart</code>](#CompositeChart)
Combine the given charts into one single composite coordinate grid chart.

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  

| Param | Type |
| --- | --- |
| [subChartArray] | <code>Array.&lt;Chart&gt;</code> | 

**Example**  
```js
moveChart.compose([
    // when creating sub-chart you need to pass in the parent chart
    new LineChart(moveChart)
        .group(indexAvgByMonthGroup) // if group is missing then parent's group will be used
        .valueAccessor(function (d){return d.value.avg;})
        // most of the normal functions will continue to work in a composed chart
        .renderArea(true)
        .stack(monthlyMoveGroup, function (d){return d.value;})
        .title(function (d){
            var value = d.value.avg?d.value.avg:d.value;
            if(isNaN(value)) value = 0;
            return dateFormat(d.key) + '\n' + numberFormat(value);
        }),
    new BarChart(moveChart)
        .group(volumeByMonthGroup)
        .centerBar(true)
]);
```
<a name="CompositeChart+children"></a>

### compositeChart.children() ⇒ [<code>Array.&lt;BaseMixin&gt;</code>](#BaseMixin)
Returns the child charts which are composed into the composite chart.

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  
<a name="CompositeChart+shareColors"></a>

### compositeChart.shareColors([shareColors]) ⇒ <code>Boolean</code> \| [<code>CompositeChart</code>](#CompositeChart)
Get or set color sharing for the chart. If set, the [.colors()](#ColorMixin+colors) value from this chart
will be shared with composed children. Additionally if the child chart implements
Stackable and has not set a custom .colorAccessor, then it will generate a color
specific to its order in the composition.

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  

| Param | Type | Default |
| --- | --- | --- |
| [shareColors] | <code>Boolean</code> | <code>false</code> | 

<a name="CompositeChart+shareTitle"></a>

### compositeChart.shareTitle([shareTitle]) ⇒ <code>Boolean</code> \| [<code>CompositeChart</code>](#CompositeChart)
Get or set title sharing for the chart. If set, the [.title()](#BaseMixin+title) value from
this chart will be shared with composed children.

Note: currently you must call this before `compose` or the child will still get the parent's
`title` function!

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  

| Param | Type | Default |
| --- | --- | --- |
| [shareTitle] | <code>Boolean</code> | <code>true</code> | 

<a name="CompositeChart+rightY"></a>

### compositeChart.rightY([yScale]) ⇒ <code>d3.scale</code> \| [<code>CompositeChart</code>](#CompositeChart)
Get or set the y scale for the right axis. The right y scale is typically automatically
generated by the chart implementation.

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  
**See**: [d3.scale](https://github.com/d3/d3-scale/blob/master/README.md)  

| Param | Type |
| --- | --- |
| [yScale] | <code>d3.scale</code> | 

<a name="CompositeChart+alignYAxes"></a>

### compositeChart.alignYAxes([alignYAxes]) ⇒ <code>Chart</code>
Get or set alignment between left and right y axes. A line connecting '0' on both y axis
will be parallel to x axis. This only has effect when [elasticY](#CoordinateGridMixin+elasticY) is true.

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  

| Param | Type | Default |
| --- | --- | --- |
| [alignYAxes] | <code>Boolean</code> | <code>false</code> | 

<a name="CompositeChart+rightYAxis"></a>

### compositeChart.rightYAxis([rightYAxis]) ⇒ <code>d3.axisRight</code> \| [<code>CompositeChart</code>](#CompositeChart)
Set or get the right y axis used by the composite chart. This function is most useful when y
axis customization is required. The y axis in dc.js is an instance of a
[d3.axisRight](https://github.com/d3/d3-axis/blob/master/README.md#axisRight) therefore it supports any valid
d3 axis manipulation.

**Caution**: The right y axis is usually generated internally by dc; resetting it may cause
unexpected results.  Note also that when used as a getter, this function is not chainable: it
returns the axis, not the chart,
[so attempting to call chart functions after calling `.yAxis()` will fail](https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis).

**Kind**: instance method of [<code>CompositeChart</code>](#CompositeChart)  
**See**: [https://github.com/d3/d3-axis/blob/master/README.md#axisRight](https://github.com/d3/d3-axis/blob/master/README.md#axisRight)  

| Param | Type |
| --- | --- |
| [rightYAxis] | <code>d3.axisRight</code> | 

**Example**  
```js
// customize y axis tick format
chart.rightYAxis().tickFormat(function (v) {return v + '%';});
// customize y axis tick values
chart.rightYAxis().tickValues([0, 100, 200, 300]);
```
<a name="DataCount"></a>

## DataCount
The data count widget is a simple widget designed to display the number of records selected by the
current filters out of the total number of records in the data set. Once created the data count widget
will automatically update the text content of child elements with the following classes:

* `.total-count` - total number of records
* `.filter-count` - number of records matched by the current filters

Note: this widget works best for the specific case of showing the number of records out of a
total. If you want a more general-purpose numeric display, please use the
[NumberDisplay](#NumberDisplay) widget instead.

Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)

**Kind**: global class  
**Mixes**: [<code>BaseMixin</code>](#BaseMixin)  

* [DataCount](#DataCount)
    * [new DataCount(parent, [chartGroup])](#new_DataCount_new)
    * [.html([options])](#DataCount+html) ⇒ <code>Object</code> \| [<code>DataCount</code>](#DataCount)
    * [.formatNumber([formatter])](#DataCount+formatNumber) ⇒ <code>function</code> \| [<code>DataCount</code>](#DataCount)

<a name="new_DataCount_new"></a>

### new DataCount(parent, [chartGroup])
Create a Data Count widget.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
var ndx = crossfilter(data);
var all = ndx.groupAll();

new DataCount('.dc-data-count')
    .crossfilter(ndx)
    .groupAll(all);
```
<a name="DataCount+html"></a>

### dataCount.html([options]) ⇒ <code>Object</code> \| [<code>DataCount</code>](#DataCount)
Gets or sets an optional object specifying HTML templates to use depending how many items are
selected. The text `%total-count` will replaced with the total number of records, and the text
`%filter-count` will be replaced with the number of selected records.
- all: HTML template to use if all items are selected
- some: HTML template to use if not all items are selected

**Kind**: instance method of [<code>DataCount</code>](#DataCount)  

| Param | Type |
| --- | --- |
| [options] | <code>Object</code> | 

**Example**  
```js
counter.html({
     some: '%filter-count out of %total-count records selected',
     all: 'All records selected. Click on charts to apply filters'
})
```
<a name="DataCount+formatNumber"></a>

### dataCount.formatNumber([formatter]) ⇒ <code>function</code> \| [<code>DataCount</code>](#DataCount)
Gets or sets an optional function to format the filter count and total count.

**Kind**: instance method of [<code>DataCount</code>](#DataCount)  
**See**: [d3.format](https://github.com/d3/d3-format/blob/master/README.md#format)  

| Param | Type | Default |
| --- | --- | --- |
| [formatter] | <code>function</code> | <code>d3.format(&#x27;.2g&#x27;)</code> | 

**Example**  
```js
counter.formatNumber(d3.format('.2g'))
```
<a name="DataGrid"></a>

## DataGrid
Data grid is a simple widget designed to list the filtered records, providing
a simple way to define how the items are displayed.

Note: Formerly the data grid chart (and data table) used the [group](#DataGrid+group) attribute as a
keying function for [nesting](https://github.com/d3/d3-collection/blob/master/README.md#nest) the data
together in sections.  This was confusing so it has been renamed to `section`, although `group` still works.

Examples:
- [List of members of the european parliament](https://dc-js.github.io/dc.js/ep/)

**Kind**: global class  
**Mixes**: [<code>BaseMixin</code>](#BaseMixin)  

* [DataGrid](#DataGrid)
    * [new DataGrid(parent, [chartGroup])](#new_DataGrid_new)
    * [.section(section)](#DataGrid+section) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
    * [.group(section)](#DataGrid+group) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
    * [.beginSlice([beginSlice])](#DataGrid+beginSlice) ⇒ <code>Number</code> \| [<code>DataGrid</code>](#DataGrid)
    * [.endSlice([endSlice])](#DataGrid+endSlice) ⇒ <code>Number</code> \| [<code>DataGrid</code>](#DataGrid)
    * [.size([size])](#DataGrid+size) ⇒ <code>Number</code> \| [<code>DataGrid</code>](#DataGrid)
    * [.html([html])](#DataGrid+html) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
    * [.htmlSection([htmlSection])](#DataGrid+htmlSection) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
    * [.htmlGroup([htmlSection])](#DataGrid+htmlGroup) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
    * [.sortBy([sortByFunction])](#DataGrid+sortBy) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
    * [.order([order])](#DataGrid+order) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)

<a name="new_DataGrid_new"></a>

### new DataGrid(parent, [chartGroup])
Create a Data Grid.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

<a name="DataGrid+section"></a>

### dataGrid.section(section) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
Get or set the section function for the data grid. The section function takes a data row and
returns the key to specify to [d3.nest](https://github.com/d3/d3-collection/blob/master/README.md#nest)
to split rows into sections.

Do not pass in a crossfilter section as this will not work.

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  

| Param | Type | Description |
| --- | --- | --- |
| section | <code>function</code> | Function taking a row of data and returning the nest key. |

**Example**  
```js
// section rows by the value of their field
chart
    .section(function(d) { return d.field; })
```
<a name="DataGrid+group"></a>

### dataGrid.group(section) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
Backward-compatible synonym for [section](#DataGrid+section).

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  

| Param | Type | Description |
| --- | --- | --- |
| section | <code>function</code> | Function taking a row of data and returning the nest key. |

<a name="DataGrid+beginSlice"></a>

### dataGrid.beginSlice([beginSlice]) ⇒ <code>Number</code> \| [<code>DataGrid</code>](#DataGrid)
Get or set the index of the beginning slice which determines which entries get displayed by the widget.
Useful when implementing pagination.

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  

| Param | Type | Default |
| --- | --- | --- |
| [beginSlice] | <code>Number</code> | <code>0</code> | 

<a name="DataGrid+endSlice"></a>

### dataGrid.endSlice([endSlice]) ⇒ <code>Number</code> \| [<code>DataGrid</code>](#DataGrid)
Get or set the index of the end slice which determines which entries get displayed by the widget.
Useful when implementing pagination.

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  

| Param | Type |
| --- | --- |
| [endSlice] | <code>Number</code> | 

<a name="DataGrid+size"></a>

### dataGrid.size([size]) ⇒ <code>Number</code> \| [<code>DataGrid</code>](#DataGrid)
Get or set the grid size which determines the number of items displayed by the widget.

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  

| Param | Type | Default |
| --- | --- | --- |
| [size] | <code>Number</code> | <code>999</code> | 

<a name="DataGrid+html"></a>

### dataGrid.html([html]) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
Get or set the function that formats an item. The data grid widget uses a
function to generate dynamic html. Use your favourite templating engine or
generate the string directly.

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  

| Param | Type |
| --- | --- |
| [html] | <code>function</code> | 

**Example**  
```js
chart.html(function (d) { return '<div class='item '+data.exampleCategory+''>'+data.exampleString+'</div>';});
```
<a name="DataGrid+htmlSection"></a>

### dataGrid.htmlSection([htmlSection]) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
Get or set the function that formats a section label.

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  

| Param | Type |
| --- | --- |
| [htmlSection] | <code>function</code> | 

**Example**  
```js
chart.htmlSection (function (d) { return '<h2>'.d.key . 'with ' . d.values.length .' items</h2>'});
```
<a name="DataGrid+htmlGroup"></a>

### dataGrid.htmlGroup([htmlSection]) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
Backward-compatible synonym for [htmlSection](#DataGrid+htmlSection).

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  

| Param | Type |
| --- | --- |
| [htmlSection] | <code>function</code> | 

<a name="DataGrid+sortBy"></a>

### dataGrid.sortBy([sortByFunction]) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
Get or set sort-by function. This function works as a value accessor at the item
level and returns a particular field to be sorted.

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  

| Param | Type |
| --- | --- |
| [sortByFunction] | <code>function</code> | 

**Example**  
```js
chart.sortBy(function(d) {
    return d.date;
});
```
<a name="DataGrid+order"></a>

### dataGrid.order([order]) ⇒ <code>function</code> \| [<code>DataGrid</code>](#DataGrid)
Get or set sort the order function.

**Kind**: instance method of [<code>DataGrid</code>](#DataGrid)  
**See**

- [d3.ascending](https://github.com/d3/d3-array/blob/master/README.md#ascending)
- [d3.descending](https://github.com/d3/d3-array/blob/master/README.md#descending)


| Param | Type | Default |
| --- | --- | --- |
| [order] | <code>function</code> | <code>d3.ascending</code> | 

**Example**  
```js
chart.order(d3.descending);
```
<a name="DataTable"></a>

## DataTable
The data table is a simple widget designed to list crossfilter focused data set (rows being
filtered) in a good old tabular fashion.

An interesting feature of the data table is that you can pass a crossfilter group to the
`dimension`, if you want to show aggregated data instead of raw data rows. This requires no
special code as long as you specify the [order](#DataTable+order) as `d3.descending`,
since the data table will use `dimension.top()` to fetch the data in that case, and the method is
equally supported on the crossfilter group as the crossfilter dimension.

If you want to display aggregated data in ascending order, you will need to wrap the group
in a [fake dimension](https://github.com/dc-js/dc.js/wiki/FAQ#fake-dimensions) to support the
`.bottom()` method. See the example linked below for more details.

Note: Formerly the data table (and data grid chart) used the [group](#DataTable+group) attribute as a
keying function for [nesting](https://github.com/d3/d3-collection/blob/master/README.md#nest) the data
together in sections.  This was confusing so it has been renamed to `section`, although `group` still works.
Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [dataTable on a crossfilter group](http://dc-js.github.io/dc.js/examples/table-on-aggregated-data.html)
([source](https://github.com/dc-js/dc.js/blob/master/web-src/examples/table-on-aggregated-data.html))

**Kind**: global class  
**Mixes**: [<code>BaseMixin</code>](#BaseMixin)  

* [DataTable](#DataTable)
    * [new DataTable(parent, [chartGroup])](#new_DataTable_new)
    * [.section(section)](#DataTable+section) ⇒ <code>function</code> \| [<code>DataTable</code>](#DataTable)
    * [.group(section)](#DataTable+group) ⇒ <code>function</code> \| [<code>DataTable</code>](#DataTable)
    * [.size([size])](#DataTable+size) ⇒ <code>Number</code> \| [<code>DataTable</code>](#DataTable)
    * [.beginSlice([beginSlice])](#DataTable+beginSlice) ⇒ <code>Number</code> \| [<code>DataTable</code>](#DataTable)
    * [.endSlice([endSlice])](#DataTable+endSlice) ⇒ <code>Number</code> \| [<code>DataTable</code>](#DataTable)
    * [.columns([columns])](#DataTable+columns) ⇒ <code>Array.&lt;function()&gt;</code>
    * [.sortBy([sortBy])](#DataTable+sortBy) ⇒ <code>function</code> \| [<code>DataTable</code>](#DataTable)
    * [.order([order])](#DataTable+order) ⇒ <code>function</code> \| [<code>DataTable</code>](#DataTable)
    * [.showSections([showSections])](#DataTable+showSections) ⇒ <code>Boolean</code> \| [<code>DataTable</code>](#DataTable)
    * [.showGroups([showSections])](#DataTable+showGroups) ⇒ <code>Boolean</code> \| [<code>DataTable</code>](#DataTable)

<a name="new_DataTable_new"></a>

### new DataTable(parent, [chartGroup])
Create a Data Table.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

<a name="DataTable+section"></a>

### dataTable.section(section) ⇒ <code>function</code> \| [<code>DataTable</code>](#DataTable)
Get or set the section function for the data table. The section function takes a data row and
returns the key to specify to [d3.nest](https://github.com/d3/d3-collection/blob/master/README.md#nest)
to split rows into sections. By default there will be only one section with no name.

Set [showSections](#DataTable+showSections) to false to hide the section headers

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  

| Param | Type | Description |
| --- | --- | --- |
| section | <code>function</code> | Function taking a row of data and returning the nest key. |

**Example**  
```js
// section rows by the value of their field
chart
    .section(function(d) { return d.field; })
```
<a name="DataTable+group"></a>

### dataTable.group(section) ⇒ <code>function</code> \| [<code>DataTable</code>](#DataTable)
Backward-compatible synonym for [section](#DataTable+section).

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  

| Param | Type | Description |
| --- | --- | --- |
| section | <code>function</code> | Function taking a row of data and returning the nest key. |

<a name="DataTable+size"></a>

### dataTable.size([size]) ⇒ <code>Number</code> \| [<code>DataTable</code>](#DataTable)
Get or set the table size which determines the number of rows displayed by the widget.

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  

| Param | Type | Default |
| --- | --- | --- |
| [size] | <code>Number</code> | <code>25</code> | 

<a name="DataTable+beginSlice"></a>

### dataTable.beginSlice([beginSlice]) ⇒ <code>Number</code> \| [<code>DataTable</code>](#DataTable)
Get or set the index of the beginning slice which determines which entries get displayed
by the widget. Useful when implementing pagination.

Note: the sortBy function will determine how the rows are ordered for pagination purposes.
See the [table pagination example](http://dc-js.github.io/dc.js/examples/table-pagination.html)
to see how to implement the pagination user interface using `beginSlice` and `endSlice`.

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  

| Param | Type | Default |
| --- | --- | --- |
| [beginSlice] | <code>Number</code> | <code>0</code> | 

<a name="DataTable+endSlice"></a>

### dataTable.endSlice([endSlice]) ⇒ <code>Number</code> \| [<code>DataTable</code>](#DataTable)
Get or set the index of the end slice which determines which entries get displayed by the
widget. Useful when implementing pagination. See [`beginSlice`](#DataTable+beginSlice) for more information.

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  

| Param | Type |
| --- | --- |
| [endSlice] | <code>Number</code> \| <code>undefined</code> | 

<a name="DataTable+columns"></a>

### dataTable.columns([columns]) ⇒ <code>Array.&lt;function()&gt;</code>
Get or set column functions. The data table widget supports several methods of specifying the
columns to display.

The original method uses an array of functions to generate dynamic columns. Column functions
are simple javascript functions with only one input argument `d` which represents a row in
the data set. The return value of these functions will be used to generate the content for
each cell. However, this method requires the HTML for the table to have a fixed set of column
headers.

<pre><code>chart.columns([
    function(d) { return d.date; },
    function(d) { return d.open; },
    function(d) { return d.close; },
    function(d) { return numberFormat(d.close - d.open); },
    function(d) { return d.volume; }
]);
</code></pre>

In the second method, you can list the columns to read from the data without specifying it as
a function, except where necessary (ie, computed columns).  Note the data element name is
capitalized when displayed in the table header. You can also mix in functions as necessary,
using the third `{label, format}` form, as shown below.

<pre><code>chart.columns([
    "date",    // d["date"], ie, a field accessor; capitalized automatically
    "open",    // ...
    "close",   // ...
    {
        label: "Change",
        format: function (d) {
            return numberFormat(d.close - d.open);
        }
    },
    "volume"   // d["volume"], ie, a field accessor; capitalized automatically
]);
</code></pre>

In the third example, we specify all fields using the `{label, format}` method:
<pre><code>chart.columns([
    {
        label: "Date",
        format: function (d) { return d.date; }
    },
    {
        label: "Open",
        format: function (d) { return numberFormat(d.open); }
    },
    {
        label: "Close",
        format: function (d) { return numberFormat(d.close); }
    },
    {
        label: "Change",
        format: function (d) { return numberFormat(d.close - d.open); }
    },
    {
        label: "Volume",
        format: function (d) { return d.volume; }
    }
]);
</code></pre>

You may wish to override the dataTable functions `_doColumnHeaderCapitalize` and
`_doColumnHeaderFnToString`, which are used internally to translate the column information or
function into a displayed header. The first one is used on the "string" column specifier; the
second is used to transform a stringified function into something displayable. For the Stock
example, the function for Change becomes the table header **d.close - d.open**.

Finally, you can even specify a completely different form of column definition. To do this,
override `_chart._doColumnHeaderFormat` and `_chart._doColumnValueFormat` Be aware that
fields without numberFormat specification will be displayed just as they are stored in the
data, unformatted.

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  
**Returns**: <code>Array.&lt;function()&gt;</code> - |DataTable}  

| Param | Type | Default |
| --- | --- | --- |
| [columns] | <code>Array.&lt;function()&gt;</code> | <code>[]</code> | 

<a name="DataTable+sortBy"></a>

### dataTable.sortBy([sortBy]) ⇒ <code>function</code> \| [<code>DataTable</code>](#DataTable)
Get or set sort-by function. This function works as a value accessor at row level and returns a
particular field to be sorted by.

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  

| Param | Type | Default |
| --- | --- | --- |
| [sortBy] | <code>function</code> | <code>identity function</code> | 

**Example**  
```js
chart.sortBy(function(d) {
    return d.date;
});
```
<a name="DataTable+order"></a>

### dataTable.order([order]) ⇒ <code>function</code> \| [<code>DataTable</code>](#DataTable)
Get or set sort order. If the order is `d3.ascending`, the data table will use
`dimension().bottom()` to fetch the data; otherwise it will use `dimension().top()`

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  
**See**

- [d3.ascending](https://github.com/d3/d3-array/blob/master/README.md#ascending)
- [d3.descending](https://github.com/d3/d3-array/blob/master/README.md#descending)


| Param | Type | Default |
| --- | --- | --- |
| [order] | <code>function</code> | <code>d3.ascending</code> | 

**Example**  
```js
chart.order(d3.descending);
```
<a name="DataTable+showSections"></a>

### dataTable.showSections([showSections]) ⇒ <code>Boolean</code> \| [<code>DataTable</code>](#DataTable)
Get or set if section header rows will be shown.

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  

| Param | Type | Default |
| --- | --- | --- |
| [showSections] | <code>Boolean</code> | <code>true</code> | 

**Example**  
```js
chart
    .section([value], [name])
    .showSections(true|false);
```
<a name="DataTable+showGroups"></a>

### dataTable.showGroups([showSections]) ⇒ <code>Boolean</code> \| [<code>DataTable</code>](#DataTable)
Backward-compatible synonym for [showSections](#DataTable+showSections).

**Kind**: instance method of [<code>DataTable</code>](#DataTable)  

| Param | Type | Default |
| --- | --- | --- |
| [showSections] | <code>Boolean</code> | <code>true</code> | 

<a name="GeoChoroplethChart"></a>

## GeoChoroplethChart
The geo choropleth chart is designed as an easy way to create a crossfilter driven choropleth map
from GeoJson data. This chart implementation was inspired by
[the great d3 choropleth example](http://bl.ocks.org/4060606).

Examples:
- [US Venture Capital Landscape 2011](http://dc-js.github.com/dc.js/vc/index.html)

**Kind**: global class  
**Mixes**: [<code>ColorMixin</code>](#ColorMixin), [<code>BaseMixin</code>](#BaseMixin)  

* [GeoChoroplethChart](#GeoChoroplethChart)
    * [new GeoChoroplethChart(parent, [chartGroup])](#new_GeoChoroplethChart_new)
    * [.overlayGeoJson(json, name, keyAccessor)](#GeoChoroplethChart+overlayGeoJson) ⇒ [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)
    * [.projection([projection])](#GeoChoroplethChart+projection) ⇒ <code>d3.projection</code> \| [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)
    * [.geoJsons()](#GeoChoroplethChart+geoJsons) ⇒ <code>Array.&lt;{name:String, data: Object, accessor: function()}&gt;</code>
    * [.geoPath()](#GeoChoroplethChart+geoPath) ⇒ <code>d3.geoPath</code>
    * [.removeGeoJson(name)](#GeoChoroplethChart+removeGeoJson) ⇒ [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)

<a name="new_GeoChoroplethChart_new"></a>

### new GeoChoroplethChart(parent, [chartGroup])
Create a Geo Choropleth Chart.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a choropleth chart under '#us-chart' element using the default global chart group
var chart1 = new GeoChoroplethChart('#us-chart');
// create a choropleth chart under '#us-chart2' element using chart group A
var chart2 = new CompositeChart('#us-chart2', 'chartGroupA');
```
<a name="GeoChoroplethChart+overlayGeoJson"></a>

### geoChoroplethChart.overlayGeoJson(json, name, keyAccessor) ⇒ [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)
**mandatory**

Use this function to insert a new GeoJson map layer. This function can be invoked multiple times
if you have multiple GeoJson data layers to render on top of each other. If you overlay multiple
layers with the same name the new overlay will override the existing one.

**Kind**: instance method of [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)  
**See**

- [GeoJSON](http://geojson.org/)
- [TopoJSON](https://github.com/topojson/topojson/wiki)
- [topojson.feature](https://github.com/topojson/topojson-1.x-api-reference/blob/master/API-Reference.md#wiki-feature)


| Param | Type | Description |
| --- | --- | --- |
| json | <code>\_geoJson</code> | a geojson feed |
| name | <code>String</code> | name of the layer |
| keyAccessor | <code>function</code> | accessor function used to extract 'key' from the GeoJson data. The key extracted by this function should match the keys returned by the crossfilter groups. |

**Example**  
```js
// insert a layer for rendering US states
chart.overlayGeoJson(statesJson.features, 'state', function(d) {
     return d.properties.name;
});
```
<a name="GeoChoroplethChart+projection"></a>

### geoChoroplethChart.projection([projection]) ⇒ <code>d3.projection</code> \| [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)
Gets or sets a custom geo projection function. See the available
[d3 geo projection functions](https://github.com/d3/d3-geo/blob/master/README.md#projections).

Starting version 3.0 it has been deprecated to rely on the default projection being
[d3.geoAlbersUsa()](https://github.com/d3/d3-geo/blob/master/README.md#geoAlbersUsa). Please
set it explicitly. [Considering that `null` is also a valid value for projection](https://bl.ocks.org/mbostock/5557726), if you need
projection to be `null` please set it explicitly to `null`.

**Kind**: instance method of [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)  
**See**

- [d3.projection](https://github.com/d3/d3-geo/blob/master/README.md#projections)
- [d3-geo-projection](https://github.com/d3/d3-geo-projection)


| Param | Type | Default |
| --- | --- | --- |
| [projection] | <code>d3.projection</code> | <code>d3.geoAlbersUsa()</code> | 

<a name="GeoChoroplethChart+geoJsons"></a>

### geoChoroplethChart.geoJsons() ⇒ <code>Array.&lt;{name:String, data: Object, accessor: function()}&gt;</code>
Returns all GeoJson layers currently registered with this chart. The returned array is a
reference to this chart's internal data structure, so any modification to this array will also
modify this chart's internal registration.

**Kind**: instance method of [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)  
<a name="GeoChoroplethChart+geoPath"></a>

### geoChoroplethChart.geoPath() ⇒ <code>d3.geoPath</code>
Returns the [d3.geoPath](https://github.com/d3/d3-geo/blob/master/README.md#paths) object used to
render the projection and features.  Can be useful for figuring out the bounding box of the
feature set and thus a way to calculate scale and translation for the projection.

**Kind**: instance method of [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)  
**See**: [d3.geoPath](https://github.com/d3/d3-geo/blob/master/README.md#paths)  
<a name="GeoChoroplethChart+removeGeoJson"></a>

### geoChoroplethChart.removeGeoJson(name) ⇒ [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)
Remove a GeoJson layer from this chart by name

**Kind**: instance method of [<code>GeoChoroplethChart</code>](#GeoChoroplethChart)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="HeatMap"></a>

## HeatMap
A heat map is matrix that represents the values of two dimensions of data using colors.

**Kind**: global class  
**Mixes**: [<code>ColorMixin</code>](#ColorMixin), [<code>MarginMixin</code>](#MarginMixin), [<code>BaseMixin</code>](#BaseMixin)  

* [HeatMap](#HeatMap)
    * [new HeatMap(parent, [chartGroup])](#new_HeatMap_new)
    * [.colsLabel([labelFunction])](#HeatMap+colsLabel) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.rowsLabel([labelFunction])](#HeatMap+rowsLabel) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.rows([rows])](#HeatMap+rows) ⇒ <code>Array.&lt;(String\|Number)&gt;</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.rowOrdering([rowOrdering])](#HeatMap+rowOrdering) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.cols([cols])](#HeatMap+cols) ⇒ <code>Array.&lt;(String\|Number)&gt;</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.colOrdering([colOrdering])](#HeatMap+colOrdering) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.boxOnClick([handler])](#HeatMap+boxOnClick) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.xAxisOnClick([handler])](#HeatMap+xAxisOnClick) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.yAxisOnClick([handler])](#HeatMap+yAxisOnClick) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.xBorderRadius([xBorderRadius])](#HeatMap+xBorderRadius) ⇒ <code>Number</code> \| [<code>HeatMap</code>](#HeatMap)
    * [.yBorderRadius([yBorderRadius])](#HeatMap+yBorderRadius) ⇒ <code>Number</code> \| [<code>HeatMap</code>](#HeatMap)

<a name="new_HeatMap_new"></a>

### new HeatMap(parent, [chartGroup])
Create a Heat Map


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a heat map under #chart-container1 element using the default global chart group
var heatMap1 = new HeatMap('#chart-container1');
// create a heat map under #chart-container2 element using chart group A
var heatMap2 = new HeatMap('#chart-container2', 'chartGroupA');
```
<a name="HeatMap+colsLabel"></a>

### heatMap.colsLabel([labelFunction]) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
Set or get the column label function. The chart class uses this function to render
column labels on the X axis. It is passed the column name.

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type | Default |
| --- | --- | --- |
| [labelFunction] | <code>function</code> | <code>function(d) { return d; }</code> | 

**Example**  
```js
// the default label function just returns the name
chart.colsLabel(function(d) { return d; });
```
<a name="HeatMap+rowsLabel"></a>

### heatMap.rowsLabel([labelFunction]) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
Set or get the row label function. The chart class uses this function to render
row labels on the Y axis. It is passed the row name.

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type | Default |
| --- | --- | --- |
| [labelFunction] | <code>function</code> | <code>function(d) { return d; }</code> | 

**Example**  
```js
// the default label function just returns the name
chart.rowsLabel(function(d) { return d; });
```
<a name="HeatMap+rows"></a>

### heatMap.rows([rows]) ⇒ <code>Array.&lt;(String\|Number)&gt;</code> \| [<code>HeatMap</code>](#HeatMap)
Gets or sets the values used to create the rows of the heatmap, as an array. By default, all
the values will be fetched from the data using the value accessor.

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type |
| --- | --- |
| [rows] | <code>Array.&lt;(String\|Number)&gt;</code> | 

<a name="HeatMap+rowOrdering"></a>

### heatMap.rowOrdering([rowOrdering]) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
Get or set a comparator to order the rows.
Default is [d3.ascending](https://github.com/d3/d3-array#ascending).

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type |
| --- | --- |
| [rowOrdering] | <code>function</code> | 

<a name="HeatMap+cols"></a>

### heatMap.cols([cols]) ⇒ <code>Array.&lt;(String\|Number)&gt;</code> \| [<code>HeatMap</code>](#HeatMap)
Gets or sets the keys used to create the columns of the heatmap, as an array. By default, all
the values will be fetched from the data using the key accessor.

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type |
| --- | --- |
| [cols] | <code>Array.&lt;(String\|Number)&gt;</code> | 

<a name="HeatMap+colOrdering"></a>

### heatMap.colOrdering([colOrdering]) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
Get or set a comparator to order the columns.
Default is  [d3.ascending](https://github.com/d3/d3-array#ascending).

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type |
| --- | --- |
| [colOrdering] | <code>function</code> | 

<a name="HeatMap+boxOnClick"></a>

### heatMap.boxOnClick([handler]) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
Gets or sets the handler that fires when an individual cell is clicked in the heatmap.
By default, filtering of the cell will be toggled.

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type |
| --- | --- |
| [handler] | <code>function</code> | 

**Example**  
```js
// default box on click handler
chart.boxOnClick(function (d) {
    var filter = d.key;
    events.trigger(function () {
        _chart.filter(filter);
        _chart.redrawGroup();
    });
});
```
<a name="HeatMap+xAxisOnClick"></a>

### heatMap.xAxisOnClick([handler]) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
Gets or sets the handler that fires when a column tick is clicked in the x axis.
By default, if any cells in the column are unselected, the whole column will be selected,
otherwise the whole column will be unselected.

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type |
| --- | --- |
| [handler] | <code>function</code> | 

<a name="HeatMap+yAxisOnClick"></a>

### heatMap.yAxisOnClick([handler]) ⇒ <code>function</code> \| [<code>HeatMap</code>](#HeatMap)
Gets or sets the handler that fires when a row tick is clicked in the y axis.
By default, if any cells in the row are unselected, the whole row will be selected,
otherwise the whole row will be unselected.

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type |
| --- | --- |
| [handler] | <code>function</code> | 

<a name="HeatMap+xBorderRadius"></a>

### heatMap.xBorderRadius([xBorderRadius]) ⇒ <code>Number</code> \| [<code>HeatMap</code>](#HeatMap)
Gets or sets the X border radius.  Set to 0 to get full rectangles.

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type | Default |
| --- | --- | --- |
| [xBorderRadius] | <code>Number</code> | <code>6.75</code> | 

<a name="HeatMap+yBorderRadius"></a>

### heatMap.yBorderRadius([yBorderRadius]) ⇒ <code>Number</code> \| [<code>HeatMap</code>](#HeatMap)
Gets or sets the Y border radius.  Set to 0 to get full rectangles.

**Kind**: instance method of [<code>HeatMap</code>](#HeatMap)  

| Param | Type | Default |
| --- | --- | --- |
| [yBorderRadius] | <code>Number</code> | <code>6.75</code> | 

<a name="HtmlLegend"></a>

## HtmlLegend
htmlLegend is a attachable widget that can be added to other dc charts to render horizontal/vertical legend
labels.

**Kind**: global class  

* [HtmlLegend](#HtmlLegend)
    * [.container([container])](#HtmlLegend+container) ⇒ <code>String</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
    * [.legendItemClass([legendItemClass])](#HtmlLegend+legendItemClass) ⇒ <code>String</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
    * [.highlightSelected([highlightSelected])](#HtmlLegend+highlightSelected) ⇒ <code>String</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
    * [.horizontal([horizontal])](#HtmlLegend+horizontal) ⇒ <code>String</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
    * [.legendText([legendText])](#HtmlLegend+legendText) ⇒ <code>function</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
    * [.maxItems([maxItems])](#HtmlLegend+maxItems) ⇒ [<code>HtmlLegend</code>](#HtmlLegend)
    * [.keyboardAccessible([keyboardAccessible])](#HtmlLegend+keyboardAccessible) ⇒ <code>Boolean</code> \| [<code>HtmlLegend</code>](#HtmlLegend)

<a name="HtmlLegend+container"></a>

### htmlLegend.container([container]) ⇒ <code>String</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
Set the container selector for the legend widget. Required.

**Kind**: instance method of [<code>HtmlLegend</code>](#HtmlLegend)  

| Param | Type |
| --- | --- |
| [container] | <code>String</code> | 

<a name="HtmlLegend+legendItemClass"></a>

### htmlLegend.legendItemClass([legendItemClass]) ⇒ <code>String</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
This can be optionally used to override class for legenditem and just use this class style.
This is helpful for overriding the style of a particular chart rather than overriding
the style for all charts.

Setting this will disable the highlighting of selected items also.

**Kind**: instance method of [<code>HtmlLegend</code>](#HtmlLegend)  

| Param | Type |
| --- | --- |
| [legendItemClass] | <code>String</code> | 

<a name="HtmlLegend+highlightSelected"></a>

### htmlLegend.highlightSelected([highlightSelected]) ⇒ <code>String</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
This can be optionally used to enable highlighting legends for the selections/filters for the
chart.

**Kind**: instance method of [<code>HtmlLegend</code>](#HtmlLegend)  

| Param | Type |
| --- | --- |
| [highlightSelected] | <code>String</code> | 

<a name="HtmlLegend+horizontal"></a>

### htmlLegend.horizontal([horizontal]) ⇒ <code>String</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
Display the legend horizontally instead of vertically

**Kind**: instance method of [<code>HtmlLegend</code>](#HtmlLegend)  

| Param | Type |
| --- | --- |
| [horizontal] | <code>String</code> | 

<a name="HtmlLegend+legendText"></a>

### htmlLegend.legendText([legendText]) ⇒ <code>function</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
Set or get the legend text function. The legend widget uses this function to render the legend
text for each item. If no function is specified the legend widget will display the names
associated with each group.

**Kind**: instance method of [<code>HtmlLegend</code>](#HtmlLegend)  

| Param | Type |
| --- | --- |
| [legendText] | <code>function</code> | 

**Example**  
```js
// default legendText
legend.legendText(pluck('name'))

// create numbered legend items
chart.legend(new HtmlLegend().legendText(function(d, i) { return i + '. ' + d.name; }))

// create legend displaying group counts
chart.legend(new HtmlLegend().legendText(function(d) { return d.name + ': ' d.data; }))
```
<a name="HtmlLegend+maxItems"></a>

### htmlLegend.maxItems([maxItems]) ⇒ [<code>HtmlLegend</code>](#HtmlLegend)
Maximum number of legend items to display

**Kind**: instance method of [<code>HtmlLegend</code>](#HtmlLegend)  

| Param | Type |
| --- | --- |
| [maxItems] | <code>Number</code> | 

<a name="HtmlLegend+keyboardAccessible"></a>

### htmlLegend.keyboardAccessible([keyboardAccessible]) ⇒ <code>Boolean</code> \| [<code>HtmlLegend</code>](#HtmlLegend)
If set, individual legend items will be focusable from keyboard and on pressing Enter or Space
will behave as if clicked on.

If `svgDescription` on the parent chart has not been explicitly set, will also set the default 
SVG description text to the class constructor name, like BarChart or HeatMap, and make the entire
SVG focusable.

**Kind**: instance method of [<code>HtmlLegend</code>](#HtmlLegend)  

| Param | Type | Default |
| --- | --- | --- |
| [keyboardAccessible] | <code>Boolean</code> | <code>false</code> | 

<a name="Legend"></a>

## Legend
Legend is a attachable widget that can be added to other dc charts to render horizontal legend
labels.

Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: global class  

* [Legend](#Legend)
    * [.x([x])](#Legend+x) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
    * [.y([y])](#Legend+y) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
    * [.gap([gap])](#Legend+gap) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
    * [.highlightSelected([highlightSelected])](#Legend+highlightSelected) ⇒ <code>String</code> \| <code>dc.legend</code>
    * [.itemHeight([itemHeight])](#Legend+itemHeight) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
    * [.horizontal([horizontal])](#Legend+horizontal) ⇒ <code>Boolean</code> \| [<code>Legend</code>](#Legend)
    * [.legendWidth([legendWidth])](#Legend+legendWidth) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
    * [.itemWidth([itemWidth])](#Legend+itemWidth) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
    * [.autoItemWidth([autoItemWidth])](#Legend+autoItemWidth) ⇒ <code>Boolean</code> \| [<code>Legend</code>](#Legend)
    * [.legendText([legendText])](#Legend+legendText) ⇒ <code>function</code> \| [<code>Legend</code>](#Legend)
    * [.maxItems([maxItems])](#Legend+maxItems) ⇒ [<code>Legend</code>](#Legend)
    * [.keyboardAccessible([keyboardAccessible])](#Legend+keyboardAccessible) ⇒ <code>Boolean</code> \| [<code>Legend</code>](#Legend)

<a name="Legend+x"></a>

### legend.x([x]) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
Set or get x coordinate for legend widget.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>Number</code> | <code>0</code> | 

<a name="Legend+y"></a>

### legend.y([y]) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
Set or get y coordinate for legend widget.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type | Default |
| --- | --- | --- |
| [y] | <code>Number</code> | <code>0</code> | 

<a name="Legend+gap"></a>

### legend.gap([gap]) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
Set or get gap between legend items.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type | Default |
| --- | --- | --- |
| [gap] | <code>Number</code> | <code>5</code> | 

<a name="Legend+highlightSelected"></a>

### legend.highlightSelected([highlightSelected]) ⇒ <code>String</code> \| <code>dc.legend</code>
This can be optionally used to enable highlighting legends for the selections/filters for the
chart.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type |
| --- | --- |
| [highlightSelected] | <code>String</code> | 

<a name="Legend+itemHeight"></a>

### legend.itemHeight([itemHeight]) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
Set or get legend item height.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type | Default |
| --- | --- | --- |
| [itemHeight] | <code>Number</code> | <code>12</code> | 

<a name="Legend+horizontal"></a>

### legend.horizontal([horizontal]) ⇒ <code>Boolean</code> \| [<code>Legend</code>](#Legend)
Position legend horizontally instead of vertically.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type | Default |
| --- | --- | --- |
| [horizontal] | <code>Boolean</code> | <code>false</code> | 

<a name="Legend+legendWidth"></a>

### legend.legendWidth([legendWidth]) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
Maximum width for horizontal legend.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type | Default |
| --- | --- | --- |
| [legendWidth] | <code>Number</code> | <code>500</code> | 

<a name="Legend+itemWidth"></a>

### legend.itemWidth([itemWidth]) ⇒ <code>Number</code> \| [<code>Legend</code>](#Legend)
Legend item width for horizontal legend.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type | Default |
| --- | --- | --- |
| [itemWidth] | <code>Number</code> | <code>70</code> | 

<a name="Legend+autoItemWidth"></a>

### legend.autoItemWidth([autoItemWidth]) ⇒ <code>Boolean</code> \| [<code>Legend</code>](#Legend)
Turn automatic width for legend items on or off. If true, [itemWidth](#Legend+itemWidth) is ignored.
This setting takes into account the [gap](#Legend+gap).

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type | Default |
| --- | --- | --- |
| [autoItemWidth] | <code>Boolean</code> | <code>false</code> | 

<a name="Legend+legendText"></a>

### legend.legendText([legendText]) ⇒ <code>function</code> \| [<code>Legend</code>](#Legend)
Set or get the legend text function. The legend widget uses this function to render the legend
text for each item. If no function is specified the legend widget will display the names
associated with each group.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type |
| --- | --- |
| [legendText] | <code>function</code> | 

**Example**  
```js
// default legendText
legend.legendText(pluck('name'))

// create numbered legend items
chart.legend(new Legend().legendText(function(d, i) { return i + '. ' + d.name; }))

// create legend displaying group counts
chart.legend(new Legend().legendText(function(d) { return d.name + ': ' d.data; }))
```
<a name="Legend+maxItems"></a>

### legend.maxItems([maxItems]) ⇒ [<code>Legend</code>](#Legend)
Maximum number of legend items to display

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type |
| --- | --- |
| [maxItems] | <code>Number</code> | 

<a name="Legend+keyboardAccessible"></a>

### legend.keyboardAccessible([keyboardAccessible]) ⇒ <code>Boolean</code> \| [<code>Legend</code>](#Legend)
If set, individual legend items will be focusable from keyboard and on pressing Enter or Space
will behave as if clicked on.

If `svgDescription` on the parent chart has not been explicitly set, will also set the default 
SVG description text to the class constructor name, like BarChart or HeatMap, and make the entire
SVG focusable.

**Kind**: instance method of [<code>Legend</code>](#Legend)  

| Param | Type | Default |
| --- | --- | --- |
| [keyboardAccessible] | <code>Boolean</code> | <code>false</code> | 

<a name="LineChart"></a>

## LineChart
Concrete line/area chart implementation.

Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
- [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)

**Kind**: global class  
**Mixes**: [<code>StackMixin</code>](#StackMixin), [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

* [LineChart](#LineChart)
    * [new LineChart(parent, [chartGroup])](#new_LineChart_new)
    * [.curve([curve])](#LineChart+curve) ⇒ <code>d3.curve</code> \| [<code>LineChart</code>](#LineChart)
    * ~~[.interpolate([interpolate])](#LineChart+interpolate) ⇒ <code>d3.curve</code> \| [<code>LineChart</code>](#LineChart)~~
    * ~~[.tension([tension])](#LineChart+tension) ⇒ <code>Number</code> \| [<code>LineChart</code>](#LineChart)~~
    * [.defined([defined])](#LineChart+defined) ⇒ <code>function</code> \| [<code>LineChart</code>](#LineChart)
    * [.dashStyle([dashStyle])](#LineChart+dashStyle) ⇒ <code>Array.&lt;Number&gt;</code> \| [<code>LineChart</code>](#LineChart)
    * [.renderArea([renderArea])](#LineChart+renderArea) ⇒ <code>Boolean</code> \| [<code>LineChart</code>](#LineChart)
    * [.xyTipsOn([xyTipsOn])](#LineChart+xyTipsOn) ⇒ <code>Boolean</code> \| [<code>LineChart</code>](#LineChart)
    * [.dotRadius([dotRadius])](#LineChart+dotRadius) ⇒ <code>Number</code> \| [<code>LineChart</code>](#LineChart)
    * [.renderDataPoints([options])](#LineChart+renderDataPoints) ⇒ <code>Object</code> \| [<code>LineChart</code>](#LineChart)

<a name="new_LineChart_new"></a>

### new LineChart(parent, [chartGroup])
Create a Line Chart.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> \| [<code>CompositeChart</code>](#CompositeChart) | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection.  If the line chart is a sub-chart in a [Composite Chart](#CompositeChart) then pass in the parent composite chart instance instead. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a line chart under #chart-container1 element using the default global chart group
var chart1 = new LineChart('#chart-container1');
// create a line chart under #chart-container2 element using chart group A
var chart2 = new LineChart('#chart-container2', 'chartGroupA');
// create a sub-chart under a composite parent chart
var chart3 = new LineChart(compositeChart);
```
<a name="LineChart+curve"></a>

### lineChart.curve([curve]) ⇒ <code>d3.curve</code> \| [<code>LineChart</code>](#LineChart)
Gets or sets the curve factory to use for lines and areas drawn, allowing e.g. step
functions, splines, and cubic interpolation. Typically you would use one of the interpolator functions
provided by [d3 curves](https://github.com/d3/d3-shape/blob/master/README.md#curves).

Replaces the use of [interpolate](#LineChart+interpolate) and [tension](#LineChart+tension)
in dc.js < 3.0

This is passed to
[line.curve](https://github.com/d3/d3-shape/blob/master/README.md#line_curve) and
[area.curve](https://github.com/d3/d3-shape/blob/master/README.md#area_curve).

**Kind**: instance method of [<code>LineChart</code>](#LineChart)  
**See**

- [line.curve](https://github.com/d3/d3-shape/blob/master/README.md#line_curve)
- [area.curve](https://github.com/d3/d3-shape/blob/master/README.md#area_curve)


| Param | Type | Default |
| --- | --- | --- |
| [curve] | <code>d3.curve</code> | <code>d3.curveLinear</code> | 

**Example**  
```js
// default
chart
    .curve(d3.curveLinear);
// Add tension to curves that support it
chart
    .curve(d3.curveCardinal.tension(0.5));
// You can use some specialized variation like
// https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline
chart
    .curve(d3.curveCatmullRom.alpha(0.5));
```
<a name="LineChart+interpolate"></a>

### ~~lineChart.interpolate([interpolate]) ⇒ <code>d3.curve</code> \| [<code>LineChart</code>](#LineChart)~~
***Deprecated***

Gets or sets the interpolator to use for lines drawn, by string name, allowing e.g. step
functions, splines, and cubic interpolation.

Possible values are: 'linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis',
'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', and
'monotone'.

This function exists for backward compatibility. Use [curve](#LineChart+curve)
which is generic and provides more options.
Value set through `.curve` takes precedence over `.interpolate` and `.tension`.

**Kind**: instance method of [<code>LineChart</code>](#LineChart)  
**See**: [curve](#LineChart+curve)  

| Param | Type | Default |
| --- | --- | --- |
| [interpolate] | <code>d3.curve</code> | <code>d3.curveLinear</code> | 

<a name="LineChart+tension"></a>

### ~~lineChart.tension([tension]) ⇒ <code>Number</code> \| [<code>LineChart</code>](#LineChart)~~
***Deprecated***

Gets or sets the tension to use for lines drawn, in the range 0 to 1.

Passed to the [d3 curve function](https://github.com/d3/d3-shape/blob/master/README.md#curves)
if it provides a `.tension` function. Example:
[curveCardinal.tension](https://github.com/d3/d3-shape/blob/master/README.md#curveCardinal_tension).

This function exists for backward compatibility. Use [curve](#LineChart+curve)
which is generic and provides more options.
Value set through `.curve` takes precedence over `.interpolate` and `.tension`.

**Kind**: instance method of [<code>LineChart</code>](#LineChart)  
**See**: [curve](#LineChart+curve)  

| Param | Type | Default |
| --- | --- | --- |
| [tension] | <code>Number</code> | <code>0</code> | 

<a name="LineChart+defined"></a>

### lineChart.defined([defined]) ⇒ <code>function</code> \| [<code>LineChart</code>](#LineChart)
Gets or sets a function that will determine discontinuities in the line which should be
skipped: the path will be broken into separate subpaths if some points are undefined.
This function is passed to
[line.defined](https://github.com/d3/d3-shape/blob/master/README.md#line_defined)

Note: crossfilter will sometimes coerce nulls to 0, so you may need to carefully write
custom reduce functions to get this to work, depending on your data. See
[this GitHub comment](https://github.com/dc-js/dc.js/issues/615#issuecomment-49089248)
for more details and an example.

**Kind**: instance method of [<code>LineChart</code>](#LineChart)  
**See**: [line.defined](https://github.com/d3/d3-shape/blob/master/README.md#line_defined)  

| Param | Type |
| --- | --- |
| [defined] | <code>function</code> | 

<a name="LineChart+dashStyle"></a>

### lineChart.dashStyle([dashStyle]) ⇒ <code>Array.&lt;Number&gt;</code> \| [<code>LineChart</code>](#LineChart)
Set the line's d3 dashstyle. This value becomes the 'stroke-dasharray' of line. Defaults to empty
array (solid line).

**Kind**: instance method of [<code>LineChart</code>](#LineChart)  
**See**: [stroke-dasharray](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)  

| Param | Type | Default |
| --- | --- | --- |
| [dashStyle] | <code>Array.&lt;Number&gt;</code> | <code>[]</code> | 

**Example**  
```js
// create a Dash Dot Dot Dot
chart.dashStyle([3,1,1,1]);
```
<a name="LineChart+renderArea"></a>

### lineChart.renderArea([renderArea]) ⇒ <code>Boolean</code> \| [<code>LineChart</code>](#LineChart)
Get or set render area flag. If the flag is set to true then the chart will render the area
beneath each line and the line chart effectively becomes an area chart.

**Kind**: instance method of [<code>LineChart</code>](#LineChart)  

| Param | Type | Default |
| --- | --- | --- |
| [renderArea] | <code>Boolean</code> | <code>false</code> | 

<a name="LineChart+xyTipsOn"></a>

### lineChart.xyTipsOn([xyTipsOn]) ⇒ <code>Boolean</code> \| [<code>LineChart</code>](#LineChart)
Turn on/off the mouseover behavior of an individual data point which renders a circle and x/y axis
dashed lines back to each respective axis.  This is ignored if the chart
[brush](#CoordinateGridMixin+brushOn) is on

**Kind**: instance method of [<code>LineChart</code>](#LineChart)  

| Param | Type | Default |
| --- | --- | --- |
| [xyTipsOn] | <code>Boolean</code> | <code>false</code> | 

<a name="LineChart+dotRadius"></a>

### lineChart.dotRadius([dotRadius]) ⇒ <code>Number</code> \| [<code>LineChart</code>](#LineChart)
Get or set the radius (in px) for dots displayed on the data points.

**Kind**: instance method of [<code>LineChart</code>](#LineChart)  

| Param | Type | Default |
| --- | --- | --- |
| [dotRadius] | <code>Number</code> | <code>5</code> | 

<a name="LineChart+renderDataPoints"></a>

### lineChart.renderDataPoints([options]) ⇒ <code>Object</code> \| [<code>LineChart</code>](#LineChart)
Always show individual dots for each datapoint.

If `options` is falsy, it disables data point rendering. If no `options` are provided, the
current `options` values are instead returned.

**Kind**: instance method of [<code>LineChart</code>](#LineChart)  

| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>Object</code> | <code>{fillOpacity: 0.8, strokeOpacity: 0.0, radius: 2}</code> | 

**Example**  
```js
chart.renderDataPoints({radius: 2, fillOpacity: 0.8, strokeOpacity: 0.0})
```
<a name="NumberDisplay"></a>

## NumberDisplay
A display of a single numeric value.

Unlike other charts, you do not need to set a dimension. Instead a group object must be provided and
a valueAccessor that returns a single value.

If the group is a [groupAll](https://github.com/crossfilter/crossfilter/wiki/API-Reference#crossfilter_groupAll)
then its `.value()` will be displayed. This is the recommended usage.

However, if it is given an ordinary group, the `numberDisplay` will show the last bin's value, after
sorting with the [ordering](https://dc-js.github.io/dc.js/docs/html/dc.baseMixin.html#ordering__anchor)
function. `numberDisplay` defaults the `ordering` function to sorting by value, so this will display
the largest value if the values are numeric.

**Kind**: global class  
**Mixes**: [<code>BaseMixin</code>](#BaseMixin)  

* [NumberDisplay](#NumberDisplay)
    * [new NumberDisplay(parent, [chartGroup])](#new_NumberDisplay_new)
    * [.html([html])](#NumberDisplay+html) ⇒ <code>Object</code> \| [<code>NumberDisplay</code>](#NumberDisplay)
    * [.value()](#NumberDisplay+value) ⇒ <code>Number</code>
    * [.formatNumber([formatter])](#NumberDisplay+formatNumber) ⇒ <code>function</code> \| [<code>NumberDisplay</code>](#NumberDisplay)
    * [.ariaLiveRegion([ariaLiveRegion])](#NumberDisplay+ariaLiveRegion) ⇒ <code>Boolean</code> \| [<code>NumberDisplay</code>](#NumberDisplay)

<a name="new_NumberDisplay_new"></a>

### new NumberDisplay(parent, [chartGroup])
Create a Number Display widget.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a number display under #chart-container1 element using the default global chart group
var display1 = new NumberDisplay('#chart-container1');
```
<a name="NumberDisplay+html"></a>

### numberDisplay.html([html]) ⇒ <code>Object</code> \| [<code>NumberDisplay</code>](#NumberDisplay)
Gets or sets an optional object specifying HTML templates to use depending on the number
displayed.  The text `%number` will be replaced with the current value.
- one: HTML template to use if the number is 1
- zero: HTML template to use if the number is 0
- some: HTML template to use otherwise

**Kind**: instance method of [<code>NumberDisplay</code>](#NumberDisplay)  

| Param | Type | Default |
| --- | --- | --- |
| [html] | <code>Object</code> | <code>{one: &#x27;&#x27;, some: &#x27;&#x27;, none: &#x27;&#x27;}</code> | 

**Example**  
```js
numberWidget.html({
     one:'%number record',
     some:'%number records',
     none:'no records'})
```
<a name="NumberDisplay+value"></a>

### numberDisplay.value() ⇒ <code>Number</code>
Calculate and return the underlying value of the display.

**Kind**: instance method of [<code>NumberDisplay</code>](#NumberDisplay)  
<a name="NumberDisplay+formatNumber"></a>

### numberDisplay.formatNumber([formatter]) ⇒ <code>function</code> \| [<code>NumberDisplay</code>](#NumberDisplay)
Get or set a function to format the value for the display.

**Kind**: instance method of [<code>NumberDisplay</code>](#NumberDisplay)  
**See**: [d3.format](https://github.com/d3/d3-format/blob/master/README.md#format)  

| Param | Type | Default |
| --- | --- | --- |
| [formatter] | <code>function</code> | <code>d3.format(&#x27;.2s&#x27;)</code> | 

<a name="NumberDisplay+ariaLiveRegion"></a>

### numberDisplay.ariaLiveRegion([ariaLiveRegion]) ⇒ <code>Boolean</code> \| [<code>NumberDisplay</code>](#NumberDisplay)
If set, the Number Display widget will have its aria-live attribute set to 'polite' which will
notify screen readers when the widget changes its value. Note that setting this method will also
disable the default transition between the old and the new values. This is to avoid change
notifications spoken out before the new value finishes re-drawing. It is also advisable to check
if the widget has appropriately set accessibility description or label.

**Kind**: instance method of [<code>NumberDisplay</code>](#NumberDisplay)  

| Param | Type | Default |
| --- | --- | --- |
| [ariaLiveRegion] | <code>Boolean</code> | <code>false</code> | 

<a name="PieChart"></a>

## PieChart
The pie chart implementation is usually used to visualize a small categorical distribution.  The pie
chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
slice relative to the sum of all values. Slices are ordered by [ordering](#BaseMixin+ordering)
which defaults to sorting by key.

Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)

**Kind**: global class  
**Mixes**: [<code>CapMixin</code>](#CapMixin), [<code>ColorMixin</code>](#ColorMixin), [<code>BaseMixin</code>](#BaseMixin)  

* [PieChart](#PieChart)
    * [new PieChart(parent, [chartGroup])](#new_PieChart_new)
    * [.slicesCap([cap])](#PieChart+slicesCap) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
    * [.externalRadiusPadding([externalRadiusPadding])](#PieChart+externalRadiusPadding) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
    * [.innerRadius([innerRadius])](#PieChart+innerRadius) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
    * [.radius([radius])](#PieChart+radius) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
    * [.cx([cx])](#PieChart+cx) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
    * [.cy([cy])](#PieChart+cy) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
    * [.minAngleForLabel([minAngleForLabel])](#PieChart+minAngleForLabel) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
    * [.emptyTitle([title])](#PieChart+emptyTitle) ⇒ <code>String</code> \| [<code>PieChart</code>](#PieChart)
    * [.externalLabels([externalLabelRadius])](#PieChart+externalLabels) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
    * [.drawPaths([drawPaths])](#PieChart+drawPaths) ⇒ <code>Boolean</code> \| [<code>PieChart</code>](#PieChart)

<a name="new_PieChart_new"></a>

### new PieChart(parent, [chartGroup])
Create a Pie Chart


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a pie chart under #chart-container1 element using the default global chart group
var chart1 = new PieChart('#chart-container1');
// create a pie chart under #chart-container2 element using chart group A
var chart2 = new PieChart('#chart-container2', 'chartGroupA');
```
<a name="PieChart+slicesCap"></a>

### pieChart.slicesCap([cap]) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
Get or set the maximum number of slices the pie chart will generate. The top slices are determined by
value from high to low. Other slices exceeding the cap will be rolled up into one single *Others* slice.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type |
| --- | --- |
| [cap] | <code>Number</code> | 

<a name="PieChart+externalRadiusPadding"></a>

### pieChart.externalRadiusPadding([externalRadiusPadding]) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
Get or set the external radius padding of the pie chart. This will force the radius of the
pie chart to become smaller or larger depending on the value.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type | Default |
| --- | --- | --- |
| [externalRadiusPadding] | <code>Number</code> | <code>0</code> | 

<a name="PieChart+innerRadius"></a>

### pieChart.innerRadius([innerRadius]) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
Get or set the inner radius of the pie chart. If the inner radius is greater than 0px then the
pie chart will be rendered as a doughnut chart.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type | Default |
| --- | --- | --- |
| [innerRadius] | <code>Number</code> | <code>0</code> | 

<a name="PieChart+radius"></a>

### pieChart.radius([radius]) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
Get or set the outer radius. If the radius is not set, it will be half of the minimum of the
chart width and height.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type |
| --- | --- |
| [radius] | <code>Number</code> | 

<a name="PieChart+cx"></a>

### pieChart.cx([cx]) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
Get or set center x coordinate position. Default is center of svg.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type |
| --- | --- |
| [cx] | <code>Number</code> | 

<a name="PieChart+cy"></a>

### pieChart.cy([cy]) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
Get or set center y coordinate position. Default is center of svg.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type |
| --- | --- |
| [cy] | <code>Number</code> | 

<a name="PieChart+minAngleForLabel"></a>

### pieChart.minAngleForLabel([minAngleForLabel]) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
display a slice label.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type | Default |
| --- | --- | --- |
| [minAngleForLabel] | <code>Number</code> | <code>0.5</code> | 

<a name="PieChart+emptyTitle"></a>

### pieChart.emptyTitle([title]) ⇒ <code>String</code> \| [<code>PieChart</code>](#PieChart)
Title to use for the only slice when there is no data.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type |
| --- | --- |
| [title] | <code>String</code> | 

<a name="PieChart+externalLabels"></a>

### pieChart.externalLabels([externalLabelRadius]) ⇒ <code>Number</code> \| [<code>PieChart</code>](#PieChart)
Position slice labels offset from the outer edge of the chart.

The argument specifies the extra radius to be added for slice labels.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type |
| --- | --- |
| [externalLabelRadius] | <code>Number</code> | 

<a name="PieChart+drawPaths"></a>

### pieChart.drawPaths([drawPaths]) ⇒ <code>Boolean</code> \| [<code>PieChart</code>](#PieChart)
Get or set whether to draw lines from pie slices to their labels.

**Kind**: instance method of [<code>PieChart</code>](#PieChart)  

| Param | Type |
| --- | --- |
| [drawPaths] | <code>Boolean</code> | 

<a name="RowChart"></a>

## RowChart
Concrete row chart implementation.

Examples:
- [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)

**Kind**: global class  
**Mixes**: [<code>CapMixin</code>](#CapMixin), [<code>MarginMixin</code>](#MarginMixin), [<code>ColorMixin</code>](#ColorMixin), [<code>BaseMixin</code>](#BaseMixin)  

* [RowChart](#RowChart)
    * [new RowChart(parent, [chartGroup])](#new_RowChart_new)
    * [.x([scale])](#RowChart+x) ⇒ <code>d3.scale</code> \| [<code>RowChart</code>](#RowChart)
    * [.renderTitleLabel([renderTitleLabel])](#RowChart+renderTitleLabel) ⇒ <code>Boolean</code> \| [<code>RowChart</code>](#RowChart)
    * [.xAxis([xAxis])](#RowChart+xAxis) ⇒ <code>d3.axis</code> \| [<code>RowChart</code>](#RowChart)
    * [.fixedBarHeight([fixedBarHeight])](#RowChart+fixedBarHeight) ⇒ <code>Boolean</code> \| <code>Number</code> \| [<code>RowChart</code>](#RowChart)
    * [.gap([gap])](#RowChart+gap) ⇒ <code>Number</code> \| [<code>RowChart</code>](#RowChart)
    * [.elasticX([elasticX])](#RowChart+elasticX) ⇒ <code>Boolean</code> \| [<code>RowChart</code>](#RowChart)
    * [.labelOffsetX([labelOffsetX])](#RowChart+labelOffsetX) ⇒ <code>Number</code> \| [<code>RowChart</code>](#RowChart)
    * [.labelOffsetY([labelOffsety])](#RowChart+labelOffsetY) ⇒ <code>Number</code> \| [<code>RowChart</code>](#RowChart)
    * [.titleLabelOffsetX([titleLabelOffsetX])](#RowChart+titleLabelOffsetX) ⇒ <code>Number</code> \| [<code>RowChart</code>](#RowChart)

<a name="new_RowChart_new"></a>

### new RowChart(parent, [chartGroup])
Create a Row Chart.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a row chart under #chart-container1 element using the default global chart group
var chart1 = new RowChart('#chart-container1');
// create a row chart under #chart-container2 element using chart group A
var chart2 = new RowChart('#chart-container2', 'chartGroupA');
```
<a name="RowChart+x"></a>

### rowChart.x([scale]) ⇒ <code>d3.scale</code> \| [<code>RowChart</code>](#RowChart)
Gets or sets the x scale. The x scale can be any d3
[d3.scale](https://github.com/d3/d3-scale/blob/master/README.md).

**Kind**: instance method of [<code>RowChart</code>](#RowChart)  
**See**: [d3.scale](https://github.com/d3/d3-scale/blob/master/README.md)  

| Param | Type |
| --- | --- |
| [scale] | <code>d3.scale</code> | 

<a name="RowChart+renderTitleLabel"></a>

### rowChart.renderTitleLabel([renderTitleLabel]) ⇒ <code>Boolean</code> \| [<code>RowChart</code>](#RowChart)
Turn on/off Title label rendering (values) using SVG style of text-anchor 'end'.

**Kind**: instance method of [<code>RowChart</code>](#RowChart)  

| Param | Type | Default |
| --- | --- | --- |
| [renderTitleLabel] | <code>Boolean</code> | <code>false</code> | 

<a name="RowChart+xAxis"></a>

### rowChart.xAxis([xAxis]) ⇒ <code>d3.axis</code> \| [<code>RowChart</code>](#RowChart)
Get or sets the x axis for the row chart instance.
See the [d3.axis](https://github.com/d3/d3-axis/blob/master/README.md)
documention for more information.

**Kind**: instance method of [<code>RowChart</code>](#RowChart)  

| Param | Type |
| --- | --- |
| [xAxis] | <code>d3.axis</code> | 

**Example**  
```js
// customize x axis tick format
chart.xAxis().tickFormat(function (v) {return v + '%';});
// customize x axis tick values
chart.xAxis().tickValues([0, 100, 200, 300]);
// use a top-oriented axis. Note: position of the axis and grid lines will need to
// be set manually, see https://dc-js.github.io/dc.js/examples/row-top-axis.html
chart.xAxis(d3.axisTop())
```
<a name="RowChart+fixedBarHeight"></a>

### rowChart.fixedBarHeight([fixedBarHeight]) ⇒ <code>Boolean</code> \| <code>Number</code> \| [<code>RowChart</code>](#RowChart)
Get or set the fixed bar height. Default is [false] which will auto-scale bars.
For example, if you want to fix the height for a specific number of bars (useful in TopN charts)
you could fix height as follows (where count = total number of bars in your TopN and gap is
your vertical gap space).

**Kind**: instance method of [<code>RowChart</code>](#RowChart)  

| Param | Type | Default |
| --- | --- | --- |
| [fixedBarHeight] | <code>Boolean</code> \| <code>Number</code> | <code>false</code> | 

**Example**  
```js
chart.fixedBarHeight( chartheight - (count + 1) * gap / count);
```
<a name="RowChart+gap"></a>

### rowChart.gap([gap]) ⇒ <code>Number</code> \| [<code>RowChart</code>](#RowChart)
Get or set the vertical gap space between rows on a particular row chart instance.

**Kind**: instance method of [<code>RowChart</code>](#RowChart)  

| Param | Type | Default |
| --- | --- | --- |
| [gap] | <code>Number</code> | <code>5</code> | 

<a name="RowChart+elasticX"></a>

### rowChart.elasticX([elasticX]) ⇒ <code>Boolean</code> \| [<code>RowChart</code>](#RowChart)
Get or set the elasticity on x axis. If this attribute is set to true, then the x axis will rescale to auto-fit the
data range when filtered.

**Kind**: instance method of [<code>RowChart</code>](#RowChart)  

| Param | Type |
| --- | --- |
| [elasticX] | <code>Boolean</code> | 

<a name="RowChart+labelOffsetX"></a>

### rowChart.labelOffsetX([labelOffsetX]) ⇒ <code>Number</code> \| [<code>RowChart</code>](#RowChart)
Get or set the x offset (horizontal space to the top left corner of a row) for labels on a particular row chart.

**Kind**: instance method of [<code>RowChart</code>](#RowChart)  

| Param | Type | Default |
| --- | --- | --- |
| [labelOffsetX] | <code>Number</code> | <code>10</code> | 

<a name="RowChart+labelOffsetY"></a>

### rowChart.labelOffsetY([labelOffsety]) ⇒ <code>Number</code> \| [<code>RowChart</code>](#RowChart)
Get or set the y offset (vertical space to the top left corner of a row) for labels on a particular row chart.

**Kind**: instance method of [<code>RowChart</code>](#RowChart)  

| Param | Type | Default |
| --- | --- | --- |
| [labelOffsety] | <code>Number</code> | <code>15</code> | 

<a name="RowChart+titleLabelOffsetX"></a>

### rowChart.titleLabelOffsetX([titleLabelOffsetX]) ⇒ <code>Number</code> \| [<code>RowChart</code>](#RowChart)
Get of set the x offset (horizontal space between right edge of row and right edge or text.

**Kind**: instance method of [<code>RowChart</code>](#RowChart)  

| Param | Type | Default |
| --- | --- | --- |
| [titleLabelOffsetX] | <code>Number</code> | <code>2</code> | 

<a name="ScatterPlot"></a>

## ScatterPlot
A scatter plot chart

Examples:
- [Scatter Chart](http://dc-js.github.io/dc.js/examples/scatter.html)
- [Multi-Scatter Chart](http://dc-js.github.io/dc.js/examples/multi-scatter.html)

**Kind**: global class  
**Mixes**: [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

* [ScatterPlot](#ScatterPlot)
    * [new ScatterPlot(parent, [chartGroup])](#new_ScatterPlot_new)
    * [.resetSvg()](#ScatterPlot+resetSvg) ⇒ <code>SVGElement</code>
    * [.useCanvas([useCanvas])](#ScatterPlot+useCanvas) ⇒ <code>Boolean</code> \| <code>d3.selection</code>
    * [.canvas([canvasElement])](#ScatterPlot+canvas) ⇒ <code>CanvasElement</code> \| <code>d3.selection</code>
    * [.context()](#ScatterPlot+context) ⇒ <code>CanvasContext</code>
    * [.existenceAccessor([accessor])](#ScatterPlot+existenceAccessor) ⇒ <code>function</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.symbol([type])](#ScatterPlot+symbol) ⇒ <code>function</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.customSymbol([customSymbol])](#ScatterPlot+customSymbol) ⇒ <code>String</code> \| <code>function</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.symbolSize([symbolSize])](#ScatterPlot+symbolSize) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.highlightedSize([highlightedSize])](#ScatterPlot+highlightedSize) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.excludedSize([excludedSize])](#ScatterPlot+excludedSize) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.excludedColor([excludedColor])](#ScatterPlot+excludedColor) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.excludedOpacity([excludedOpacity])](#ScatterPlot+excludedOpacity) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.emptySize([emptySize])](#ScatterPlot+emptySize) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.emptyColor([emptyColor])](#ScatterPlot+emptyColor) ⇒ <code>String</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.emptyOpacity([emptyOpacity])](#ScatterPlot+emptyOpacity) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
    * [.nonemptyOpacity([nonemptyOpacity])](#ScatterPlot+nonemptyOpacity) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)

<a name="new_ScatterPlot_new"></a>

### new ScatterPlot(parent, [chartGroup])
Create a Scatter Plot.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a scatter plot under #chart-container1 element using the default global chart group
var chart1 = new ScatterPlot('#chart-container1');
// create a scatter plot under #chart-container2 element using chart group A
var chart2 = new ScatterPlot('#chart-container2', 'chartGroupA');
// create a sub-chart under a composite parent chart
var chart3 = new ScatterPlot(compositeChart);
```
<a name="ScatterPlot+resetSvg"></a>

### scatterPlot.resetSvg() ⇒ <code>SVGElement</code>
Method that replaces original resetSvg and appropriately inserts canvas
element along with svg element and sets their CSS properties appropriately
so they are overlapped on top of each other.
Remove the chart's SVGElements from the dom and recreate the container SVGElement.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  
**See**: [SVGElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGElement)  
<a name="ScatterPlot+useCanvas"></a>

### scatterPlot.useCanvas([useCanvas]) ⇒ <code>Boolean</code> \| <code>d3.selection</code>
Set or get whether to use canvas backend for plotting scatterPlot. Note that the
canvas backend does not currently support
[customSymbol](#ScatterPlot+customSymbol) or
[symbol](#ScatterPlot+symbol) methods and is limited to always plotting
with filled circles. Symbols are drawn with
[symbolSize](#ScatterPlot+symbolSize) radius. By default, the SVG backend
is used when `useCanvas` is set to `false`.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [useCanvas] | <code>Boolean</code> | <code>false</code> | 

<a name="ScatterPlot+canvas"></a>

### scatterPlot.canvas([canvasElement]) ⇒ <code>CanvasElement</code> \| <code>d3.selection</code>
Set or get canvas element. You should usually only ever use the get method as
dc.js will handle canvas element generation.  Provides valid canvas only when
[useCanvas](#ScatterPlot+useCanvas) is set to `true`

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  

| Param | Type |
| --- | --- |
| [canvasElement] | <code>CanvasElement</code> \| <code>d3.selection</code> | 

<a name="ScatterPlot+context"></a>

### scatterPlot.context() ⇒ <code>CanvasContext</code>
Get canvas 2D context. Provides valid context only when
[useCanvas](#ScatterPlot+useCanvas) is set to `true`

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  
<a name="ScatterPlot+existenceAccessor"></a>

### scatterPlot.existenceAccessor([accessor]) ⇒ <code>function</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Get or set the existence accessor.  If a point exists, it is drawn with
[symbolSize](#ScatterPlot+symbolSize) radius and
opacity 1; if it does not exist, it is drawn with
[emptySize](#ScatterPlot+emptySize) radius and opacity 0. By default,
the existence accessor checks if the reduced value is truthy.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  
**See**

- [symbolSize](#ScatterPlot+symbolSize)
- [emptySize](#ScatterPlot+emptySize)


| Param | Type |
| --- | --- |
| [accessor] | <code>function</code> | 

**Example**  
```js
// default accessor
chart.existenceAccessor(function (d) { return d.value; });
```
<a name="ScatterPlot+symbol"></a>

### scatterPlot.symbol([type]) ⇒ <code>function</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Get or set the symbol type used for each point. By default the symbol is a circle (d3.symbolCircle).
Type can be a constant or an accessor.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  
**See**: [symbol.type](https://github.com/d3/d3-shape/blob/master/README.md#symbol_type)  

| Param | Type | Default |
| --- | --- | --- |
| [type] | <code>function</code> | <code>d3.symbolCircle</code> | 

**Example**  
```js
// Circle type
chart.symbol(d3.symbolCircle);
// Square type
chart.symbol(d3.symbolSquare);
```
<a name="ScatterPlot+customSymbol"></a>

### scatterPlot.customSymbol([customSymbol]) ⇒ <code>String</code> \| <code>function</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Get or set the symbol generator. By default `ScatterPlot` will use
[d3.symbol()](https://github.com/d3/d3-shape/blob/master/README.md#symbol)
to generate symbols. `ScatterPlot` will set the
[symbol size accessor](https://github.com/d3/d3-shape/blob/master/README.md#symbol_size)
on the symbol generator.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  
**See**

- [d3.symbol](https://github.com/d3/d3-shape/blob/master/README.md#symbol)
- [Create additional D3.js symbols](https://stackoverflow.com/questions/25332120/create-additional-d3-js-symbols)


| Param | Type | Default |
| --- | --- | --- |
| [customSymbol] | <code>String</code> \| <code>function</code> | <code>d3.symbol()</code> | 

<a name="ScatterPlot+symbolSize"></a>

### scatterPlot.symbolSize([symbolSize]) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Set or get radius for symbols.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  
**See**: [d3.symbol.size](https://github.com/d3/d3-shape/blob/master/README.md#symbol_size)  

| Param | Type | Default |
| --- | --- | --- |
| [symbolSize] | <code>Number</code> | <code>3</code> | 

<a name="ScatterPlot+highlightedSize"></a>

### scatterPlot.highlightedSize([highlightedSize]) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Set or get radius for highlighted symbols.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  
**See**: [d3.symbol.size](https://github.com/d3/d3-shape/blob/master/README.md#symbol_size)  

| Param | Type | Default |
| --- | --- | --- |
| [highlightedSize] | <code>Number</code> | <code>5</code> | 

<a name="ScatterPlot+excludedSize"></a>

### scatterPlot.excludedSize([excludedSize]) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Set or get size for symbols excluded from this chart's filter. If null, no
special size is applied for symbols based on their filter status.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  
**See**: [d3.symbol.size](https://github.com/d3/d3-shape/blob/master/README.md#symbol_size)  

| Param | Type | Default |
| --- | --- | --- |
| [excludedSize] | <code>Number</code> | <code></code> | 

<a name="ScatterPlot+excludedColor"></a>

### scatterPlot.excludedColor([excludedColor]) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Set or get color for symbols excluded from this chart's filter. If null, no
special color is applied for symbols based on their filter status.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [excludedColor] | <code>Number</code> | <code></code> | 

<a name="ScatterPlot+excludedOpacity"></a>

### scatterPlot.excludedOpacity([excludedOpacity]) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Set or get opacity for symbols excluded from this chart's filter.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [excludedOpacity] | <code>Number</code> | <code>1.0</code> | 

<a name="ScatterPlot+emptySize"></a>

### scatterPlot.emptySize([emptySize]) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Set or get radius for symbols when the group is empty.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  
**See**: [d3.symbol.size](https://github.com/d3/d3-shape/blob/master/README.md#symbol_size)  

| Param | Type | Default |
| --- | --- | --- |
| [emptySize] | <code>Number</code> | <code>0</code> | 

<a name="ScatterPlot+emptyColor"></a>

### scatterPlot.emptyColor([emptyColor]) ⇒ <code>String</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Set or get color for symbols when the group is empty. If null, just use the
[colorMixin.colors](#ColorMixin+colors) color scale zero value.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [emptyColor] | <code>String</code> | <code></code> | 

<a name="ScatterPlot+emptyOpacity"></a>

### scatterPlot.emptyOpacity([emptyOpacity]) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Set or get opacity for symbols when the group is empty.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [emptyOpacity] | <code>Number</code> | <code>0</code> | 

<a name="ScatterPlot+nonemptyOpacity"></a>

### scatterPlot.nonemptyOpacity([nonemptyOpacity]) ⇒ <code>Number</code> \| [<code>ScatterPlot</code>](#ScatterPlot)
Set or get opacity for symbols when the group is not empty.

**Kind**: instance method of [<code>ScatterPlot</code>](#ScatterPlot)  

| Param | Type | Default |
| --- | --- | --- |
| [nonemptyOpacity] | <code>Number</code> | <code>1</code> | 

<a name="SelectMenu"></a>

## SelectMenu
The select menu is a simple widget designed to filter a dimension by selecting an option from
an HTML `<select/>` menu. The menu can be optionally turned into a multiselect.

**Kind**: global class  
**Mixes**: [<code>BaseMixin</code>](#BaseMixin)  

* [SelectMenu](#SelectMenu)
    * [new SelectMenu(parent, [chartGroup])](#new_SelectMenu_new)
    * [.order([order])](#SelectMenu+order) ⇒ <code>function</code> \| [<code>SelectMenu</code>](#SelectMenu)
    * [.promptText([promptText])](#SelectMenu+promptText) ⇒ <code>String</code> \| [<code>SelectMenu</code>](#SelectMenu)
    * [.filterDisplayed([filterDisplayed])](#SelectMenu+filterDisplayed) ⇒ <code>function</code> \| [<code>SelectMenu</code>](#SelectMenu)
    * [.multiple([multiple])](#SelectMenu+multiple) ⇒ <code>boolean</code> \| [<code>SelectMenu</code>](#SelectMenu)
    * [.promptValue([promptValue])](#SelectMenu+promptValue) ⇒ <code>\*</code> \| [<code>SelectMenu</code>](#SelectMenu)
    * [.numberVisible([numberVisible])](#SelectMenu+numberVisible) ⇒ <code>number</code> \| [<code>SelectMenu</code>](#SelectMenu)

<a name="new_SelectMenu_new"></a>

### new SelectMenu(parent, [chartGroup])
Create a Select Menu.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> \| [<code>CompositeChart</code>](#CompositeChart) | Any valid [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this widget should be placed in. Interaction with the widget will only trigger events and redraws within its group. |

**Example**  
```js
// create a select menu under #select-container using the default global chart group
var select = new SelectMenu('#select-container')
               .dimension(states)
               .group(stateGroup);
// the option text can be set via the title() function
// by default the option text is '`key`: `value`'
select.title(function (d){
    return 'STATE: ' + d.key;
})
```
<a name="SelectMenu+order"></a>

### selectMenu.order([order]) ⇒ <code>function</code> \| [<code>SelectMenu</code>](#SelectMenu)
Get or set the function that controls the ordering of option tags in the
select menu. By default options are ordered by the group key in ascending
order.

**Kind**: instance method of [<code>SelectMenu</code>](#SelectMenu)  

| Param | Type |
| --- | --- |
| [order] | <code>function</code> | 

**Example**  
```js
// order by the group's value
chart.order(function (a,b) {
    return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
});
```
<a name="SelectMenu+promptText"></a>

### selectMenu.promptText([promptText]) ⇒ <code>String</code> \| [<code>SelectMenu</code>](#SelectMenu)
Get or set the text displayed in the options used to prompt selection.

**Kind**: instance method of [<code>SelectMenu</code>](#SelectMenu)  

| Param | Type | Default |
| --- | --- | --- |
| [promptText] | <code>String</code> | <code>&#x27;Select all&#x27;</code> | 

**Example**  
```js
chart.promptText('All states');
```
<a name="SelectMenu+filterDisplayed"></a>

### selectMenu.filterDisplayed([filterDisplayed]) ⇒ <code>function</code> \| [<code>SelectMenu</code>](#SelectMenu)
Get or set the function that filters option tags prior to display. By default options
with a value of < 1 are not displayed.

**Kind**: instance method of [<code>SelectMenu</code>](#SelectMenu)  

| Param | Type |
| --- | --- |
| [filterDisplayed] | <code>function</code> | 

**Example**  
```js
// display all options override the `filterDisplayed` function:
chart.filterDisplayed(function () {
    return true;
});
```
<a name="SelectMenu+multiple"></a>

### selectMenu.multiple([multiple]) ⇒ <code>boolean</code> \| [<code>SelectMenu</code>](#SelectMenu)
Controls the type of select menu. Setting it to true converts the underlying
HTML tag into a multiple select.

**Kind**: instance method of [<code>SelectMenu</code>](#SelectMenu)  

| Param | Type | Default |
| --- | --- | --- |
| [multiple] | <code>boolean</code> | <code>false</code> | 

**Example**  
```js
chart.multiple(true);
```
<a name="SelectMenu+promptValue"></a>

### selectMenu.promptValue([promptValue]) ⇒ <code>\*</code> \| [<code>SelectMenu</code>](#SelectMenu)
Controls the default value to be used for
[dimension.filter](https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension_filter)
when only the prompt value is selected. If `null` (the default), no filtering will occur when
just the prompt is selected.

**Kind**: instance method of [<code>SelectMenu</code>](#SelectMenu)  

| Param | Type | Default |
| --- | --- | --- |
| [promptValue] | <code>\*</code> | <code></code> | 

<a name="SelectMenu+numberVisible"></a>

### selectMenu.numberVisible([numberVisible]) ⇒ <code>number</code> \| [<code>SelectMenu</code>](#SelectMenu)
Controls the number of items to show in the select menu, when `.multiple()` is true. This
controls the [`size` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#Attributes) of
the `select` element. If `null` (the default), uses the browser's default height.

**Kind**: instance method of [<code>SelectMenu</code>](#SelectMenu)  

| Param | Type | Default |
| --- | --- | --- |
| [numberVisible] | <code>number</code> | <code></code> | 

**Example**  
```js
chart.numberVisible(10);
```
<a name="SeriesChart"></a>

## SeriesChart
A series chart is a chart that shows multiple series of data overlaid on one chart, where the
series is specified in the data. It is a specialization of Composite Chart and inherits all
composite features other than recomposing the chart.

Examples:
- [Series Chart](http://dc-js.github.io/dc.js/examples/series.html)

**Kind**: global class  
**Mixes**: [<code>CompositeChart</code>](#CompositeChart)  

* [SeriesChart](#SeriesChart)
    * [new SeriesChart(parent, [chartGroup])](#new_SeriesChart_new)
    * [.chart([chartFunction])](#SeriesChart+chart) ⇒ <code>function</code> \| [<code>SeriesChart</code>](#SeriesChart)
    * [.seriesAccessor([accessor])](#SeriesChart+seriesAccessor) ⇒ <code>function</code> \| [<code>SeriesChart</code>](#SeriesChart)
    * [.seriesSort([sortFunction])](#SeriesChart+seriesSort) ⇒ <code>function</code> \| [<code>SeriesChart</code>](#SeriesChart)
    * [.valueSort([sortFunction])](#SeriesChart+valueSort) ⇒ <code>function</code> \| [<code>SeriesChart</code>](#SeriesChart)

<a name="new_SeriesChart_new"></a>

### new SeriesChart(parent, [chartGroup])
Create a Series Chart.


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a series chart under #chart-container1 element using the default global chart group
var seriesChart1 = new SeriesChart("#chart-container1");
// create a series chart under #chart-container2 element using chart group A
var seriesChart2 = new SeriesChart("#chart-container2", "chartGroupA");
```
<a name="SeriesChart+chart"></a>

### seriesChart.chart([chartFunction]) ⇒ <code>function</code> \| [<code>SeriesChart</code>](#SeriesChart)
Get or set the chart function, which generates the child charts.

**Kind**: instance method of [<code>SeriesChart</code>](#SeriesChart)  

| Param | Type | Default |
| --- | --- | --- |
| [chartFunction] | <code>function</code> | <code>(anchor) &#x3D;&gt;  new LineChart(anchor)</code> | 

**Example**  
```js
// put curve on the line charts used for the series
chart.chart(function(c) { return new LineChart(c).curve(d3.curveBasis); })
// do a scatter series chart
chart.chart(anchor => new ScatterPlot(anchor))
```
<a name="SeriesChart+seriesAccessor"></a>

### seriesChart.seriesAccessor([accessor]) ⇒ <code>function</code> \| [<code>SeriesChart</code>](#SeriesChart)
**mandatory**

Get or set accessor function for the displayed series. Given a datum, this function
should return the series that datum belongs to.

**Kind**: instance method of [<code>SeriesChart</code>](#SeriesChart)  

| Param | Type |
| --- | --- |
| [accessor] | <code>function</code> | 

**Example**  
```js
// simple series accessor
chart.seriesAccessor(function(d) { return "Expt: " + d.key[0]; })
```
<a name="SeriesChart+seriesSort"></a>

### seriesChart.seriesSort([sortFunction]) ⇒ <code>function</code> \| [<code>SeriesChart</code>](#SeriesChart)
Get or set a function to sort the list of series by, given series values.

**Kind**: instance method of [<code>SeriesChart</code>](#SeriesChart)  
**See**

- [d3.ascending](https://github.com/d3/d3-array/blob/master/README.md#ascending)
- [d3.descending](https://github.com/d3/d3-array/blob/master/README.md#descending)


| Param | Type | Default |
| --- | --- | --- |
| [sortFunction] | <code>function</code> | <code>d3.ascending</code> | 

**Example**  
```js
chart.seriesSort(d3.descending);
```
<a name="SeriesChart+valueSort"></a>

### seriesChart.valueSort([sortFunction]) ⇒ <code>function</code> \| [<code>SeriesChart</code>](#SeriesChart)
Get or set a function to sort each series values by. By default this is the key accessor which,
for example, will ensure a lineChart series connects its points in increasing key/x order,
rather than haphazardly.

**Kind**: instance method of [<code>SeriesChart</code>](#SeriesChart)  
**See**

- [d3.ascending](https://github.com/d3/d3-array/blob/master/README.md#ascending)
- [d3.descending](https://github.com/d3/d3-array/blob/master/README.md#descending)


| Param | Type |
| --- | --- |
| [sortFunction] | <code>function</code> | 

**Example**  
```js
// Default value sort
_chart.valueSort(function keySort (a, b) {
    return d3.ascending(_chart.keyAccessor()(a), _chart.keyAccessor()(b));
});
```
<a name="SunburstChart"></a>

## SunburstChart
The sunburst chart implementation is usually used to visualize a small tree distribution.  The sunburst
chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
slice relative to the sum of all values. Slices are ordered by [ordering](#BaseMixin+ordering) which defaults to sorting
by key.

The keys used in the sunburst chart should be arrays, representing paths in the tree.

When filtering, the sunburst chart creates instances of [HierarchyFilter](Filters.HierarchyFilter).

**Kind**: global class  
**Mixes**: [<code>CapMixin</code>](#CapMixin), [<code>ColorMixin</code>](#ColorMixin), [<code>BaseMixin</code>](#BaseMixin)  

* [SunburstChart](#SunburstChart)
    * [new SunburstChart(parent, [chartGroup])](#new_SunburstChart_new)
    * [.innerRadius([innerRadius])](#SunburstChart+innerRadius) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
    * [.radius([radius])](#SunburstChart+radius) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
    * [.cx([cx])](#SunburstChart+cx) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
    * [.cy([cy])](#SunburstChart+cy) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
    * [.minAngleForLabel([minAngleForLabel])](#SunburstChart+minAngleForLabel) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
    * [.emptyTitle([title])](#SunburstChart+emptyTitle) ⇒ <code>String</code> \| [<code>SunburstChart</code>](#SunburstChart)
    * [.externalLabels([externalLabelRadius])](#SunburstChart+externalLabels) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
    * [.defaultRingSizes()](#SunburstChart+defaultRingSizes) ⇒ <code>RingSizes</code>
    * [.equalRingSizes()](#SunburstChart+equalRingSizes) ⇒ <code>RingSizes</code>
    * [.relativeRingSizes([relativeRingSizesFunction])](#SunburstChart+relativeRingSizes) ⇒ <code>RingSizes</code>
    * [.ringSizes(ringSizes)](#SunburstChart+ringSizes) ⇒ <code>Object</code> \| [<code>SunburstChart</code>](#SunburstChart)

<a name="new_SunburstChart_new"></a>

### new SunburstChart(parent, [chartGroup])
Create a Sunburst Chart


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> | Any valid [d3 single selector](https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
// create a sunburst chart under #chart-container1 element using the default global chart group
var chart1 = new SunburstChart('#chart-container1');
// create a sunburst chart under #chart-container2 element using chart group A
var chart2 = new SunburstChart('#chart-container2', 'chartGroupA');
```
<a name="SunburstChart+innerRadius"></a>

### sunburstChart.innerRadius([innerRadius]) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
Get or set the inner radius of the sunburst chart. If the inner radius is greater than 0px then the
sunburst chart will be rendered as a doughnut chart. Default inner radius is 0px.

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  

| Param | Type | Default |
| --- | --- | --- |
| [innerRadius] | <code>Number</code> | <code>0</code> | 

<a name="SunburstChart+radius"></a>

### sunburstChart.radius([radius]) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
Get or set the outer radius. If the radius is not set, it will be half of the minimum of the
chart width and height.

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  

| Param | Type |
| --- | --- |
| [radius] | <code>Number</code> | 

<a name="SunburstChart+cx"></a>

### sunburstChart.cx([cx]) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
Get or set center x coordinate position. Default is center of svg.

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  

| Param | Type |
| --- | --- |
| [cx] | <code>Number</code> | 

<a name="SunburstChart+cy"></a>

### sunburstChart.cy([cy]) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
Get or set center y coordinate position. Default is center of svg.

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  

| Param | Type |
| --- | --- |
| [cy] | <code>Number</code> | 

<a name="SunburstChart+minAngleForLabel"></a>

### sunburstChart.minAngleForLabel([minAngleForLabel]) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
display a slice label.

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  

| Param | Type | Default |
| --- | --- | --- |
| [minAngleForLabel] | <code>Number</code> | <code>0.5</code> | 

<a name="SunburstChart+emptyTitle"></a>

### sunburstChart.emptyTitle([title]) ⇒ <code>String</code> \| [<code>SunburstChart</code>](#SunburstChart)
Title to use for the only slice when there is no data.

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  

| Param | Type |
| --- | --- |
| [title] | <code>String</code> | 

<a name="SunburstChart+externalLabels"></a>

### sunburstChart.externalLabels([externalLabelRadius]) ⇒ <code>Number</code> \| [<code>SunburstChart</code>](#SunburstChart)
Position slice labels offset from the outer edge of the chart.

The argument specifies the extra radius to be added for slice labels.

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  

| Param | Type |
| --- | --- |
| [externalLabelRadius] | <code>Number</code> | 

<a name="SunburstChart+defaultRingSizes"></a>

### sunburstChart.defaultRingSizes() ⇒ <code>RingSizes</code>
Constructs the default RingSizes parameter for [ringSizes()](#SunburstChart+ringSizes),
which makes the rings narrower as they get farther away from the center.

Can be used as a parameter to ringSizes() to reset the default behavior, or modified for custom ring sizes.

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  
**Example**  
```js
var chart = new dc.SunburstChart(...);
  chart.ringSizes(chart.defaultRingSizes())
```
<a name="SunburstChart+equalRingSizes"></a>

### sunburstChart.equalRingSizes() ⇒ <code>RingSizes</code>
Constructs a RingSizes parameter for [ringSizes()](#SunburstChart+ringSizes)
that will make the chart rings equally wide.

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  
**Example**  
```js
var chart = new dc.SunburstChart(...);
  chart.ringSizes(chart.equalRingSizes())
```
<a name="SunburstChart+relativeRingSizes"></a>

### sunburstChart.relativeRingSizes([relativeRingSizesFunction]) ⇒ <code>RingSizes</code>
Constructs a RingSizes parameter for [ringSizes()](#SunburstChart+ringSizes) using the given function
to determine each rings width.

* The function must return an array containing portion values for each ring/level of the chart.
* The length of the array must match the number of rings of the chart at runtime, which is provided as the only
  argument.
* The sum of all portions from the array must be 1 (100%).

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  

| Param | Type |
| --- | --- |
| [relativeRingSizesFunction] | <code>function</code> | 

**Example**  
```js
// specific relative portions (the number of rings (3) is known in this case)
chart.ringSizes(chart.relativeRingSizes(function (ringCount) {
    return [.1, .3, .6];
});
```
<a name="SunburstChart+ringSizes"></a>

### sunburstChart.ringSizes(ringSizes) ⇒ <code>Object</code> \| [<code>SunburstChart</code>](#SunburstChart)
Get or set the strategy to use for sizing the charts rings.

There are three strategies available
* [`defaultRingSizes`](#SunburstChart+defaultRingSizes): the rings get narrower farther away from the center
* [`relativeRingSizes`](#SunburstChart+relativeRingSizes): set the ring sizes as portions of 1
* [`equalRingSizes`](#SunburstChart+equalRingSizes): the rings are equally wide

You can modify the returned strategy, or create your own, for custom ring sizing.

RingSizes is a duck-typed interface that must support the following methods:
* `partitionDy()`: used for
  [`d3.partition.size`](https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#partition_size)
* `scaleInnerRadius(d)`: takes datum and returns radius for
   [`d3.arc.innerRadius`](https://github.com/d3/d3-shape/blob/v1.3.7/README.md#arc_innerRadius)
* `scaleOuterRadius(d)`: takes datum and returns radius for
   [`d3.arc.outerRadius`](https://github.com/d3/d3-shape/blob/v1.3.7/README.md#arc_outerRadius)
* `relativeRingSizesFunction(ringCount)`: takes ring count and returns an array of portions that
  must add up to 1

**Kind**: instance method of [<code>SunburstChart</code>](#SunburstChart)  

| Param | Type |
| --- | --- |
| ringSizes | <code>RingSizes</code> | 

**Example**  
```js
// make rings equally wide
chart.ringSizes(chart.equalRingSizes())
// reset to default behavior
chart.ringSizes(chart.defaultRingSizes()))
```
<a name="TextFilterWidget"></a>

## TextFilterWidget
Text Filter Widget

The text filter widget is a simple widget designed to display an input field allowing to filter
data that matches the text typed.
As opposed to the other charts, this doesn't display any result and doesn't update its display,
it's just to input an filter other charts.

**Kind**: global class  
**Mixes**: [<code>BaseMixin</code>](#BaseMixin)  

* [TextFilterWidget](#TextFilterWidget)
    * [new TextFilterWidget(parent, [chartGroup])](#new_TextFilterWidget_new)
    * [.normalize([normalize])](#TextFilterWidget+normalize) ⇒ [<code>TextFilterWidget</code>](#TextFilterWidget) \| <code>function</code>
    * [.placeHolder([placeHolder])](#TextFilterWidget+placeHolder) ⇒ [<code>TextFilterWidget</code>](#TextFilterWidget) \| <code>string</code>
    * [.filterFunctionFactory([filterFunctionFactory])](#TextFilterWidget+filterFunctionFactory) ⇒ [<code>TextFilterWidget</code>](#TextFilterWidget) \| <code>function</code>

<a name="new_TextFilterWidget_new"></a>

### new TextFilterWidget(parent, [chartGroup])
Create Text Filter widget


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>String</code> \| <code>node</code> \| <code>d3.selection</code> \| [<code>CompositeChart</code>](#CompositeChart) | Any valid [d3 single selector](https://github.com/d3/d3-selection/blob/master/README.md#select) specifying a dom block element such as a div; or a dom element or d3 selection. |
| [chartGroup] | <code>String</code> | The name of the chart group this chart instance should be placed in. Interaction with a chart will only trigger events and redraws within the chart's group. |

**Example**  
```js
var data = [{"firstName":"John","lastName":"Coltrane"}{"firstName":"Miles",lastName:"Davis"}]
var ndx = crossfilter(data);
var dimension = ndx.dimension(function(d) {
    return d.lastName.toLowerCase() + ' ' + d.firstName.toLowerCase();
});

new TextFilterWidget('#search')
    .dimension(dimension);
    // you don't need the group() function
```
<a name="TextFilterWidget+normalize"></a>

### textFilterWidget.normalize([normalize]) ⇒ [<code>TextFilterWidget</code>](#TextFilterWidget) \| <code>function</code>
This function will be called on values before calling the filter function.

**Kind**: instance method of [<code>TextFilterWidget</code>](#TextFilterWidget)  

| Param | Type |
| --- | --- |
| [normalize] | <code>function</code> | 

**Example**  
```js
// This is the default
chart.normalize(function (s) {
  return s.toLowerCase();
});
```
<a name="TextFilterWidget+placeHolder"></a>

### textFilterWidget.placeHolder([placeHolder]) ⇒ [<code>TextFilterWidget</code>](#TextFilterWidget) \| <code>string</code>
Placeholder text in the search box.

**Kind**: instance method of [<code>TextFilterWidget</code>](#TextFilterWidget)  

| Param | Type | Default |
| --- | --- | --- |
| [placeHolder] | <code>function</code> | <code>&#x27;search&#x27;</code> | 

**Example**  
```js
// This is the default
chart.placeHolder('type to filter');
```
<a name="TextFilterWidget+filterFunctionFactory"></a>

### textFilterWidget.filterFunctionFactory([filterFunctionFactory]) ⇒ [<code>TextFilterWidget</code>](#TextFilterWidget) \| <code>function</code>
This function will be called with the search text, it needs to return a function that will be used to
filter the data. The default function checks presence of the search text.

**Kind**: instance method of [<code>TextFilterWidget</code>](#TextFilterWidget)  

| Param | Type |
| --- | --- |
| [filterFunctionFactory] | <code>function</code> | 

**Example**  
```js
// This is the default
function (query) {
    query = _normalize(query);
    return function (d) {
        return _normalize(d).indexOf(query) !== -1;
    };
};
```
<a name="BaseMixin"></a>

## BaseMixin
`BaseMixin` is an abstract functional object representing a basic `dc` chart object
for all chart and widget implementations. Methods from the [BaseMixin](#BaseMixin) are inherited
and available on all chart implementations in the `dc` library.

**Kind**: global mixin  

* [BaseMixin](#BaseMixin)
    * [.height([height])](#BaseMixin+height) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.width([width])](#BaseMixin+width) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.minWidth([minWidth])](#BaseMixin+minWidth) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.minHeight([minHeight])](#BaseMixin+minHeight) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.useViewBoxResizing([useViewBoxResizing])](#BaseMixin+useViewBoxResizing) ⇒ <code>Boolean</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.dimension([dimension])](#BaseMixin+dimension) ⇒ <code>crossfilter.dimension</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.data([callback])](#BaseMixin+data) ⇒ <code>\*</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.group([group], [name])](#BaseMixin+group) ⇒ <code>crossfilter.group</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.ordering([orderFunction])](#BaseMixin+ordering) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.filterAll()](#BaseMixin+filterAll) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.select(sel)](#BaseMixin+select) ⇒ <code>d3.selection</code>
    * [.selectAll(sel)](#BaseMixin+selectAll) ⇒ <code>d3.selection</code>
    * [.anchor([parent], [chartGroup])](#BaseMixin+anchor) ⇒ <code>String</code> \| <code>node</code> \| <code>d3.selection</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.anchorName()](#BaseMixin+anchorName) ⇒ <code>String</code>
    * [.root([rootElement])](#BaseMixin+root) ⇒ <code>HTMLElement</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.svg([svgElement])](#BaseMixin+svg) ⇒ <code>SVGElement</code> \| <code>d3.selection</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.resetSvg()](#BaseMixin+resetSvg) ⇒ <code>SVGElement</code>
    * [.svgDescription([description])](#BaseMixin+svgDescription) ⇒ <code>String</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.keyboardAccessible([keyboardAccessible])](#BaseMixin+keyboardAccessible) ⇒ <code>Boolean</code> \| [<code>BarChart</code>](#BarChart)
    * [.filterPrinter([filterPrinterFunction])](#BaseMixin+filterPrinter) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.controlsUseVisibility([controlsUseVisibility])](#BaseMixin+controlsUseVisibility) ⇒ <code>Boolean</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.turnOnControls()](#BaseMixin+turnOnControls) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.turnOffControls()](#BaseMixin+turnOffControls) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.transitionDuration([duration])](#BaseMixin+transitionDuration) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.transitionDelay([delay])](#BaseMixin+transitionDelay) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.render()](#BaseMixin+render) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.redraw()](#BaseMixin+redraw) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.commitHandler(commitHandler)](#BaseMixin+commitHandler) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.redrawGroup()](#BaseMixin+redrawGroup) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.renderGroup()](#BaseMixin+renderGroup) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.hasFilterHandler([hasFilterHandler])](#BaseMixin+hasFilterHandler) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.hasFilter([filter])](#BaseMixin+hasFilter) ⇒ <code>Boolean</code>
    * [.removeFilterHandler([removeFilterHandler])](#BaseMixin+removeFilterHandler) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.addFilterHandler([addFilterHandler])](#BaseMixin+addFilterHandler) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.resetFilterHandler([resetFilterHandler])](#BaseMixin+resetFilterHandler) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.replaceFilter([filter])](#BaseMixin+replaceFilter) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.filter([filter])](#BaseMixin+filter) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.filters()](#BaseMixin+filters) ⇒ <code>Array.&lt;\*&gt;</code>
    * [.onClick(datum)](#BaseMixin+onClick) ⇒ <code>undefined</code>
    * [.filterHandler([filterHandler])](#BaseMixin+filterHandler) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.keyAccessor([keyAccessor])](#BaseMixin+keyAccessor) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.valueAccessor([valueAccessor])](#BaseMixin+valueAccessor) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.label([labelFunction], [enableLabels])](#BaseMixin+label) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.renderLabel([renderLabel])](#BaseMixin+renderLabel) ⇒ <code>Boolean</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.title([titleFunction])](#BaseMixin+title) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.renderTitle([renderTitle])](#BaseMixin+renderTitle) ⇒ <code>Boolean</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.chartGroup([chartGroup])](#BaseMixin+chartGroup) ⇒ <code>String</code> \| [<code>BaseMixin</code>](#BaseMixin)
    * [.expireCache()](#BaseMixin+expireCache) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.legend([legend])](#BaseMixin+legend) ⇒ [<code>Legend</code>](#Legend) \| [<code>BaseMixin</code>](#BaseMixin)
    * [.chartID()](#BaseMixin+chartID) ⇒ <code>String</code>
    * [.options(opts)](#BaseMixin+options) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * [.on(event, listener)](#BaseMixin+on) ⇒ [<code>BaseMixin</code>](#BaseMixin)
    * ~~[.renderlet(renderletFunction)](#BaseMixin+renderlet) ⇒ [<code>BaseMixin</code>](#BaseMixin)~~

<a name="BaseMixin+height"></a>

### baseMixin.height([height]) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the height attribute of a chart. The height is applied to the SVGElement generated by
the chart when rendered (or re-rendered). If a value is given, then it will be used to calculate
the new height and the chart returned for method chaining.  The value can either be a numeric, a
function, or falsy. If no value is specified then the value of the current height attribute will
be returned.

By default, without an explicit height being given, the chart will select the width of its
anchor element. If that isn't possible it defaults to 200 (provided by the
[minHeight](#BaseMixin+minHeight) property). Setting the value falsy will return
the chart to the default behavior.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [minHeight](#BaseMixin+minHeight)  

| Param | Type |
| --- | --- |
| [height] | <code>Number</code> \| <code>function</code> | 

**Example**  
```js
// Default height
chart.height(function (element) {
    var height = element && element.getBoundingClientRect && element.getBoundingClientRect().height;
    return (height && height > chart.minHeight()) ? height : chart.minHeight();
});

chart.height(250); // Set the chart's height to 250px;
chart.height(function(anchor) { return doSomethingWith(anchor); }); // set the chart's height with a function
chart.height(null); // reset the height to the default auto calculation
```
<a name="BaseMixin+width"></a>

### baseMixin.width([width]) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the width attribute of a chart.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**

- [height](#BaseMixin+height)
- [minWidth](#BaseMixin+minWidth)


| Param | Type |
| --- | --- |
| [width] | <code>Number</code> \| <code>function</code> | 

**Example**  
```js
// Default width
chart.width(function (element) {
    var width = element && element.getBoundingClientRect && element.getBoundingClientRect().width;
    return (width && width > chart.minWidth()) ? width : chart.minWidth();
});
```
<a name="BaseMixin+minWidth"></a>

### baseMixin.minWidth([minWidth]) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the minimum width attribute of a chart. This only has effect when used with the default
[width](#BaseMixin+width) function.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [width](#BaseMixin+width)  

| Param | Type | Default |
| --- | --- | --- |
| [minWidth] | <code>Number</code> | <code>200</code> | 

<a name="BaseMixin+minHeight"></a>

### baseMixin.minHeight([minHeight]) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the minimum height attribute of a chart. This only has effect when used with the default
[height](#BaseMixin+height) function.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [height](#BaseMixin+height)  

| Param | Type | Default |
| --- | --- | --- |
| [minHeight] | <code>Number</code> | <code>200</code> | 

<a name="BaseMixin+useViewBoxResizing"></a>

### baseMixin.useViewBoxResizing([useViewBoxResizing]) ⇒ <code>Boolean</code> \| [<code>BaseMixin</code>](#BaseMixin)
Turn on/off using the SVG
[`viewBox` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox).
When enabled, `viewBox` will be set on the svg root element instead of `width` and `height`.
Requires that the chart aspect ratio be defined using chart.width(w) and chart.height(h).

This will maintain the aspect ratio while enabling the chart to resize responsively to the
space given to the chart using CSS. For example, the chart can use `width: 100%; height:
100%` or absolute positioning to resize to its parent div.

Since the text will be sized as if the chart is drawn according to the width and height, and
will be resized if the chart is any other size, you need to set the chart width and height so
that the text looks good. In practice, 600x400 seems to work pretty well for most charts.

You can see examples of this resizing strategy in the [Chart Resizing
Examples](http://dc-js.github.io/dc.js/resizing/); just add `?resize=viewbox` to any of the
one-chart examples to enable `useViewBoxResizing`.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [useViewBoxResizing] | <code>Boolean</code> | <code>false</code> | 

<a name="BaseMixin+dimension"></a>

### baseMixin.dimension([dimension]) ⇒ <code>crossfilter.dimension</code> \| [<code>BaseMixin</code>](#BaseMixin)
**mandatory**

Set or get the dimension attribute of a chart. In `dc`, a dimension can be any valid
[crossfilter dimension](https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension)

If a value is given, then it will be used as the new dimension. If no value is specified then
the current dimension will be returned.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [crossfilter.dimension](https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension)  

| Param | Type |
| --- | --- |
| [dimension] | <code>crossfilter.dimension</code> | 

**Example**  
```js
var index = crossfilter([]);
var dimension = index.dimension(pluck('key'));
chart.dimension(dimension);
```
<a name="BaseMixin+data"></a>

### baseMixin.data([callback]) ⇒ <code>\*</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set the data callback or retrieve the chart's data set. The data callback is passed the chart's
group and by default will return
[group.all](https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_all).
This behavior may be modified to, for instance, return only the top 5 groups.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [callback] | <code>function</code> | 

**Example**  
```js
// Default data function
chart.data(function (group) { return group.all(); });

chart.data(function (group) { return group.top(5); });
```
<a name="BaseMixin+group"></a>

### baseMixin.group([group], [name]) ⇒ <code>crossfilter.group</code> \| [<code>BaseMixin</code>](#BaseMixin)
**mandatory**

Set or get the group attribute of a chart. In `dc` a group is a
[crossfilter group](https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce).
Usually the group should be created from the particular dimension associated with the same chart. If a value is
given, then it will be used as the new group.

If no value specified then the current group will be returned.
If `name` is specified then it will be used to generate legend label.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [crossfilter.group](https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce)  

| Param | Type |
| --- | --- |
| [group] | <code>crossfilter.group</code> | 
| [name] | <code>String</code> | 

**Example**  
```js
var index = crossfilter([]);
var dimension = index.dimension(pluck('key'));
chart.dimension(dimension);
chart.group(dimension.group().reduceSum());
```
<a name="BaseMixin+ordering"></a>

### baseMixin.ordering([orderFunction]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Get or set an accessor to order ordinal dimensions.  The chart uses
[Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
to sort elements; this accessor returns the value to order on.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [orderFunction] | <code>function</code> | 

**Example**  
```js
// Default ordering accessor
_chart.ordering(pluck('key'));
```
<a name="BaseMixin+filterAll"></a>

### baseMixin.filterAll() ⇒ [<code>BaseMixin</code>](#BaseMixin)
Clear all filters associated with this chart. The same effect can be achieved by calling
[chart.filter(null)](#BaseMixin+filter).

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+select"></a>

### baseMixin.select(sel) ⇒ <code>d3.selection</code>
Execute d3 single selection in the chart's scope using the given selector and return the d3
selection.

This function is **not chainable** since it does not return a chart instance; however the d3
selection result can be chained to d3 function calls.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [d3.select](https://github.com/d3/d3-selection/blob/master/README.md#select)  

| Param | Type | Description |
| --- | --- | --- |
| sel | <code>String</code> | CSS selector string |

**Example**  
```js
// Has the same effect as d3.select('#chart-id').select(selector)
chart.select(selector)
```
<a name="BaseMixin+selectAll"></a>

### baseMixin.selectAll(sel) ⇒ <code>d3.selection</code>
Execute in scope d3 selectAll using the given selector and return d3 selection result.

This function is **not chainable** since it does not return a chart instance; however the d3
selection result can be chained to d3 function calls.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [d3.selectAll](https://github.com/d3/d3-selection/blob/master/README.md#selectAll)  

| Param | Type | Description |
| --- | --- | --- |
| sel | <code>String</code> | CSS selector string |

**Example**  
```js
// Has the same effect as d3.select('#chart-id').selectAll(selector)
chart.selectAll(selector)
```
<a name="BaseMixin+anchor"></a>

### baseMixin.anchor([parent], [chartGroup]) ⇒ <code>String</code> \| <code>node</code> \| <code>d3.selection</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set the root SVGElement to either be an existing chart's root; or any valid [d3 single
selector](https://github.com/d3/d3-selection/blob/master/README.md#selecting-elements) specifying a dom
block element such as a div; or a dom element or d3 selection. Optionally registers the chart
within the chartGroup. This class is called internally on chart initialization, but be called
again to relocate the chart. However, it will orphan any previously created SVGElements.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [parent] | <code>anchorChart</code> \| <code>anchorSelector</code> \| <code>anchorNode</code> | 
| [chartGroup] | <code>String</code> | 

<a name="BaseMixin+anchorName"></a>

### baseMixin.anchorName() ⇒ <code>String</code>
Returns the DOM id for the chart's anchored location.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+root"></a>

### baseMixin.root([rootElement]) ⇒ <code>HTMLElement</code> \| [<code>BaseMixin</code>](#BaseMixin)
Returns the root element where a chart resides. Usually it will be the parent div element where
the SVGElement was created. You can also pass in a new root element however this is usually handled by
dc internally. Resetting the root element on a chart outside of dc internals may have
unexpected consequences.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)  

| Param | Type |
| --- | --- |
| [rootElement] | <code>HTMLElement</code> | 

<a name="BaseMixin+svg"></a>

### baseMixin.svg([svgElement]) ⇒ <code>SVGElement</code> \| <code>d3.selection</code> \| [<code>BaseMixin</code>](#BaseMixin)
Returns the top SVGElement for this specific chart. You can also pass in a new SVGElement,
however this is usually handled by dc internally. Resetting the SVGElement on a chart outside
of dc internals may have unexpected consequences.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [SVGElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGElement)  

| Param | Type |
| --- | --- |
| [svgElement] | <code>SVGElement</code> \| <code>d3.selection</code> | 

<a name="BaseMixin+resetSvg"></a>

### baseMixin.resetSvg() ⇒ <code>SVGElement</code>
Remove the chart's SVGElements from the dom and recreate the container SVGElement.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [SVGElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGElement)  
<a name="BaseMixin+svgDescription"></a>

### baseMixin.svgDescription([description]) ⇒ <code>String</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get description text for the entire SVG graphic. If set, will create a `<desc>` element as the first
child of the SVG with the description text and also make the SVG focusable from keyboard.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [description] | <code>String</code> | 

<a name="BaseMixin+keyboardAccessible"></a>

### baseMixin.keyboardAccessible([keyboardAccessible]) ⇒ <code>Boolean</code> \| [<code>BarChart</code>](#BarChart)
If set, interactive chart elements like individual bars in a bar chart or symbols in a scatter plot
will be focusable from keyboard and on pressing Enter or Space will behave as if clicked on.

If `svgDescription` has not been explicitly set, will also set SVG description text to the class
constructor name, like BarChart or HeatMap, and make the entire SVG focusable.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [keyboardAccessible] | <code>Boolean</code> | <code>false</code> | 

<a name="BaseMixin+filterPrinter"></a>

### baseMixin.filterPrinter([filterPrinterFunction]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the filter printer function. The filter printer function is used to generate human
friendly text for filter value(s) associated with the chart instance. The text will get shown
in the `.filter element; see [turnOnControls](#BaseMixin+turnOnControls).

By default dc charts use a default filter printer [filters](#printers.filters)
that provides simple printing support for both single value and ranged filters.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [filterPrinterFunction] | <code>function</code> | <code>printers.filters</code> | 

**Example**  
```js
// for a chart with an ordinal brush, print the filters in upper case
chart.filterPrinter(function(filters) {
  return filters.map(function(f) { return f.toUpperCase(); }).join(', ');
});
// for a chart with a range brush, print the filter as start and extent
chart.filterPrinter(function(filters) {
  return 'start ' + utils.printSingleValue(filters[0][0]) +
    ' extent ' + utils.printSingleValue(filters[0][1] - filters[0][0]);
});
```
<a name="BaseMixin+controlsUseVisibility"></a>

### baseMixin.controlsUseVisibility([controlsUseVisibility]) ⇒ <code>Boolean</code> \| [<code>BaseMixin</code>](#BaseMixin)
If set, use the `visibility` attribute instead of the `display` attribute for showing/hiding
chart reset and filter controls, for less disruption to the layout.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [controlsUseVisibility] | <code>Boolean</code> | <code>false</code> | 

<a name="BaseMixin+turnOnControls"></a>

### baseMixin.turnOnControls() ⇒ [<code>BaseMixin</code>](#BaseMixin)
Turn on optional control elements within the root element. dc currently supports the
following html control elements.
* root.selectAll('.reset') - elements are turned on if the chart has an active filter. This type
of control element is usually used to store a reset link to allow user to reset filter on a
certain chart. This element will be turned off automatically if the filter is cleared.
* root.selectAll('.filter') elements are turned on if the chart has an active filter. The text
content of this element is then replaced with the current filter value using the filter printer
function. This type of element will be turned off automatically if the filter is cleared.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+turnOffControls"></a>

### baseMixin.turnOffControls() ⇒ [<code>BaseMixin</code>](#BaseMixin)
Turn off optional control elements within the root element.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [turnOnControls](#BaseMixin+turnOnControls)  
<a name="BaseMixin+transitionDuration"></a>

### baseMixin.transitionDuration([duration]) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the animation transition duration (in milliseconds) for this chart instance.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [duration] | <code>Number</code> | <code>750</code> | 

<a name="BaseMixin+transitionDelay"></a>

### baseMixin.transitionDelay([delay]) ⇒ <code>Number</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the animation transition delay (in milliseconds) for this chart instance.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [delay] | <code>Number</code> | <code>0</code> | 

<a name="BaseMixin+render"></a>

### baseMixin.render() ⇒ [<code>BaseMixin</code>](#BaseMixin)
Invoking this method will force the chart to re-render everything from scratch. Generally it
should only be used to render the chart for the first time on the page or if you want to make
sure everything is redrawn from scratch instead of relying on the default incremental redrawing
behaviour.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+redraw"></a>

### baseMixin.redraw() ⇒ [<code>BaseMixin</code>](#BaseMixin)
Calling redraw will cause the chart to re-render data changes incrementally. If there is no
change in the underlying data dimension then calling this method will have no effect on the
chart. Most chart interaction in dc will automatically trigger this method through internal
events (in particular [redrawAll](#redrawAll)); therefore, you only need to
manually invoke this function if data is manipulated outside of dc's control (for example if
data is loaded in the background using
[crossfilter.add](https://github.com/crossfilter/crossfilter/wiki/API-Reference#crossfilter_add)).

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+commitHandler"></a>

### baseMixin.commitHandler(commitHandler) ⇒ [<code>BaseMixin</code>](#BaseMixin)
Gets/sets the commit handler. If the chart has a commit handler, the handler will be called when
the chart's filters have changed, in order to send the filter data asynchronously to a server.

Unlike other functions in dc.js, the commit handler is asynchronous. It takes two arguments:
a flag indicating whether this is a render (true) or a redraw (false), and a callback to be
triggered once the commit is done. The callback has the standard node.js continuation signature
with error first and result second.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| commitHandler | <code>function</code> | 

<a name="BaseMixin+redrawGroup"></a>

### baseMixin.redrawGroup() ⇒ [<code>BaseMixin</code>](#BaseMixin)
Redraws all charts in the same group as this chart, typically in reaction to a filter
change. If the chart has a [commitHandler](BaseMixin.commitFilter), it will
be executed and waited for.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+renderGroup"></a>

### baseMixin.renderGroup() ⇒ [<code>BaseMixin</code>](#BaseMixin)
Renders all charts in the same group as this chart. If the chart has a
[commitHandler](BaseMixin.commitFilter), it will be executed and waited for

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+hasFilterHandler"></a>

### baseMixin.hasFilterHandler([hasFilterHandler]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the has-filter handler. The has-filter handler is a function that checks to see if
the chart's current filters (first argument) include a specific filter (second argument).  Using a custom has-filter handler allows
you to change the way filters are checked for and replaced.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [hasFilterHandler] | <code>function</code> | 

**Example**  
```js
// default has-filter handler
chart.hasFilterHandler(function (filters, filter) {
    if (filter === null || typeof(filter) === 'undefined') {
        return filters.length > 0;
    }
    return filters.some(function (f) {
        return filter <= f && filter >= f;
    });
});

// custom filter handler (no-op)
chart.hasFilterHandler(function(filters, filter) {
    return false;
});
```
<a name="BaseMixin+hasFilter"></a>

### baseMixin.hasFilter([filter]) ⇒ <code>Boolean</code>
Check whether any active filter or a specific filter is associated with particular chart instance.
This function is **not chainable**.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [hasFilterHandler](#BaseMixin+hasFilterHandler)  

| Param | Type |
| --- | --- |
| [filter] | <code>\*</code> | 

<a name="BaseMixin+removeFilterHandler"></a>

### baseMixin.removeFilterHandler([removeFilterHandler]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the remove filter handler. The remove filter handler is a function that removes a
filter from the chart's current filters. Using a custom remove filter handler allows you to
change how filters are removed or perform additional work when removing a filter, e.g. when
using a filter server other than crossfilter.

The handler should return a new or modified array as the result.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [removeFilterHandler] | <code>function</code> | 

**Example**  
```js
// default remove filter handler
chart.removeFilterHandler(function (filters, filter) {
    for (var i = 0; i < filters.length; i++) {
        if (filters[i] <= filter && filters[i] >= filter) {
            filters.splice(i, 1);
            break;
        }
    }
    return filters;
});

// custom filter handler (no-op)
chart.removeFilterHandler(function(filters, filter) {
    return filters;
});
```
<a name="BaseMixin+addFilterHandler"></a>

### baseMixin.addFilterHandler([addFilterHandler]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the add filter handler. The add filter handler is a function that adds a filter to
the chart's filter list. Using a custom add filter handler allows you to change the way filters
are added or perform additional work when adding a filter, e.g. when using a filter server other
than crossfilter.

The handler should return a new or modified array as the result.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [addFilterHandler] | <code>function</code> | 

**Example**  
```js
// default add filter handler
chart.addFilterHandler(function (filters, filter) {
    filters.push(filter);
    return filters;
});

// custom filter handler (no-op)
chart.addFilterHandler(function(filters, filter) {
    return filters;
});
```
<a name="BaseMixin+resetFilterHandler"></a>

### baseMixin.resetFilterHandler([resetFilterHandler]) ⇒ [<code>BaseMixin</code>](#BaseMixin)
Set or get the reset filter handler. The reset filter handler is a function that resets the
chart's filter list by returning a new list. Using a custom reset filter handler allows you to
change the way filters are reset, or perform additional work when resetting the filters,
e.g. when using a filter server other than crossfilter.

The handler should return a new or modified array as the result.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

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
<a name="BaseMixin+replaceFilter"></a>

### baseMixin.replaceFilter([filter]) ⇒ [<code>BaseMixin</code>](#BaseMixin)
Replace the chart filter. This is equivalent to calling `chart.filter(null).filter(filter)`
but more efficient because the filter is only applied once.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [filter] | <code>\*</code> | 

<a name="BaseMixin+filter"></a>

### baseMixin.filter([filter]) ⇒ [<code>BaseMixin</code>](#BaseMixin)
Filter the chart by the given parameter, or return the current filter if no input parameter
is given.

The filter parameter can take one of these forms:
* A single value: the value will be toggled (added if it is not present in the current
filters, removed if it is present)
* An array containing a single array of values (`[[value,value,value]]`): each value is
toggled
* When appropriate for the chart, a [dc filter object](#filters) such as
  * [`filters.RangedFilter`](#filters.RangedFilter) for the
[CoordinateGridMixin](#CoordinateGridMixin) charts
  * [`filters.TwoDimensionalFilter`](#filters.TwoDimensionalFilter) for the
[heat map](#HeatMap)
  * [`filters.RangedTwoDimensionalFilter`](#filters.RangedTwoDimensionalFilter)
for the [scatter plot](#ScatterPlot)
* `null`: the filter will be reset using the
[resetFilterHandler](#BaseMixin+resetFilterHandler)

Note that this is always a toggle (even when it doesn't make sense for the filter type). If
you wish to replace the current filter, either call `chart.filter(null)` first - or it's more
efficient to call [`chart.replaceFilter(filter)`](#BaseMixin+replaceFilter) instead.

Each toggle is executed by checking if the value is already present using the
[hasFilterHandler](#BaseMixin+hasFilterHandler); if it is not present, it is added
using the [addFilterHandler](#BaseMixin+addFilterHandler); if it is already present,
it is removed using the [removeFilterHandler](#BaseMixin+removeFilterHandler).

Once the filters array has been updated, the filters are applied to the
crossfilter dimension, using the [filterHandler](#BaseMixin+filterHandler).

Once you have set the filters, call [`chart.redrawGroup()`](#BaseMixin+redrawGroup)
(or [`redrawAll()`](#redrawAll)) to redraw the chart's group.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**

- [addFilterHandler](#BaseMixin+addFilterHandler)
- [removeFilterHandler](#BaseMixin+removeFilterHandler)
- [resetFilterHandler](#BaseMixin+resetFilterHandler)
- [filterHandler](#BaseMixin+filterHandler)


| Param | Type |
| --- | --- |
| [filter] | <code>\*</code> | 

**Example**  
```js
// filter by a single string
chart.filter('Sunday');
// filter by a single age
chart.filter(18);
// filter by a set of states
chart.filter([['MA', 'TX', 'ND', 'WA']]);
// filter by range -- note the use of filters.RangedFilter, which is different
// from the syntax for filtering a crossfilter dimension directly, dimension.filter([15,20])
chart.filter(filters.RangedFilter(15,20));
```
<a name="BaseMixin+filters"></a>

### baseMixin.filters() ⇒ <code>Array.&lt;\*&gt;</code>
Returns all current filters. This method does not perform defensive cloning of the internal
filter array before returning, therefore any modification of the returned array will effect the
chart's internal filter storage.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+onClick"></a>

### baseMixin.onClick(datum) ⇒ <code>undefined</code>
This function is passed to d3 as the onClick handler for each chart. The default behavior is to
filter on the clicked datum (passed to the callback) and redraw the chart group.

This function can be replaced in order to change the click behavior (but first look at

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| datum | <code>\*</code> | 

**Example**  
```js
var oldHandler = chart.onClick;
chart.onClick = function(datum) {
  // use datum.
```
<a name="BaseMixin+filterHandler"></a>

### baseMixin.filterHandler([filterHandler]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the filter handler. The filter handler is a function that performs the filter action
on a specific dimension. Using a custom filter handler allows you to perform additional logic
before or after filtering.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [crossfilter.dimension.filter](https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension_filter)  

| Param | Type |
| --- | --- |
| [filterHandler] | <code>function</code> | 

**Example**  
```js
// the default filter handler handles all possible cases for the charts in dc.js
// you can replace it with something more specialized for your own chart
chart.filterHandler(function (dimension, filters) {
    if (filters.length === 0) {
        // the empty case (no filtering)
        dimension.filter(null);
    } else if (filters.length === 1 && !filters[0].isFiltered) {
        // single value and not a function-based filter
        dimension.filterExact(filters[0]);
    } else if (filters.length === 1 && filters[0].filterType === 'RangedFilter') {
        // single range-based filter
        dimension.filterRange(filters[0]);
    } else {
        // an array of values, or an array of filter objects
        dimension.filterFunction(function (d) {
            for (var i = 0; i < filters.length; i++) {
                var filter = filters[i];
                if (filter.isFiltered && filter.isFiltered(d)) {
                    return true;
                } else if (filter <= d && filter >= d) {
                    return true;
                }
            }
            return false;
        });
    }
    return filters;
});

// custom filter handler
chart.filterHandler(function(dimension, filter){
    var newFilter = filter + 10;
    dimension.filter(newFilter);
    return newFilter; // set the actual filter value to the new value
});
```
<a name="BaseMixin+keyAccessor"></a>

### baseMixin.keyAccessor([keyAccessor]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the key accessor function. The key accessor function is used to retrieve the key
value from the crossfilter group. Key values are used differently in different charts, for
example keys correspond to slices in a pie chart and x axis positions in a grid coordinate chart.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [keyAccessor] | <code>function</code> | 

**Example**  
```js
// default key accessor
chart.keyAccessor(function(d) { return d.key; });
// custom key accessor for a multi-value crossfilter reduction
chart.keyAccessor(function(p) { return p.value.absGain; });
```
<a name="BaseMixin+valueAccessor"></a>

### baseMixin.valueAccessor([valueAccessor]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the value accessor function. The value accessor function is used to retrieve the
value from the crossfilter group. Group values are used differently in different charts, for
example values correspond to slice sizes in a pie chart and y axis positions in a grid
coordinate chart.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [valueAccessor] | <code>function</code> | 

**Example**  
```js
// default value accessor
chart.valueAccessor(function(d) { return d.value; });
// custom value accessor for a multi-value crossfilter reduction
chart.valueAccessor(function(p) { return p.value.percentageGain; });
```
<a name="BaseMixin+label"></a>

### baseMixin.label([labelFunction], [enableLabels]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the label function. The chart class will use this function to render labels for each
child element in the chart, e.g. slices in a pie chart or bubbles in a bubble chart. Not every
chart supports the label function, for example line chart does not use this function
at all. By default, enables labels; pass false for the second parameter if this is not desired.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [labelFunction] | <code>function</code> |  | 
| [enableLabels] | <code>Boolean</code> | <code>true</code> | 

**Example**  
```js
// default label function just return the key
chart.label(function(d) { return d.key; });
// label function has access to the standard d3 data binding and can get quite complicated
chart.label(function(d) { return d.data.key + '(' + Math.floor(d.data.value / all.value() * 100) + '%)'; });
```
<a name="BaseMixin+renderLabel"></a>

### baseMixin.renderLabel([renderLabel]) ⇒ <code>Boolean</code> \| [<code>BaseMixin</code>](#BaseMixin)
Turn on/off label rendering

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [renderLabel] | <code>Boolean</code> | <code>false</code> | 

<a name="BaseMixin+title"></a>

### baseMixin.title([titleFunction]) ⇒ <code>function</code> \| [<code>BaseMixin</code>](#BaseMixin)
Set or get the title function. The chart class will use this function to render the SVGElement title
(usually interpreted by browser as tooltips) for each child element in the chart, e.g. a slice
in a pie chart or a bubble in a bubble chart. Almost every chart supports the title function;
however in grid coordinate charts you need to turn off the brush in order to see titles, because
otherwise the brush layer will block tooltip triggering.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [titleFunction] | <code>function</code> | 

**Example**  
```js
// default title function shows "key: value"
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
<a name="BaseMixin+renderTitle"></a>

### baseMixin.renderTitle([renderTitle]) ⇒ <code>Boolean</code> \| [<code>BaseMixin</code>](#BaseMixin)
Turn on/off title rendering, or return the state of the render title flag if no arguments are
given.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [renderTitle] | <code>Boolean</code> | <code>true</code> | 

<a name="BaseMixin+chartGroup"></a>

### baseMixin.chartGroup([chartGroup]) ⇒ <code>String</code> \| [<code>BaseMixin</code>](#BaseMixin)
Get or set the chart group to which this chart belongs. Chart groups are rendered or redrawn
together since it is expected they share the same underlying crossfilter data set.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [chartGroup] | <code>String</code> | 

<a name="BaseMixin+expireCache"></a>

### baseMixin.expireCache() ⇒ [<code>BaseMixin</code>](#BaseMixin)
Expire the internal chart cache. dc charts cache some data internally on a per chart basis to
speed up rendering and avoid unnecessary calculation; however it might be useful to clear the
cache if you have changed state which will affect rendering.  For example, if you invoke
[crossfilter.add](https://github.com/crossfilter/crossfilter/wiki/API-Reference#crossfilter_add)
function or reset group or dimension after rendering, it is a good idea to
clear the cache to make sure charts are rendered properly.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+legend"></a>

### baseMixin.legend([legend]) ⇒ [<code>Legend</code>](#Legend) \| [<code>BaseMixin</code>](#BaseMixin)
Attach a Legend widget to this chart. The legend widget will automatically draw legend labels
based on the color setting and names associated with each group.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| [legend] | [<code>Legend</code>](#Legend) | 

**Example**  
```js
chart.legend(new Legend().x(400).y(10).itemHeight(13).gap(5))
```
<a name="BaseMixin+chartID"></a>

### baseMixin.chartID() ⇒ <code>String</code>
Returns the internal numeric ID of the chart.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
<a name="BaseMixin+options"></a>

### baseMixin.options(opts) ⇒ [<code>BaseMixin</code>](#BaseMixin)
Set chart options using a configuration object. Each key in the object will cause the method of
the same name to be called with the value to set that attribute for the chart.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

| Param | Type |
| --- | --- |
| opts | <code>Object</code> | 

**Example**  
```js
chart.options({dimension: myDimension, group: myGroup});
```
<a name="BaseMixin+on"></a>

### baseMixin.on(event, listener) ⇒ [<code>BaseMixin</code>](#BaseMixin)
All dc chart instance supports the following listeners.
Supports the following events:
* `renderlet` - This listener function will be invoked after transitions after redraw and render. Replaces the
deprecated [renderlet](#BaseMixin+renderlet) method.
* `pretransition` - Like `.on('renderlet', ...)` but the event is fired before transitions start.
* `preRender` - This listener function will be invoked before chart rendering.
* `postRender` - This listener function will be invoked after chart finish rendering including
all renderlets' logic.
* `preRedraw` - This listener function will be invoked before chart redrawing.
* `postRedraw` - This listener function will be invoked after chart finish redrawing
including all renderlets' logic.
* `filtered` - This listener function will be invoked after a filter is applied, added or removed.
* `zoomed` - This listener function will be invoked after a zoom is triggered.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  
**See**: [d3.dispatch.on](https://github.com/d3/d3-dispatch/blob/master/README.md#dispatch_on)  

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
<a name="BaseMixin+renderlet"></a>

### ~~baseMixin.renderlet(renderletFunction) ⇒ [<code>BaseMixin</code>](#BaseMixin)~~
***Deprecated***

A renderlet is similar to an event listener on rendering event. Multiple renderlets can be added
to an individual chart.  Each time a chart is rerendered or redrawn the renderlets are invoked
right after the chart finishes its transitions, giving you a way to modify the SVGElements.
Renderlet functions take the chart instance as the only input parameter and you can
use the dc API or use raw d3 to achieve pretty much any effect.

Use [on](#BaseMixin+on) with a 'renderlet' prefix.
Generates a random key for the renderlet, which makes it hard to remove.

**Kind**: instance method of [<code>BaseMixin</code>](#BaseMixin)  

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
<a name="ColorMixin"></a>

## ColorMixin ⇒ [<code>ColorMixin</code>](#ColorMixin)
The Color Mixin is an abstract chart functional class providing universal coloring support
as a mix-in for any concrete chart implementation.

**Kind**: global mixin  

| Param | Type |
| --- | --- |
| Base | <code>Object</code> | 


* [ColorMixin](#ColorMixin) ⇒ [<code>ColorMixin</code>](#ColorMixin)
    * [.getColor(d, [i])](#ColorMixin+getColor) ⇒ <code>String</code>
    * [.calculateColorDomain()](#ColorMixin+calculateColorDomain) ⇒ [<code>ColorMixin</code>](#ColorMixin)
    * [.colors([colorScale])](#ColorMixin+colors) ⇒ <code>d3.scale</code> \| [<code>ColorMixin</code>](#ColorMixin)
    * [.ordinalColors(r)](#ColorMixin+ordinalColors) ⇒ [<code>ColorMixin</code>](#ColorMixin)
    * [.linearColors(r)](#ColorMixin+linearColors) ⇒ [<code>ColorMixin</code>](#ColorMixin)
    * [.colorAccessor([colorAccessor])](#ColorMixin+colorAccessor) ⇒ <code>function</code> \| [<code>ColorMixin</code>](#ColorMixin)
    * [.colorDomain([domain])](#ColorMixin+colorDomain) ⇒ <code>Array.&lt;String&gt;</code> \| [<code>ColorMixin</code>](#ColorMixin)
    * [.colorCalculator([colorCalculator])](#ColorMixin+colorCalculator) ⇒ <code>function</code> \| [<code>ColorMixin</code>](#ColorMixin)

<a name="ColorMixin+getColor"></a>

### colorMixin.getColor(d, [i]) ⇒ <code>String</code>
Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.

**Kind**: instance method of [<code>ColorMixin</code>](#ColorMixin)  

| Param | Type |
| --- | --- |
| d | <code>\*</code> | 
| [i] | <code>Number</code> | 

<a name="ColorMixin+calculateColorDomain"></a>

### colorMixin.calculateColorDomain() ⇒ [<code>ColorMixin</code>](#ColorMixin)
Set the domain by determining the min and max values as retrieved by
[.colorAccessor](#ColorMixin+colorAccessor) over the chart's dataset.

**Kind**: instance method of [<code>ColorMixin</code>](#ColorMixin)  
<a name="ColorMixin+colors"></a>

### colorMixin.colors([colorScale]) ⇒ <code>d3.scale</code> \| [<code>ColorMixin</code>](#ColorMixin)
Retrieve current color scale or set a new color scale. This methods accepts any function that
operates like a d3 scale.

**Kind**: instance method of [<code>ColorMixin</code>](#ColorMixin)  
**See**: [d3.scale](https://github.com/d3/d3-scale/blob/master/README.md)  

| Param | Type | Default |
| --- | --- | --- |
| [colorScale] | <code>d3.scale</code> | <code>d3.scaleOrdinal(d3.schemeCategory20c)</code> | 

**Example**  
```js
// alternate categorical scale
chart.colors(d3.scale.category20b());
// ordinal scale
chart.colors(d3.scaleOrdinal().range(['red','green','blue']));
// convenience method, the same as above
chart.ordinalColors(['red','green','blue']);
// set a linear scale
chart.linearColors(["#4575b4", "#ffffbf", "#a50026"]);
```
<a name="ColorMixin+ordinalColors"></a>

### colorMixin.ordinalColors(r) ⇒ [<code>ColorMixin</code>](#ColorMixin)
Convenience method to set the color scale to
[d3.scaleOrdinal](https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales) with
range `r`.

**Kind**: instance method of [<code>ColorMixin</code>](#ColorMixin)  

| Param | Type |
| --- | --- |
| r | <code>Array.&lt;String&gt;</code> | 

<a name="ColorMixin+linearColors"></a>

### colorMixin.linearColors(r) ⇒ [<code>ColorMixin</code>](#ColorMixin)
Convenience method to set the color scale to an Hcl interpolated linear scale with range `r`.

**Kind**: instance method of [<code>ColorMixin</code>](#ColorMixin)  

| Param | Type |
| --- | --- |
| r | <code>Array.&lt;Number&gt;</code> | 

<a name="ColorMixin+colorAccessor"></a>

### colorMixin.colorAccessor([colorAccessor]) ⇒ <code>function</code> \| [<code>ColorMixin</code>](#ColorMixin)
Set or the get color accessor function. This function will be used to map a data point in a
crossfilter group to a color value on the color scale. The default function uses the key
accessor.

**Kind**: instance method of [<code>ColorMixin</code>](#ColorMixin)  

| Param | Type |
| --- | --- |
| [colorAccessor] | <code>function</code> | 

**Example**  
```js
// default index based color accessor
.colorAccessor(function (d, i){return i;})
// color accessor for a multi-value crossfilter reduction
.colorAccessor(function (d){return d.value.absGain;})
```
<a name="ColorMixin+colorDomain"></a>

### colorMixin.colorDomain([domain]) ⇒ <code>Array.&lt;String&gt;</code> \| [<code>ColorMixin</code>](#ColorMixin)
Set or get the current domain for the color mapping function. The domain must be supplied as an
array.

Note: previously this method accepted a callback function. Instead you may use a custom scale
set by [.colors](#ColorMixin+colors).

**Kind**: instance method of [<code>ColorMixin</code>](#ColorMixin)  

| Param | Type |
| --- | --- |
| [domain] | <code>Array.&lt;String&gt;</code> | 

<a name="ColorMixin+colorCalculator"></a>

### colorMixin.colorCalculator([colorCalculator]) ⇒ <code>function</code> \| [<code>ColorMixin</code>](#ColorMixin)
Overrides the color selection algorithm, replacing it with a simple function.

Normally colors will be determined by calling the `colorAccessor` to get a value, and then passing that
value through the `colorScale`.

But sometimes it is difficult to get a color scale to produce the desired effect. The `colorCalculator`
takes the datum and index and returns a color directly.

**Kind**: instance method of [<code>ColorMixin</code>](#ColorMixin)  

| Param | Type |
| --- | --- |
| [colorCalculator] | <code>\*</code> | 

<a name="BubbleMixin"></a>

## BubbleMixin ⇒ [<code>BubbleMixin</code>](#BubbleMixin)
This Mixin provides reusable functionalities for any chart that needs to visualize data using bubbles.

**Kind**: global mixin  
**Mixes**: [<code>ColorMixin</code>](#ColorMixin)  

| Param | Type |
| --- | --- |
| Base | <code>Object</code> | 


* [BubbleMixin](#BubbleMixin) ⇒ [<code>BubbleMixin</code>](#BubbleMixin)
    * [.r([bubbleRadiusScale])](#BubbleMixin+r) ⇒ <code>d3.scale</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
    * [.elasticRadius([elasticRadius])](#BubbleMixin+elasticRadius) ⇒ <code>Boolean</code> \| [<code>BubbleChart</code>](#BubbleChart)
    * [.radiusValueAccessor([radiusValueAccessor])](#BubbleMixin+radiusValueAccessor) ⇒ <code>function</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
    * [.minRadius([radius])](#BubbleMixin+minRadius) ⇒ <code>Number</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
    * [.minRadiusWithLabel([radius])](#BubbleMixin+minRadiusWithLabel) ⇒ <code>Number</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
    * [.maxBubbleRelativeSize([relativeSize])](#BubbleMixin+maxBubbleRelativeSize) ⇒ <code>Number</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
    * [.excludeElasticZero([excludeZero])](#BubbleMixin+excludeElasticZero) ⇒ <code>Boolean</code> \| [<code>BubbleMixin</code>](#BubbleMixin)

<a name="BubbleMixin+r"></a>

### bubbleMixin.r([bubbleRadiusScale]) ⇒ <code>d3.scale</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
Get or set the bubble radius scale. By default the bubble chart uses
[d3.scaleLinear().domain([0, 100])](https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear)
as its radius scale.

**Kind**: instance method of [<code>BubbleMixin</code>](#BubbleMixin)  
**See**: [d3.scale](https://github.com/d3/d3-scale/blob/master/README.md)  

| Param | Type | Default |
| --- | --- | --- |
| [bubbleRadiusScale] | <code>d3.scale</code> | <code>d3.scaleLinear().domain([0, 100])</code> | 

<a name="BubbleMixin+elasticRadius"></a>

### bubbleMixin.elasticRadius([elasticRadius]) ⇒ <code>Boolean</code> \| [<code>BubbleChart</code>](#BubbleChart)
Turn on or off the elastic bubble radius feature, or return the value of the flag. If this
feature is turned on, then bubble radii will be automatically rescaled to fit the chart better.

**Kind**: instance method of [<code>BubbleMixin</code>](#BubbleMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [elasticRadius] | <code>Boolean</code> | <code>false</code> | 

<a name="BubbleMixin+radiusValueAccessor"></a>

### bubbleMixin.radiusValueAccessor([radiusValueAccessor]) ⇒ <code>function</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
Get or set the radius value accessor function. If set, the radius value accessor function will
be used to retrieve a data value for each bubble. The data retrieved then will be mapped using
the r scale to the actual bubble radius. This allows you to encode a data dimension using bubble
size.

**Kind**: instance method of [<code>BubbleMixin</code>](#BubbleMixin)  

| Param | Type |
| --- | --- |
| [radiusValueAccessor] | <code>function</code> | 

<a name="BubbleMixin+minRadius"></a>

### bubbleMixin.minRadius([radius]) ⇒ <code>Number</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
Get or set the minimum radius. This will be used to initialize the radius scale's range.

**Kind**: instance method of [<code>BubbleMixin</code>](#BubbleMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [radius] | <code>Number</code> | <code>10</code> | 

<a name="BubbleMixin+minRadiusWithLabel"></a>

### bubbleMixin.minRadiusWithLabel([radius]) ⇒ <code>Number</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
Get or set the minimum radius for label rendering. If a bubble's radius is less than this value
then no label will be rendered.

**Kind**: instance method of [<code>BubbleMixin</code>](#BubbleMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [radius] | <code>Number</code> | <code>10</code> | 

<a name="BubbleMixin+maxBubbleRelativeSize"></a>

### bubbleMixin.maxBubbleRelativeSize([relativeSize]) ⇒ <code>Number</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
Get or set the maximum relative size of a bubble to the length of x axis. This value is useful
when the difference in radius between bubbles is too great.

**Kind**: instance method of [<code>BubbleMixin</code>](#BubbleMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [relativeSize] | <code>Number</code> | <code>0.3</code> | 

<a name="BubbleMixin+excludeElasticZero"></a>

### bubbleMixin.excludeElasticZero([excludeZero]) ⇒ <code>Boolean</code> \| [<code>BubbleMixin</code>](#BubbleMixin)
Should the chart exclude zero when calculating elastic bubble radius?

**Kind**: instance method of [<code>BubbleMixin</code>](#BubbleMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [excludeZero] | <code>Boolean</code> | <code>true</code> | 

<a name="CapMixin"></a>

## CapMixin ⇒ [<code>CapMixin</code>](#CapMixin)
Cap is a mixin that groups small data elements below a _cap_ into an *others* grouping for both the
Row and Pie Charts.

The top ordered elements in the group up to the cap amount will be kept in the chart, and the rest
will be replaced with an *others* element, with value equal to the sum of the replaced values. The
keys of the elements below the cap limit are recorded in order to filter by those keys when the
others* element is clicked.

**Kind**: global mixin  

| Param | Type |
| --- | --- |
| Base | <code>Object</code> | 


* [CapMixin](#CapMixin) ⇒ [<code>CapMixin</code>](#CapMixin)
    * [.cap([count])](#CapMixin+cap) ⇒ <code>Number</code> \| [<code>CapMixin</code>](#CapMixin)
    * [.takeFront([takeFront])](#CapMixin+takeFront) ⇒ <code>Boolean</code> \| [<code>CapMixin</code>](#CapMixin)
    * [.othersLabel([label])](#CapMixin+othersLabel) ⇒ <code>String</code> \| [<code>CapMixin</code>](#CapMixin)
    * [.othersGrouper([grouperFunction])](#CapMixin+othersGrouper) ⇒ <code>function</code> \| [<code>CapMixin</code>](#CapMixin)

<a name="CapMixin+cap"></a>

### capMixin.cap([count]) ⇒ <code>Number</code> \| [<code>CapMixin</code>](#CapMixin)
Get or set the count of elements to that will be included in the cap. If there is an
[othersGrouper](#CapMixin+othersGrouper), any further elements will be combined in an
extra element with its name determined by [othersLabel](#CapMixin+othersLabel).

As of dc.js 2.1 and onward, the capped charts use
[group.all()](https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_all)
and [BaseMixin.ordering()](#BaseMixin+ordering) to determine the order of
elements. Then `cap` and [takeFront](#CapMixin+takeFront) determine how many elements
to keep, from which end of the resulting array.

**Migration note:** Up through dc.js 2.0.*, capping used
[group.top(N)](https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_top),
which selects the largest items according to
[group.order()](https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_order).
The chart then sorted the items according to [baseMixin.ordering()](#BaseMixin+ordering).
So the two values essentially had to agree, but if the `group.order()` was incorrect (it's
easy to forget about), the wrong rows or slices would be displayed, in the correct order.

If your chart previously relied on `group.order()`, use `chart.ordering()` instead. As of
2.1.5, the ordering defaults to sorting from greatest to least like `group.top(N)` did.

If you want to cap by one ordering but sort by another, you can still do this by
specifying your own [`.data()`](#BaseMixin+data) callback. For details, see the example
[Cap and Sort Differently](https://dc-js.github.io/dc.js/examples/cap-and-sort-differently.html).

**Kind**: instance method of [<code>CapMixin</code>](#CapMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [count] | <code>Number</code> | <code>Infinity</code> | 

<a name="CapMixin+takeFront"></a>

### capMixin.takeFront([takeFront]) ⇒ <code>Boolean</code> \| [<code>CapMixin</code>](#CapMixin)
Get or set the direction of capping. If set, the chart takes the first
[cap](#CapMixin+cap) elements from the sorted array of elements; otherwise
it takes the last `cap` elements.

**Kind**: instance method of [<code>CapMixin</code>](#CapMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [takeFront] | <code>Boolean</code> | <code>true</code> | 

<a name="CapMixin+othersLabel"></a>

### capMixin.othersLabel([label]) ⇒ <code>String</code> \| [<code>CapMixin</code>](#CapMixin)
Get or set the label for *Others* slice when slices cap is specified.

**Kind**: instance method of [<code>CapMixin</code>](#CapMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [label] | <code>String</code> | <code>&quot;Others&quot;</code> | 

<a name="CapMixin+othersGrouper"></a>

### capMixin.othersGrouper([grouperFunction]) ⇒ <code>function</code> \| [<code>CapMixin</code>](#CapMixin)
Get or set the grouper function that will perform the insertion of data for the *Others* slice
if the slices cap is specified. If set to a falsy value, no others will be added.

The grouper function takes an array of included ("top") items, and an array of the rest of
the items. By default the grouper function computes the sum of the rest.

**Kind**: instance method of [<code>CapMixin</code>](#CapMixin)  

| Param | Type |
| --- | --- |
| [grouperFunction] | <code>function</code> | 

**Example**  
```js
// Do not show others
chart.othersGrouper(null);
// Default others grouper
chart.othersGrouper(function (topItems, restItems) {
    var restItemsSum = d3.sum(restItems, _chart.valueAccessor()),
        restKeys = restItems.map(_chart.keyAccessor());
    if (restItemsSum > 0) {
        return topItems.concat([{
            others: restKeys,
            key: _chart.othersLabel(),
            value: restItemsSum
        }]);
    }
    return topItems;
});
```
<a name="MarginMixin"></a>

## MarginMixin ⇒ [<code>MarginMixin</code>](#MarginMixin)
Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
Charts.

**Kind**: global mixin  

| Param | Type |
| --- | --- |
| Base | <code>Object</code> | 


* [MarginMixin](#MarginMixin) ⇒ [<code>MarginMixin</code>](#MarginMixin)
    * [.margins([margins])](#MarginMixin+margins) ⇒ <code>Object</code> \| [<code>MarginMixin</code>](#MarginMixin)
    * [.effectiveWidth()](#MarginMixin+effectiveWidth) ⇒ <code>number</code>
    * [.effectiveHeight()](#MarginMixin+effectiveHeight) ⇒ <code>number</code>

<a name="MarginMixin+margins"></a>

### marginMixin.margins([margins]) ⇒ <code>Object</code> \| [<code>MarginMixin</code>](#MarginMixin)
Get or set the margins for a particular coordinate grid chart instance. The margins is stored as
an associative Javascript array.

**Kind**: instance method of [<code>MarginMixin</code>](#MarginMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [margins] | <code>Object</code> | <code>{top: 10, right: 50, bottom: 30, left: 30}</code> | 

**Example**  
```js
var leftMargin = chart.margins().left; // 30 by default
chart.margins().left = 50;
leftMargin = chart.margins().left; // now 50
```
<a name="MarginMixin+effectiveWidth"></a>

### marginMixin.effectiveWidth() ⇒ <code>number</code>
Effective width of the chart excluding margins (in pixels).

**Kind**: instance method of [<code>MarginMixin</code>](#MarginMixin)  
<a name="MarginMixin+effectiveHeight"></a>

### marginMixin.effectiveHeight() ⇒ <code>number</code>
Effective height of the chart excluding margins (in pixels).

**Kind**: instance method of [<code>MarginMixin</code>](#MarginMixin)  
<a name="CoordinateGridMixin"></a>

## CoordinateGridMixin
Coordinate Grid is an abstract base chart designed to support a number of coordinate grid based
concrete chart types, e.g. bar chart, line chart, and bubble chart.

**Kind**: global mixin  
**Mixes**: [<code>ColorMixin</code>](#ColorMixin), [<code>MarginMixin</code>](#MarginMixin)  

* [CoordinateGridMixin](#CoordinateGridMixin)
    * [.rescale()](#CoordinateGridMixin+rescale) ⇒ [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.rangeChart([rangeChart])](#CoordinateGridMixin+rangeChart) ⇒ [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.zoomScale([extent])](#CoordinateGridMixin+zoomScale) ⇒ <code>Array.&lt;(Number\|Date)&gt;</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.zoomOutRestrict([zoomOutRestrict])](#CoordinateGridMixin+zoomOutRestrict) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.g([gElement])](#CoordinateGridMixin+g) ⇒ <code>SVGElement</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.mouseZoomable([mouseZoomable])](#CoordinateGridMixin+mouseZoomable) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.chartBodyG([chartBodyG])](#CoordinateGridMixin+chartBodyG) ⇒ <code>SVGElement</code>
    * [.x([xScale])](#CoordinateGridMixin+x) ⇒ <code>d3.scale</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.xUnits([xUnits])](#CoordinateGridMixin+xUnits) ⇒ <code>function</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.xAxis([xAxis])](#CoordinateGridMixin+xAxis) ⇒ <code>d3.axis</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.elasticX([elasticX])](#CoordinateGridMixin+elasticX) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.xAxisPadding([padding])](#CoordinateGridMixin+xAxisPadding) ⇒ <code>Number</code> \| <code>String</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.xAxisPaddingUnit([unit])](#CoordinateGridMixin+xAxisPaddingUnit) ⇒ <code>String</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.xUnitCount()](#CoordinateGridMixin+xUnitCount) ⇒ <code>Number</code>
    * [.useRightYAxis([useRightYAxis])](#CoordinateGridMixin+useRightYAxis) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.useTopXAxis([useTopXAxis])](#CoordinateGridMixin+useTopXAxis) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.isOrdinal()](#CoordinateGridMixin+isOrdinal) ⇒ <code>Boolean</code>
    * [.xAxisLabel([labelText], [padding])](#CoordinateGridMixin+xAxisLabel) ⇒ <code>String</code>
    * [.yAxisLabel([labelText], [padding])](#CoordinateGridMixin+yAxisLabel) ⇒ <code>String</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.y([yScale])](#CoordinateGridMixin+y) ⇒ <code>d3.scale</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.yAxis([yAxis])](#CoordinateGridMixin+yAxis) ⇒ <code>d3.axisLeft</code> \| <code>d3.axisRight</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.elasticY([elasticY])](#CoordinateGridMixin+elasticY) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.renderHorizontalGridLines([renderHorizontalGridLines])](#CoordinateGridMixin+renderHorizontalGridLines) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.renderVerticalGridLines([renderVerticalGridLines])](#CoordinateGridMixin+renderVerticalGridLines) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.xAxisMin()](#CoordinateGridMixin+xAxisMin) ⇒ <code>\*</code>
    * [.xAxisMax()](#CoordinateGridMixin+xAxisMax) ⇒ <code>\*</code>
    * [.yAxisMin()](#CoordinateGridMixin+yAxisMin) ⇒ <code>\*</code>
    * [.yAxisMax()](#CoordinateGridMixin+yAxisMax) ⇒ <code>\*</code>
    * [.yAxisPadding([padding])](#CoordinateGridMixin+yAxisPadding) ⇒ <code>Number</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.round([round])](#CoordinateGridMixin+round) ⇒ <code>function</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.brush([_])](#CoordinateGridMixin+brush) ⇒ <code>d3.brush</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.clipPadding([padding])](#CoordinateGridMixin+clipPadding) ⇒ <code>Number</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.focus([range], [noRaiseEvents])](#CoordinateGridMixin+focus) ⇒ <code>undefined</code>
    * [.brushOn([brushOn])](#CoordinateGridMixin+brushOn) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
    * [.parentBrushOn([brushOn])](#CoordinateGridMixin+parentBrushOn) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)

<a name="CoordinateGridMixin+rescale"></a>

### coordinateGridMixin.rescale() ⇒ [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
When changing the domain of the x or y scale, it is necessary to tell the chart to recalculate
and redraw the axes. (`.rescale()` is called automatically when the x or y scale is replaced
with [.x()](CoordinateGridMixin+x) or [.y()](#CoordinateGridMixin+y), and has
no effect on elastic scales.)

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
<a name="CoordinateGridMixin+rangeChart"></a>

### coordinateGridMixin.rangeChart([rangeChart]) ⇒ [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Get or set the range selection chart associated with this instance. Setting the range selection
chart using this function will automatically update its selection brush when the current chart
zooms in. In return the given range chart will also automatically attach this chart as its focus
chart hence zoom in when range brush updates.

Usually the range and focus charts will share a dimension. The range chart will set the zoom
boundaries for the focus chart, so its dimension values must be compatible with the domain of
the focus chart.

See the [Nasdaq 100 Index](http://dc-js.github.com/dc.js/) example for this effect in action.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type |
| --- | --- |
| [rangeChart] | [<code>CoordinateGridMixin</code>](#CoordinateGridMixin) | 

<a name="CoordinateGridMixin+zoomScale"></a>

### coordinateGridMixin.zoomScale([extent]) ⇒ <code>Array.&lt;(Number\|Date)&gt;</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Get or set the scale extent for mouse zooms.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [extent] | <code>Array.&lt;(Number\|Date)&gt;</code> | <code>[1, Infinity]</code> | 

<a name="CoordinateGridMixin+zoomOutRestrict"></a>

### coordinateGridMixin.zoomOutRestrict([zoomOutRestrict]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Get or set the zoom restriction for the chart. If true limits the zoom to origional domain of the chart.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [zoomOutRestrict] | <code>Boolean</code> | <code>true</code> | 

<a name="CoordinateGridMixin+g"></a>

### coordinateGridMixin.g([gElement]) ⇒ <code>SVGElement</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Get or set the root g element. This method is usually used to retrieve the g element in order to
overlay custom svg drawing programatically. **Caution**: The root g element is usually generated
by dc.js internals, and resetting it might produce unpredictable result.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type |
| --- | --- |
| [gElement] | <code>SVGElement</code> | 

<a name="CoordinateGridMixin+mouseZoomable"></a>

### coordinateGridMixin.mouseZoomable([mouseZoomable]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Set or get mouse zoom capability flag (default: false). When turned on the chart will be
zoomable using the mouse wheel. If the range selector chart is attached zooming will also update
the range selection brush on the associated range selector chart.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [mouseZoomable] | <code>Boolean</code> | <code>false</code> | 

<a name="CoordinateGridMixin+chartBodyG"></a>

### coordinateGridMixin.chartBodyG([chartBodyG]) ⇒ <code>SVGElement</code>
Retrieve the svg group for the chart body.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type |
| --- | --- |
| [chartBodyG] | <code>SVGElement</code> | 

<a name="CoordinateGridMixin+x"></a>

### coordinateGridMixin.x([xScale]) ⇒ <code>d3.scale</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
**mandatory**

Get or set the x scale. The x scale can be any d3
[d3.scale](https://github.com/d3/d3-scale/blob/master/README.md) or
[ordinal scale](https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales)

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
**See**: [d3.scale](https://github.com/d3/d3-scale/blob/master/README.md)  

| Param | Type |
| --- | --- |
| [xScale] | <code>d3.scale</code> | 

**Example**  
```js
// set x to a linear scale
chart.x(d3.scaleLinear().domain([-2500, 2500]))
// set x to a time scale to generate histogram
chart.x(d3.scaleTime().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
```
<a name="CoordinateGridMixin+xUnits"></a>

### coordinateGridMixin.xUnits([xUnits]) ⇒ <code>function</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Set or get the xUnits function. The coordinate grid chart uses the xUnits function to calculate
the number of data projections on the x axis such as the number of bars for a bar chart or the
number of dots for a line chart.

This function is expected to return a Javascript array of all data points on the x axis, or
the number of points on the axis. d3 time range functions [d3.timeDays, d3.timeMonths, and
d3.timeYears](https://github.com/d3/d3-time/blob/master/README.md#intervals) are all valid
xUnits functions.

dc.js also provides a few units function, see the [Units Namespace](#units) for
a list of built-in units functions.

Note that as of dc.js 3.0, `units.ordinal` is not a real function, because it is not
possible to define this function compliant with the d3 range functions. It was already a
magic value which caused charts to behave differently, and now it is completely so.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [xUnits] | <code>function</code> | <code>units.integers</code> | 

**Example**  
```js
// set x units to count days
chart.xUnits(d3.timeDays);
// set x units to count months
chart.xUnits(d3.timeMonths);

// A custom xUnits function can be used as long as it follows the following interface:
// units in integer
function(start, end) {
     // simply calculates how many integers in the domain
     return Math.abs(end - start);
}

// fixed units
function(start, end) {
     // be aware using fixed units will disable the focus/zoom ability on the chart
     return 1000;
}
```
<a name="CoordinateGridMixin+xAxis"></a>

### coordinateGridMixin.xAxis([xAxis]) ⇒ <code>d3.axis</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Set or get the x axis used by a particular coordinate grid chart instance. This function is most
useful when x axis customization is required. The x axis in dc.js is an instance of a
[d3 bottom axis object](https://github.com/d3/d3-axis/blob/master/README.md#axisBottom);
therefore it supports any valid d3 axisBottom manipulation.

**Caution**: The x axis is usually generated internally by dc; resetting it may cause
unexpected results. Note also that when used as a getter, this function is not chainable:
it returns the axis, not the chart,
[so attempting to call chart functions after calling `.xAxis()` will fail](https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis).

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
**See**: [d3.axisBottom](https://github.com/d3/d3-axis/blob/master/README.md#axisBottom)  

| Param | Type | Default |
| --- | --- | --- |
| [xAxis] | <code>d3.axis</code> | <code>d3.axisBottom()</code> | 

**Example**  
```js
// customize x axis tick format
chart.xAxis().tickFormat(function(v) {return v + '%';});
// customize x axis tick values
chart.xAxis().tickValues([0, 100, 200, 300]);
```
<a name="CoordinateGridMixin+elasticX"></a>

### coordinateGridMixin.elasticX([elasticX]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Turn on/off elastic x axis behavior. If x axis elasticity is turned on, then the grid chart will
attempt to recalculate the x axis range whenever a redraw event is triggered.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [elasticX] | <code>Boolean</code> | <code>false</code> | 

<a name="CoordinateGridMixin+xAxisPadding"></a>

### coordinateGridMixin.xAxisPadding([padding]) ⇒ <code>Number</code> \| <code>String</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Set or get x axis padding for the elastic x axis. The padding will be added to both end of the x
axis if elasticX is turned on; otherwise it is ignored.

Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
number or date x axes.  When padding a date axis, an integer represents number of units being padded
and a percentage string will be treated the same as an integer. The unit will be determined by the
xAxisPaddingUnit variable.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> \| <code>String</code> | <code>0</code> | 

<a name="CoordinateGridMixin+xAxisPaddingUnit"></a>

### coordinateGridMixin.xAxisPaddingUnit([unit]) ⇒ <code>String</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Set or get x axis padding unit for the elastic x axis. The padding unit will determine which unit to
use when applying xAxis padding if elasticX is turned on and if x-axis uses a time dimension;
otherwise it is ignored.

The padding unit should be a
[d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#self._interval).
For backward compatibility with dc.js 2.0, it can also be the name of a d3 time interval
('day', 'hour', etc). Available arguments are the
[d3 time intervals](https://github.com/d3/d3-time/blob/master/README.md#intervals d3.timeInterval).

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [unit] | <code>String</code> | <code>d3.timeDay</code> | 

<a name="CoordinateGridMixin+xUnitCount"></a>

### coordinateGridMixin.xUnitCount() ⇒ <code>Number</code>
Returns the number of units displayed on the x axis. If the x axis is ordinal (`xUnits` is
`units.ordinal`), this is the number of items in the domain of the x scale. Otherwise, the
x unit count is calculated using the [xUnits](#CoordinateGridMixin+xUnits) function.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
<a name="CoordinateGridMixin+useRightYAxis"></a>

### coordinateGridMixin.useRightYAxis([useRightYAxis]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Gets or sets whether the chart should be drawn with a right axis instead of a left axis. When
used with a chart in a composite chart, allows both left and right Y axes to be shown on a
chart.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [useRightYAxis] | <code>Boolean</code> | <code>false</code> | 

<a name="CoordinateGridMixin+useTopXAxis"></a>

### coordinateGridMixin.useTopXAxis([useTopXAxis]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Gets or sets whether the chart should be drawn with a top axis instead of a bottom axis. When
used with a chart in a composite chart, allows both top and bottom X axes to be shown on a
chart.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [useTopXAxis] | <code>Boolean</code> | <code>false</code> | 

<a name="CoordinateGridMixin+isOrdinal"></a>

### coordinateGridMixin.isOrdinal() ⇒ <code>Boolean</code>
Returns true if the chart is using ordinal xUnits ([ordinal](#units.ordinal), or false
otherwise. Most charts behave differently with ordinal data and use the result of this method to
trigger the appropriate logic.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
<a name="CoordinateGridMixin+xAxisLabel"></a>

### coordinateGridMixin.xAxisLabel([labelText], [padding]) ⇒ <code>String</code>
Set or get the x axis label. If setting the label, you may optionally include additional padding to
the margin to make room for the label. By default the padded is set to 12 to accomodate the text height.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [labelText] | <code>String</code> |  | 
| [padding] | <code>Number</code> | <code>12</code> | 

<a name="CoordinateGridMixin+yAxisLabel"></a>

### coordinateGridMixin.yAxisLabel([labelText], [padding]) ⇒ <code>String</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Set or get the y axis label. If setting the label, you may optionally include additional padding
to the margin to make room for the label. By default the padding is set to 12 to accommodate the
text height.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [labelText] | <code>String</code> |  | 
| [padding] | <code>Number</code> | <code>12</code> | 

<a name="CoordinateGridMixin+y"></a>

### coordinateGridMixin.y([yScale]) ⇒ <code>d3.scale</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Get or set the y scale. The y scale is typically automatically determined by the chart implementation.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
**See**: [d3.scale](https://github.com/d3/d3-scale/blob/master/README.md)  

| Param | Type |
| --- | --- |
| [yScale] | <code>d3.scale</code> | 

<a name="CoordinateGridMixin+yAxis"></a>

### coordinateGridMixin.yAxis([yAxis]) ⇒ <code>d3.axisLeft</code> \| <code>d3.axisRight</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Set or get the y axis used by the coordinate grid chart instance. This function is most useful
when y axis customization is required. Depending on `useRightYAxis` the y axis in dc.js is an instance of
either [d3.axisLeft](https://github.com/d3/d3-axis/blob/master/README.md#axisLeft) or
[d3.axisRight](https://github.com/d3/d3-axis/blob/master/README.md#axisRight); therefore it supports any
valid d3 axis manipulation.

**Caution**: The y axis is usually generated internally by dc; resetting it may cause
unexpected results.  Note also that when used as a getter, this function is not chainable: it
returns the axis, not the chart,
[so attempting to call chart functions after calling `.yAxis()` will fail](https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis).
In addition, depending on whether you are going to use the axis on left or right
you need to appropriately pass [d3.axisLeft](https://github.com/d3/d3-axis/blob/master/README.md#axisLeft)
or [d3.axisRight](https://github.com/d3/d3-axis/blob/master/README.md#axisRight)

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
**See**: [d3.axis](https://github.com/d3/d3-axis/blob/master/README.md)  

| Param | Type |
| --- | --- |
| [yAxis] | <code>d3.axisLeft</code> \| <code>d3.axisRight</code> | 

**Example**  
```js
// customize y axis tick format
chart.yAxis().tickFormat(function(v) {return v + '%';});
// customize y axis tick values
chart.yAxis().tickValues([0, 100, 200, 300]);
```
<a name="CoordinateGridMixin+elasticY"></a>

### coordinateGridMixin.elasticY([elasticY]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Turn on/off elastic y axis behavior. If y axis elasticity is turned on, then the grid chart will
attempt to recalculate the y axis range whenever a redraw event is triggered.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [elasticY] | <code>Boolean</code> | <code>false</code> | 

<a name="CoordinateGridMixin+renderHorizontalGridLines"></a>

### coordinateGridMixin.renderHorizontalGridLines([renderHorizontalGridLines]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Turn on/off horizontal grid lines.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [renderHorizontalGridLines] | <code>Boolean</code> | <code>false</code> | 

<a name="CoordinateGridMixin+renderVerticalGridLines"></a>

### coordinateGridMixin.renderVerticalGridLines([renderVerticalGridLines]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Turn on/off vertical grid lines.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [renderVerticalGridLines] | <code>Boolean</code> | <code>false</code> | 

<a name="CoordinateGridMixin+xAxisMin"></a>

### coordinateGridMixin.xAxisMin() ⇒ <code>\*</code>
Calculates the minimum x value to display in the chart. Includes xAxisPadding if set.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
<a name="CoordinateGridMixin+xAxisMax"></a>

### coordinateGridMixin.xAxisMax() ⇒ <code>\*</code>
Calculates the maximum x value to display in the chart. Includes xAxisPadding if set.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
<a name="CoordinateGridMixin+yAxisMin"></a>

### coordinateGridMixin.yAxisMin() ⇒ <code>\*</code>
Calculates the minimum y value to display in the chart. Includes yAxisPadding if set.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
<a name="CoordinateGridMixin+yAxisMax"></a>

### coordinateGridMixin.yAxisMax() ⇒ <code>\*</code>
Calculates the maximum y value to display in the chart. Includes yAxisPadding if set.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
<a name="CoordinateGridMixin+yAxisPadding"></a>

### coordinateGridMixin.yAxisPadding([padding]) ⇒ <code>Number</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Set or get y axis padding for the elastic y axis. The padding will be added to the top and
bottom of the y axis if elasticY is turned on; otherwise it is ignored.

Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
number or date axes. When padding a date axis, an integer represents number of days being padded
and a percentage string will be treated the same as an integer.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> \| <code>String</code> | <code>0</code> | 

<a name="CoordinateGridMixin+round"></a>

### coordinateGridMixin.round([round]) ⇒ <code>function</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Set or get the rounding function used to quantize the selection when brushing is enabled.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type |
| --- | --- |
| [round] | <code>function</code> | 

**Example**  
```js
// set x unit round to by month, this will make sure range selection brush will
// select whole months
chart.round(d3.timeMonth.round);
```
<a name="CoordinateGridMixin+brush"></a>

### coordinateGridMixin.brush([_]) ⇒ <code>d3.brush</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Get or set the brush. Brush must be an instance of d3 brushes
https://github.com/d3/d3-brush/blob/master/README.md
You will use this only if you are writing a new chart type that supports brushing.

**Caution**: dc creates and manages brushes internally. Go through and understand the source code
if you want to pass a new brush object. Even if you are only using the getter,
the brush object may not behave the way you expect.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type |
| --- | --- |
| [_] | <code>d3.brush</code> | 

<a name="CoordinateGridMixin+clipPadding"></a>

### coordinateGridMixin.clipPadding([padding]) ⇒ <code>Number</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Get or set the padding in pixels for the clip path. Once set padding will be applied evenly to
the top, left, right, and bottom when the clip path is generated. If set to zero, the clip area
will be exactly the chart body area minus the margins.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>Number</code> | <code>5</code> | 

<a name="CoordinateGridMixin+focus"></a>

### coordinateGridMixin.focus([range], [noRaiseEvents]) ⇒ <code>undefined</code>
Zoom this chart to focus on the given range. The given range should be an array containing only
2 elements (`[start, end]`) defining a range in the x domain. If the range is not given or set
to null, then the zoom will be reset. _For focus to work elasticX has to be turned off;
otherwise focus will be ignored.

To avoid ping-pong volley of events between a pair of range and focus charts please set
`noRaiseEvents` to `true`. In that case it will update this chart but will not fire `zoom` event
and not try to update back the associated range chart.
If you are calling it manually - typically you will leave it to `false` (the default).

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [range] | <code>Array.&lt;Number&gt;</code> |  | 
| [noRaiseEvents] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
chart.on('renderlet', function(chart) {
    // smooth the rendering through event throttling
    events.trigger(function(){
         // focus some other chart to the range selected by user on this chart
         someOtherChart.focus(chart.filter());
    });
})
```
<a name="CoordinateGridMixin+brushOn"></a>

### coordinateGridMixin.brushOn([brushOn]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
Turn on/off the brush-based range filter. When brushing is on then user can drag the mouse
across a chart with a quantitative scale to perform range filtering based on the extent of the
brush, or click on the bars of an ordinal bar chart or slices of a pie chart to filter and
un-filter them. However turning on the brush filter will disable other interactive elements on
the chart such as highlighting, tool tips, and reference lines. Zooming will still be possible
if enabled, but only via scrolling (panning will be disabled.)

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [brushOn] | <code>Boolean</code> | <code>true</code> | 

<a name="CoordinateGridMixin+parentBrushOn"></a>

### coordinateGridMixin.parentBrushOn([brushOn]) ⇒ <code>Boolean</code> \| [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)
This will be internally used by composite chart onto children. Please go not invoke directly.

**Kind**: instance method of [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  
**Access**: protected  

| Param | Type | Default |
| --- | --- | --- |
| [brushOn] | <code>Boolean</code> | <code>false</code> | 

<a name="StackMixin"></a>

## StackMixin
Stack Mixin is an mixin that provides cross-chart support of stackability using d3.stack.

**Kind**: global mixin  
**Mixes**: [<code>CoordinateGridMixin</code>](#CoordinateGridMixin)  

* [StackMixin](#StackMixin)
    * [.stack(group, [name], [accessor])](#StackMixin+stack) ⇒ <code>Array.&lt;{group: crossfilter.group, name: String, accessor: function()}&gt;</code> \| [<code>StackMixin</code>](#StackMixin)
    * [.hidableStacks([hidableStacks])](#StackMixin+hidableStacks) ⇒ <code>Boolean</code> \| [<code>StackMixin</code>](#StackMixin)
    * [.hideStack(stackName)](#StackMixin+hideStack) ⇒ [<code>StackMixin</code>](#StackMixin)
    * [.showStack(stackName)](#StackMixin+showStack) ⇒ [<code>StackMixin</code>](#StackMixin)
    * [.title([stackName], [titleAccessor])](#StackMixin+title) ⇒ <code>String</code> \| [<code>StackMixin</code>](#StackMixin)
    * [.stackLayout([_stack])](#StackMixin+stackLayout) ⇒ <code>function</code> \| [<code>StackMixin</code>](#StackMixin)
    * [.evadeDomainFilter([evadeDomainFilter])](#StackMixin+evadeDomainFilter) ⇒ <code>Boolean</code> \| [<code>StackMixin</code>](#StackMixin)

<a name="StackMixin+stack"></a>

### stackMixin.stack(group, [name], [accessor]) ⇒ <code>Array.&lt;{group: crossfilter.group, name: String, accessor: function()}&gt;</code> \| [<code>StackMixin</code>](#StackMixin)
Stack a new crossfilter group onto this chart with an optional custom value accessor. All stacks
in the same chart will share the same key accessor and therefore the same set of keys.

For example, in a stacked bar chart, the bars of each stack will be positioned using the same set
of keys on the x axis, while stacked vertically. If name is specified then it will be used to
generate the legend label.

**Kind**: instance method of [<code>StackMixin</code>](#StackMixin)  
**See**: [crossfilter.group](https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce)  

| Param | Type |
| --- | --- |
| group | <code>crossfilter.group</code> | 
| [name] | <code>String</code> | 
| [accessor] | <code>function</code> | 

**Example**  
```js
// stack group using default accessor
chart.stack(valueSumGroup)
// stack group using custom accessor
.stack(avgByDayGroup, function(d){return d.value.avgByDay;});
```
<a name="StackMixin+hidableStacks"></a>

### stackMixin.hidableStacks([hidableStacks]) ⇒ <code>Boolean</code> \| [<code>StackMixin</code>](#StackMixin)
Allow named stacks to be hidden or shown by clicking on legend items.
This does not affect the behavior of hideStack or showStack.

**Kind**: instance method of [<code>StackMixin</code>](#StackMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [hidableStacks] | <code>Boolean</code> | <code>false</code> | 

<a name="StackMixin+hideStack"></a>

### stackMixin.hideStack(stackName) ⇒ [<code>StackMixin</code>](#StackMixin)
Hide all stacks on the chart with the given name.
The chart must be re-rendered for this change to appear.

**Kind**: instance method of [<code>StackMixin</code>](#StackMixin)  

| Param | Type |
| --- | --- |
| stackName | <code>String</code> | 

<a name="StackMixin+showStack"></a>

### stackMixin.showStack(stackName) ⇒ [<code>StackMixin</code>](#StackMixin)
Show all stacks on the chart with the given name.
The chart must be re-rendered for this change to appear.

**Kind**: instance method of [<code>StackMixin</code>](#StackMixin)  

| Param | Type |
| --- | --- |
| stackName | <code>String</code> | 

<a name="StackMixin+title"></a>

### stackMixin.title([stackName], [titleAccessor]) ⇒ <code>String</code> \| [<code>StackMixin</code>](#StackMixin)
Set or get the title function. Chart class will use this function to render svg title (usually interpreted by
browser as tooltips) for each child element in the chart, i.e. a slice in a pie chart or a bubble in a bubble chart.
Almost every chart supports title function however in grid coordinate chart you need to turn off brush in order to
use title otherwise the brush layer will block tooltip trigger.

If the first argument is a stack name, the title function will get or set the title for that stack. If stackName
is not provided, the first stack is implied.

**Kind**: instance method of [<code>StackMixin</code>](#StackMixin)  

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
<a name="StackMixin+stackLayout"></a>

### stackMixin.stackLayout([_stack]) ⇒ <code>function</code> \| [<code>StackMixin</code>](#StackMixin)
Gets or sets the stack layout algorithm, which computes a baseline for each stack and
propagates it to the next.

**Kind**: instance method of [<code>StackMixin</code>](#StackMixin)  
**See**: [d3.stackD3v3](https://github.com/d3/d3-3.x-api-reference/blob/master/Stack-Layout.md)  

| Param | Type | Default |
| --- | --- | --- |
| [_stack] | <code>function</code> | <code>d3.stackD3v3</code> | 

<a name="StackMixin+evadeDomainFilter"></a>

### stackMixin.evadeDomainFilter([evadeDomainFilter]) ⇒ <code>Boolean</code> \| [<code>StackMixin</code>](#StackMixin)
Since dc.js 2.0, there has been [an issue](https://github.com/dc-js/dc.js/issues/949)
where points are filtered to the current domain. While this is a useful optimization, it is
incorrectly implemented: the next point outside the domain is required in order to draw lines
that are clipped to the bounds, as well as bars that are partly clipped.

A fix will be included in dc.js 2.1.x, but a workaround is needed for dc.js 2.0 and until
that fix is published, so set this flag to skip any filtering of points.

Once the bug is fixed, this flag will have no effect, and it will be deprecated.

**Kind**: instance method of [<code>StackMixin</code>](#StackMixin)  

| Param | Type | Default |
| --- | --- | --- |
| [evadeDomainFilter] | <code>Boolean</code> | <code>false</code> | 

<a name="filters"></a>

## filters : <code>object</code>
The dc.js filters are functions which are passed into crossfilter to chose which records will be
accumulated to produce values for the charts.  In the crossfilter model, any filters applied on one
dimension will affect all the other dimensions but not that one.  dc always applies a filter
function to the dimension; the function combines multiple filters and if any of them accept a
record, it is filtered in.

These filter constructors are used as appropriate by the various charts to implement brushing.  We
mention below which chart uses which filter.  In some cases, many instances of a filter will be added.

Each of the dc.js filters is an object with the following properties:
* `isFiltered` - a function that returns true if a value is within the filter
* `filterType` - a string identifying the filter, here the name of the constructor

Currently these filter objects are also arrays, but this is not a requirement. Custom filters
can be used as long as they have the properties above.

**Kind**: global namespace  

* [filters](#filters) : <code>object</code>
    * [.RangedFilter](#filters.RangedFilter)
        * [new RangedFilter(low, high)](#new_filters.RangedFilter_new)
    * [.TwoDimensionalFilter](#filters.TwoDimensionalFilter)
        * [new TwoDimensionalFilter(filter)](#new_filters.TwoDimensionalFilter_new)
    * [.RangedTwoDimensionalFilter](#filters.RangedTwoDimensionalFilter)
        * [new RangedTwoDimensionalFilter(filter)](#new_filters.RangedTwoDimensionalFilter_new)
    * [.HierarchyFilter](#filters.HierarchyFilter)
        * [new HierarchyFilter(path)](#new_filters.HierarchyFilter_new)

<a name="filters.RangedFilter"></a>

### filters.RangedFilter
**Kind**: static class of [<code>filters</code>](#filters)  
<a name="new_filters.RangedFilter_new"></a>

#### new RangedFilter(low, high)
RangedFilter is a filter which accepts keys between `low` and `high`.  It is used to implement X
axis brushing for the [coordinate grid charts](#CoordinateGridMixin).

Its `filterType` is 'RangedFilter'


| Param | Type |
| --- | --- |
| low | <code>Number</code> | 
| high | <code>Number</code> | 

<a name="filters.TwoDimensionalFilter"></a>

### filters.TwoDimensionalFilter
**Kind**: static class of [<code>filters</code>](#filters)  
<a name="new_filters.TwoDimensionalFilter_new"></a>

#### new TwoDimensionalFilter(filter)
TwoDimensionalFilter is a filter which accepts a single two-dimensional value.  It is used by the
[heat map chart](#HeatMap) to include particular cells as they are clicked.  (Rows and columns are
filtered by filtering all the cells in the row or column.)

Its `filterType` is 'TwoDimensionalFilter'


| Param | Type |
| --- | --- |
| filter | <code>Array.&lt;Number&gt;</code> | 

<a name="filters.RangedTwoDimensionalFilter"></a>

### filters.RangedTwoDimensionalFilter
**Kind**: static class of [<code>filters</code>](#filters)  
<a name="new_filters.RangedTwoDimensionalFilter_new"></a>

#### new RangedTwoDimensionalFilter(filter)
The RangedTwoDimensionalFilter allows filtering all values which fit within a rectangular
region. It is used by the [scatter plot](#ScatterPlot) to implement rectangular brushing.

It takes two two-dimensional points in the form `[[x1,y1],[x2,y2]]`, and normalizes them so that
`x1 <= x2` and `y1 <= y2`. It then returns a filter which accepts any points which are in the
rectangular range including the lower values but excluding the higher values.

If an array of two values are given to the RangedTwoDimensionalFilter, it interprets the values as
two x coordinates `x1` and `x2` and returns a filter which accepts any points for which `x1 <= x <
x2`.

Its `filterType` is 'RangedTwoDimensionalFilter'


| Param | Type |
| --- | --- |
| filter | <code>Array.&lt;Array.&lt;Number&gt;&gt;</code> | 

<a name="filters.HierarchyFilter"></a>

### filters.HierarchyFilter
**Kind**: static class of [<code>filters</code>](#filters)  
<a name="new_filters.HierarchyFilter_new"></a>

#### new HierarchyFilter(path)
HierarchyFilter is a filter which accepts a key path as an array. It matches any node at, or
child of, the given path. It is used by the [sunburst chart](#SunburstChart) to include particular cells and all
their children as they are clicked.


| Param | Type |
| --- | --- |
| path | <code>String</code> | 

<a name="utils"></a>

## utils : <code>object</code>
**Kind**: global namespace  

* [utils](#utils) : <code>object</code>
    * [.printSingleValue(filter)](#utils.printSingleValue) ⇒ <code>String</code>
    * [.add(l, r, [t])](#utils.add) ⇒ <code>Date</code> \| <code>Number</code>
    * [.subtract(l, r, [t])](#utils.subtract) ⇒ <code>Date</code> \| <code>Number</code>
    * [.isNumber(n)](#utils.isNumber) ⇒ <code>Boolean</code>
    * [.isFloat(n)](#utils.isFloat) ⇒ <code>Boolean</code>
    * [.isInteger(n)](#utils.isInteger) ⇒ <code>Boolean</code>
    * [.isNegligible(n)](#utils.isNegligible) ⇒ <code>Boolean</code>
    * [.clamp(val, min, max)](#utils.clamp) ⇒ <code>any</code>
    * [.constant(x)](#utils.constant) ⇒ <code>function</code>
    * [.uniqueId()](#utils.uniqueId) ⇒ <code>Number</code>
    * [.nameToId(name)](#utils.nameToId) ⇒ <code>String</code>
    * [.appendOrSelect(parent, selector, tag)](#utils.appendOrSelect) ⇒ <code>d3.selection</code>
    * [.safeNumber(n)](#utils.safeNumber) ⇒ <code>Number</code>
    * [.arraysEqual(a1, a2)](#utils.arraysEqual) ⇒ <code>Boolean</code>

<a name="utils.printSingleValue"></a>

### utils.printSingleValue(filter) ⇒ <code>String</code>
Print a single value filter.

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| filter | <code>any</code> | 

<a name="utils.add"></a>

### utils.add(l, r, [t]) ⇒ <code>Date</code> \| <code>Number</code>
Arbitrary add one value to another.

If the value l is of type Date, adds r units to it. t becomes the unit.
For example utils.add(dt, 3, 'week') will add 3 (r = 3) weeks (t= 'week') to dt.

If l is of type numeric, t is ignored. In this case if r is of type string,
it is assumed to be percentage (whether or not it includes %). For example
utils.add(30, 10) will give 40 and utils.add(30, '10') will give 33.

They also generate strange results if l is a string.

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| l | <code>Date</code> \| <code>Number</code> |  | the value to modify |
| r | <code>String</code> \| <code>Number</code> |  | the amount by which to modify the value |
| [t] | <code>function</code> \| <code>String</code> | <code>d3.timeDay</code> | if `l` is a `Date`, then this should be a [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#_interval). For backward compatibility with dc.js 2.0, it can also be the name of an interval, i.e. 'millis', 'second', 'minute', 'hour', 'day', 'week', 'month', or 'year' |

<a name="utils.subtract"></a>

### utils.subtract(l, r, [t]) ⇒ <code>Date</code> \| <code>Number</code>
Arbitrary subtract one value from another.

If the value l is of type Date, subtracts r units from it. t becomes the unit.
For example utils.subtract(dt, 3, 'week') will subtract 3 (r = 3) weeks (t= 'week') from dt.

If l is of type numeric, t is ignored. In this case if r is of type string,
it is assumed to be percentage (whether or not it includes %). For example
utils.subtract(30, 10) will give 20 and utils.subtract(30, '10') will give 27.

They also generate strange results if l is a string.

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| l | <code>Date</code> \| <code>Number</code> |  | the value to modify |
| r | <code>String</code> \| <code>Number</code> |  | the amount by which to modify the value |
| [t] | <code>function</code> \| <code>String</code> | <code>d3.timeDay</code> | if `l` is a `Date`, then this should be a [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#_interval). For backward compatibility with dc.js 2.0, it can also be the name of an interval, i.e. 'millis', 'second', 'minute', 'hour', 'day', 'week', 'month', or 'year' |

<a name="utils.isNumber"></a>

### utils.isNumber(n) ⇒ <code>Boolean</code>
Is the value a number?

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| n | <code>any</code> | 

<a name="utils.isFloat"></a>

### utils.isFloat(n) ⇒ <code>Boolean</code>
Is the value a float?

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| n | <code>any</code> | 

<a name="utils.isInteger"></a>

### utils.isInteger(n) ⇒ <code>Boolean</code>
Is the value an integer?

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| n | <code>any</code> | 

<a name="utils.isNegligible"></a>

### utils.isNegligible(n) ⇒ <code>Boolean</code>
Is the value very close to zero?

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| n | <code>any</code> | 

<a name="utils.clamp"></a>

### utils.clamp(val, min, max) ⇒ <code>any</code>
Ensure the value is no greater or less than the min/max values.  If it is return the boundary value.

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| val | <code>any</code> | 
| min | <code>any</code> | 
| max | <code>any</code> | 

<a name="utils.constant"></a>

### utils.constant(x) ⇒ <code>function</code>
Given `x`, return a function that always returns `x`.

[`d3.functor` was removed in d3 version 4](https://github.com/d3/d3/blob/master/CHANGES.md#internals).
This function helps to implement the replacement,
`typeof x === "function" ? x : utils.constant(x)`

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| x | <code>any</code> | 

<a name="utils.uniqueId"></a>

### utils.uniqueId() ⇒ <code>Number</code>
Using a simple static counter, provide a unique integer id.

**Kind**: static method of [<code>utils</code>](#utils)  
<a name="utils.nameToId"></a>

### utils.nameToId(name) ⇒ <code>String</code>
Convert a name to an ID.

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="utils.appendOrSelect"></a>

### utils.appendOrSelect(parent, selector, tag) ⇒ <code>d3.selection</code>
Append or select an item on a parent element.

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| parent | <code>d3.selection</code> | 
| selector | <code>String</code> | 
| tag | <code>String</code> | 

<a name="utils.safeNumber"></a>

### utils.safeNumber(n) ⇒ <code>Number</code>
Return the number if the value is a number; else 0.

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| n | <code>Number</code> \| <code>any</code> | 

<a name="utils.arraysEqual"></a>

### utils.arraysEqual(a1, a2) ⇒ <code>Boolean</code>
Return true if both arrays are equal, if both array are null these are considered equal

**Kind**: static method of [<code>utils</code>](#utils)  

| Param | Type |
| --- | --- |
| a1 | <code>Array</code> \| <code>null</code> | 
| a2 | <code>Array</code> \| <code>null</code> | 

<a name="printers"></a>

## printers : <code>object</code>
**Kind**: global namespace  

* [printers](#printers) : <code>object</code>
    * [.filters(filters)](#printers.filters) ⇒ <code>String</code>
    * [.filter(filter)](#printers.filter) ⇒ <code>String</code>

<a name="printers.filters"></a>

### printers.filters(filters) ⇒ <code>String</code>
Converts a list of filters into a readable string.

**Kind**: static method of [<code>printers</code>](#printers)  

| Param | Type |
| --- | --- |
| filters | [<code>Array.&lt;filters&gt;</code>](#filters) | 

<a name="printers.filter"></a>

### printers.filter(filter) ⇒ <code>String</code>
Converts a filter into a readable string.

**Kind**: static method of [<code>printers</code>](#printers)  

| Param | Type |
| --- | --- |
| filter | [<code>filters</code>](#filters) \| <code>any</code> \| <code>Array.&lt;any&gt;</code> | 

<a name="units"></a>

## units : <code>object</code>
**Kind**: global namespace  

* [units](#units) : <code>object</code>
    * [.fp](#units.fp) : <code>object</code>
        * [.precision(precision)](#units.fp.precision) ⇒ <code>function</code>
    * [.integers(start, end)](#units.integers) ⇒ <code>Number</code>
    * [.ordinal()](#units.ordinal) ⇒ <code>uncallable</code>

<a name="units.fp"></a>

### units.fp : <code>object</code>
**Kind**: static namespace of [<code>units</code>](#units)  
<a name="units.fp.precision"></a>

#### fp.precision(precision) ⇒ <code>function</code>
This function generates an argument for the [Coordinate Grid Chart](#CoordinateGridMixin)
[.xUnits](#CoordinateGridMixin+xUnits) function specifying that the x values are floating-point
numbers with the given precision.
The returned function determines how many values at the given precision will fit into the range
supplied in its start and end parameters.

**Kind**: static method of [<code>fp</code>](#units.fp)  
**Returns**: <code>function</code> - start-end unit function  
**See**: [coordinateGridMixin.xUnits](#CoordinateGridMixin+xUnits)  

| Param | Type |
| --- | --- |
| precision | <code>Number</code> | 

**Example**  
```js
// specify values (and ticks) every 0.1 units
chart.xUnits(units.fp.precision(0.1)
// there are 500 units between 0.5 and 1 if the precision is 0.001
var thousandths = units.fp.precision(0.001);
thousandths(0.5, 1.0) // returns 500
```
<a name="units.integers"></a>

### units.integers(start, end) ⇒ <code>Number</code>
The default value for [.xUnits](#CoordinateGridMixin+xUnits) for the
[Coordinate Grid Chart](#CoordinateGridMixin) and should
be used when the x values are a sequence of integers.
It is a function that counts the number of integers in the range supplied in its start and end parameters.

**Kind**: static method of [<code>units</code>](#units)  
**See**: [coordinateGridMixin.xUnits](#CoordinateGridMixin+xUnits)  

| Param | Type |
| --- | --- |
| start | <code>Number</code> | 
| end | <code>Number</code> | 

**Example**  
```js
chart.xUnits(units.integers) // already the default
```
<a name="units.ordinal"></a>

### units.ordinal() ⇒ <code>uncallable</code>
This argument can be passed to the [.xUnits](#CoordinateGridMixin+xUnits) function of a
coordinate grid chart to specify ordinal units for the x axis. Usually this parameter is used in
combination with passing
[d3.scaleOrdinal](https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales)
to [.x](#CoordinateGridMixin+x).

As of dc.js 3.0, this is purely a placeholder or magic value which causes the chart to go into ordinal mode; the
function is not called.

**Kind**: static method of [<code>units</code>](#units)  
**See**

- [d3.scaleOrdinal](https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales)
- [coordinateGridMixin.xUnits](#CoordinateGridMixin+xUnits)
- [coordinateGridMixin.x](#CoordinateGridMixin+x)

**Example**  
```js
chart.xUnits(units.ordinal)
     .x(d3.scaleOrdinal())
```
<a name="registerChart"></a>

## registerChart(chart, [group]) ⇒ <code>undefined</code>
Add given chart instance to the given group, creating the group if necessary.
If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| chart | <code>Object</code> | dc.js chart instance |
| [group] | <code>String</code> | Group name |

<a name="deregisterChart"></a>

## deregisterChart(chart, [group]) ⇒ <code>undefined</code>
Remove given chart instance from the given group, creating the group if necessary.
If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| chart | <code>Object</code> | dc.js chart instance |
| [group] | <code>String</code> | Group name |

<a name="hasChart"></a>

## hasChart(chart) ⇒ <code>Boolean</code>
Determine if a given chart instance resides in any group in the registry.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| chart | <code>Object</code> | dc.js chart instance |

<a name="deregisterAllCharts"></a>

## deregisterAllCharts(group) ⇒ <code>undefined</code>
Clear given group if one is provided, otherwise clears all groups.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>String</code> | Group name |

<a name="filterAll"></a>

## filterAll([group]) ⇒ <code>undefined</code>
Clear all filters on all charts within the given chart group. If the chart group is not given then
only charts that belong to the default chart group will be reset.

**Kind**: global function  

| Param | Type |
| --- | --- |
| [group] | <code>String</code> | 

<a name="refocusAll"></a>

## refocusAll([group]) ⇒ <code>undefined</code>
Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
not given then only charts that belong to the default chart group will be reset.

**Kind**: global function  

| Param | Type |
| --- | --- |
| [group] | <code>String</code> | 

<a name="renderAll"></a>

## renderAll([group]) ⇒ <code>undefined</code>
Re-render all charts belong to the given chart group. If the chart group is not given then only
charts that belong to the default chart group will be re-rendered.

**Kind**: global function  

| Param | Type |
| --- | --- |
| [group] | <code>String</code> | 

<a name="redrawAll"></a>

## redrawAll([group]) ⇒ <code>undefined</code>
Redraw all charts belong to the given chart group. If the chart group is not given then only charts
that belong to the default chart group will be re-drawn. Redraw is different from re-render since
when redrawing dc tries to update the graphic incrementally, using transitions, instead of starting
from scratch.

**Kind**: global function  

| Param | Type |
| --- | --- |
| [group] | <code>String</code> | 

<a name="transition"></a>

## transition(selection, [duration], [delay], [name]) ⇒ <code>d3.transition</code> \| <code>d3.selection</code>
Start a transition on a selection if transitions are globally enabled
([disableTransitions](disableTransitions) is false) and the duration is greater than zero; otherwise return
the selection. Since most operations are the same on a d3 selection and a d3 transition, this
allows a common code path for both cases.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selection | <code>d3.selection</code> |  | the selection to be transitioned |
| [duration] | <code>Number</code> \| <code>function</code> | <code>250</code> | the duration of the transition in milliseconds, a function returning the duration, or 0 for no transition |
| [delay] | <code>Number</code> \| <code>function</code> |  | the delay of the transition in milliseconds, or a function returning the delay, or 0 for no delay |
| [name] | <code>String</code> |  | the name of the transition (if concurrent transitions on the same elements are needed) |

<a name="pluck"></a>

## pluck(n, [f]) ⇒ <code>function</code>
Returns a function that given a string property name, can be used to pluck the property off an object.  A function
can be passed as the second argument to also alter the data being returned.

This can be a useful shorthand method to create accessor functions.

**Kind**: global function  

| Param | Type |
| --- | --- |
| n | <code>String</code> | 
| [f] | <code>function</code> | 

**Example**  
```js
var xPluck = pluck('x');
var objA = {x: 1};
xPluck(objA) // 1
```
**Example**  
```js
var xPosition = pluck('x', function (x, i) {
    // `this` is the original datum,
    // `x` is the x property of the datum,
    // `i` is the position in the array
    return this.radius + x;
});
selectAll('.circle').data(...).x(xPosition);
```
