## 4.2.7
* Remove lax `d3compat.eventHandler` workarounds, not necessary if code consistently uses d3@5 or d3@6 event handler signatures
* Remove extra `d3compat.eventHandler` identified with strict event handler
* Fix event handling in focus ordinal bar example ([#1826](https://github.com/dc-js/dc.js/issues/1826))
* Change composite bar line example to illustrate using `xAxisPadding` with `centerBar` to draw compoisite bar/line properly ([#1827](https://github.com/dc-js/dc.js/issues/1827))

## 4.2.6
* Isolate D3 compatibility layers, allowing more efficient module imports, by Patrik Kullman ([#1822](https://github.com/dc-js/dc.js/issues/1822) / [#1823](https://github.com/dc-js/dc.js/issues/1823) / [#1824](https://github.com/dc-js/dc.js/issues/1824))

## 4.2.5
* Option [useTopXAxis](https://dc-js.github.io/dc.js/docs/html/CoordinateGridMixin.html#useTopXAxis) to show coordinate grid X axis at top of chart, by BERÉNYI Attila ([#1815](https://github.com/dc-js/dc.js/issues/1815) / [#1816](https://github.com/dc-js/dc.js/pull/1816))
* Add source for bar colors example ([#1817](https://github.com/dc-js/dc.js/issues/1817))

## 4.2.4
* Fix use of `d3.mouse` removed in d3@6, by Deepak Kumar ([#1807](https://github.com/dc-js/dc.js/issues/1807) / [#1808](https://github.com/dc-js/dc.js/pull/1808))
* Simpler example of ordinal brushing, by Deepak Kumar ([#1809](https://github.com/dc-js/dc.js/pull/1809))

## 4.2.3
* Fix undefined this on SeriesChart redraw, by Maxime Rouyrre ([#1800](https://github.com/dc-js/dc.js/pull/1800))
* Export d3 compat functions allowing it to be used to simplify d3@6 compatibility in examples.
  Fixes [#1787](https://github.com/dc-js/dc.js/issues/1787).

## 4.2.2
* Add [linked filter example](https://dc-js.github.io/dc.js/examples/linked-filter.html), had been floating around as a jsfiddle answer to [SO question](https://stackoverflow.com/questions/59461538/dc-js-how-to-mirror-brush-across-multiple-charts) for a while.

## 4.2.1
* Text filter widget should redraw chart's group - thanks @kriddy! ([#1678](https://github.com/dc-js/dc.js/pull/1678) / [#14978](https://github.com/dc-js/dc.js/issues/14978))
* Pareto chart example was not correctly sorted, and scatter series chart displayed brush when zoomed ([#1780](https://github.com/dc-js/dc.js/pull/1780) / [#1772](https://github.com/dc-js/dc.js/issues/1772))

## 4.2.0
* Accessibility features <a href="http://dc-js.github.io/dc.js/docs/html/BaseMixin.html#svgDescription">BaseMixin.svgDescription</a> and <a href="http://dc-js.github.io/dc.js/docs/html/BaseMixin.html#keyboardAccessible">BaseMixin.keyboardAccessible</a>, by German Priks. <a href="http://dc-js.github.io/dc.js/examples/filtering.html">Demo here</a>. ([#1738](https://github.com/dc-js/dc.js/pull/1738) / [#1185](https://github.com/dc-js/dc.js/issues/1185))

## 4.1.1
* The [brush ordinal example](https://dc-js.github.io/dc.js/examples/brush-ordinal.html) did not filter correctly when row chart was clicked ([#1770](https://github.com/dc-js/dc.js/issues/1770))
* Some examples were broken by the move to d3@6 ([#1769](https://github.com/dc-js/dc.js/issues/1769))

## 4.1.0
* Compatible with dc@6 while preserving compatibility with dc@5, by Deepak Kumar ([#1749](https://github.com/dc-js/dc.js/pull/1749) / [#1748](https://github.com/dc-js/dc.js/issues/1748))

## 4.0.5
* Remove accidental references to global `d3`, `dc` in sources (discussion [here](https://github.com/dc-js/dc.js/commit/902736ad4436dbcad1d57badce14a5e485c59d7a#commitcomment-40208686))

## 4.0.4
* Fix ordinal (string) ordering ([#1690](https://github.com/dc-js/dc.js/issues/1690))
* Bubble mixin should exclude zeros when calculating elastic radius; [excludeElasticZero](https://dc-js.github.io/dc.js/docs/html/BubbleMixin.html#excludeElasticZero) can be set false if old behavior is desired ([#1688](https://github.com/dc-js/dc.js/pull/1688))
* Add a simple [linear regression example](http://dc-js.github.io/dc.js/examples/regression.html).
* Add a [horizon chart example](http://dc-js.github.io/dc.js/examples/horizon-chart.html) which shows how to add a custom chart with group data. Rename the old custom chart example which displays a groupAll to [color swatch](http://dc-js.github.io/dc.js/examples/color-swatch.html).

## 4.0.3
* Remove a `filterHandler` special case, and improve the performance of the default filter handler, by Deepak Kumar ([#1660](https://github.com/dc-js/dc.js/pull/1660))
* Merge sunburst rounding error fixes from 3.2.1

## 4.0.2
Fix bugs in previous version

## 4.0.1
Merges sunburst charts from 3.2.0

## 4.0.0
* Thanks to the diligent and careful effort of Deepak Kumar, dc.js has been ported to ES6 modules, classes and syntax.

IE is no longer supported. dc.js will not support transpilation. Stick with dc@3 for IE support.

The API is mostly compatible, but there are a few breaking changes - see the [v4 upgrade guide](https://github.com/dc-js/dc.js/blob/develop/docs/dc-v4-upgrade-guide.md) for details.

## 3.2.1
* Fix rounding issue with equal ring sizes, by hofmeister ([#1662](https://github.com/dc-js/dc.js/pull/1662) /  ([#1661](https://github.com/dc-js/dc.js/issues/1661))


## 3.2.0
* Support for general customizable ring sizes on the sunburst chart, by hofmeister ([#1625](https://github.com/dc-js/dc.js/pull/1655) /  ([#1511](https://github.com/dc-js/dc.js/issues/1511))
* Sort sunburst wedges according to `baseMixin.ordering()`, by hofmeister ([#1625](https://github.com/dc-js/dc.js/pull/1655) /  ([#1511](https://github.com/dc-js/dc.js/issues/1511))

## 3.1.9
* `highlightSelected` implemented for SVG legend, by Tahirhan Yıldızoğlu  ([#1625](https://github.com/dc-js/dc.js/pull/1625) /  ([#600](https://github.com/dc-js/dc.js/issues/600))
* [Pareto chart example](http://dc-js.github.io/dc.js/examples/pareto-chart.html)

## 3.1.8
Special **Goodbye IE** Edition! dc.js 4.0 will remove support for Internet Explorer, as it has been translated into ES6 by Deepak Kumar. For one last trip down memory lane, here are some IE patches.
* Do not use `Array.from()` yet in base mixin
* Use polyfills and don't use ES6 in examples. All examples work in IE11 except where IE is too slow or its CSS too weird to both with.
* Fully tested with crossfilter 1.4.8, the last crossfilter to support IE

## 3.1.7
* Updating `bower.json` to D3v5, with apologies for [#1458](https://github.com/dc-js/dc.js/issues/1458). Bower support will be dropped in dc.js version 4.0 - please specify dc version `3.x` if you are using bower

## 3.1.6
* allow resizing of canvas-based scatter plots ([#1596](https://github.com/dc-js/dc.js/issues/1596))

## 3.1.5
* Composite chart properties should pass through regardless of when compose is called, by Keith Dahlby. ([#1365](https://github.com/dc-js/dc.js/pull/1365) / [#554](https://github.com/dc-js/dc.js/issues/554) / [#611](https://github.com/dc-js/dc.js/issues/611) / [#1003](https://github.com/dc-js/dc.js/issues/1003))

## 3.1.4
* Example of [drawing a contour map as a background](http://dc-js.github.io/dc.js/examples/background-drawing.html), by Sven Hertling
* Example of [capping and sorting by different criteria](https://dc-js.github.io/dc.js/examples/cap-and-sort-differently.html) ([#1474](https://github.com/dc-js/dc.js/issues/1474)

## 3.1.3
* Canvas-based scatter plot, by Sudeep Mandal ([#1361](https://github.com/dc-js/dc.js/pull/1361))
* Better use of data in scatter example
* Missing inheritance link in class hierarchy diagram

## 3.1.2
* Stop using [crossfilter.quicksort.by](https://github.com/crossfilter/crossfilter/wiki/API-Reference#quicksort_by) and use [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) instead, by Deepak Kumar. Crossfilter is now just a `devDependency`. ([#1560](https://github.com/dc-js/dc.js/pull/1560) /  ([#1559](https://github.com/dc-js/dc.js/issues/1559))
* Example of [updating data in a range-focus chart](http://dc-js.github.io/dc.js/examples/focus-dynamic-data.html).

## 3.1.1
* Update [replacing data](https://dc-js.github.io/dc.js/examples/replacing-data.html) and [series](https://dc-js.github.io/dc.js/examples/series.html) examples with the robust way to replace data as of crossfilter 1.4 ([#1536](https://github.com/dc-js/dc.js/issues/1536))
* The [focus ordinal bar example](https://dc-js.github.io/dc.js/examples/focus-ordinal-bar.html) demonstrates scrolling through a wide bar chart using a range chart.
* The [brush ordinal example](https://dc-js.github.io/dc.js/examples/brush-ordinal.html) demonstrates using a range brush on ordinal data, by transforming the data to a linear scale.
* Remove leftover debugging logs, thanks Adrián de la Rosa! ([#1534](https://github.com/dc-js/dc.js/pull/1534))

## 3.1.0
* Remove `float: left` from dc.css; add it to individual examples where needed.

It's not appropriate to set this in the library, because charts will be used in all sorts of different layouts, and this sometimes required people to use `div.dc-chart { float: none!important; }` which is horrible. ([#673](https://github.com/dc-js/dc.js/issues/673))

Fixing this will break a lot of dashboard layouts, thus the version bump. Add

```css
div.dc-chart {
    float: left;
}
```
to your page CSS to restore the old layout!
* Fix mixed content loading, by Rohan Shewale ([#1529](https://github.com/dc-js/dc.js/pull/1529))
* Update all dependencies and move to eslint, to eliminate npm security audit complaints

## 3.0.13
* Keep track of individual values efficiently in boxplot examples ([#543](https://github.com/dc-js/dc.js/issues/543))
* Series progression [example](https://dc-js.github.io/dc.js/transitions/series-progression.html)

## 3.0.12
* heatmap takes ordinary filter objects and conversion of coordinates is deprecated ([#1515](https://github.com/dc-js/dc.js/issues/1515))
* [Example](http://dc-js.github.io/dc.js/examples/compare-unfiltered.html) of comparing the current filters against the unfiltered values [using a fake group to copy original values](https://github.com/dc-js/dc.js/wiki/FAQ#static-copy-of-a-group). Thanks to Jason Aizkalns for the [SO](https://stackoverflow.com/questions/55066391/display-original-conditional-brushed-unbrushed-crossfilter-bars-with-dc-js-wit) and [CodeReview](https://codereview.stackexchange.com/questions/215041/dc-js-and-crossfilter-app-to-display-multiple-charts) questions and the example!
* Provide alternate, more descriptive names for properties so that the meaning is not overloaded, to reduce confusion and improve code clarity:
  * `dataTable.group` and `dataGrid.group` took a nesting function, not a crossfilter group, so they are replaced with a new property called `section`  ([#855](https://github.com/dc-js/dc.js/issues/855)). Additionally, `dataTable.section` is no longer mandatory and defaults to the empty string.
  * `dataCount.dimension` took a crossfilter instance, and `dataCount.group` really took a groupAll object, so they are replaced with properties with those names ([#1499](https://github.com/dc-js/dc.js/issues/1499))
The old property names are still supported, but they emit an informational message recommending the better name. They could be deprecated in the future (but there is probably no need).

## 3.0.11
* Remove the deprecation on `colorMixin.colorCalculator`, and implement it in a reasonable way ([#1493](https://github.com/dc-js/dc.js/issues/1493))

## 3.0.10
This mostly updates examples and tests, and updates compatiblity polyfills for IE.
* Compatible with d3 5.8
* Various test failures across all browsers fixed, due to changes in D3 and browsers
* New [row targets](http://dc-js.github.io/dc.js/examples/row-targets.html) example shows how to superimpose lines on individual row chart items
* [Focus dynamic interval](http://dc-js.github.io/dc.js/examples/focus-dynamic-interval.html) example builds on [switching time intervals](http://dc-js.github.io/dc.js/examples/switching-time-intervals.html) to show how to change the aggregation in response to brushing on a range chart
* Many examples were mistitled
* Removed arrow functions and polyfilled missing functions (eg Fetch) for IE. Note that IE support won't last forever since D3v6 will no longer support it!
* Fixed typo, thanks Rimian Perkins!

## 3.0.9
* Updated Table Pagination example, with filtering, by Sudeep Mandal and Arcuri Davide ([#1492](https://github.com/dc-js/dc.js/pull/1492))
* Fade-in and correct opacity for grid lines, by Lou Moxy ([#1501](https://github.com/dc-js/dc.js/pull/1501) / [#1500](https://github.com/dc-js/dc.js/issues/1500))
* Thanks to Rohan Shewale for a doc typo fix

## 3.0.8
* Sunburst was not centering responsively on redraw, by Frozenlock ([#1491](https://github.com/dc-js/dc.js/pull/1491) / [#1490](https://github.com/dc-js/dc.js/issues/1490))
* Composite chart with no `id` was not clipping its children, by Frozenlock ([#1488](https://github.com/dc-js/dc.js/issues/1488))

## 3.0.7
* Sunburst has animated transitions, by Amelia Ireland ([#1481](https://github.com/dc-js/dc.js/pull/1481))
* Filter printer now prints more than 2 elements, by Amelia Ireland ([#1475](https://github.com/dc-js/dc.js/pull/1475))
* `controlsUseVisibility` was incorrectly documented as defaulting true, by Amelia Ireland ([#1474](https://github.com/dc-js/dc.js/issues/1474))
* Pie charts and row charts should always use `cappedValueAccessor` or custom `valueAccessor` will crash by Alex Campana ([#1335](https://github.com/dc-js/dc.js/pull/1335))
* Title tooltips were not shown on heatmap the first time ([#1482](https://github.com/dc-js/dc.js/issues/1482))
* Simpler, improved method for "bar single select" example, by Leung Chan ([#1477](https://github.com/dc-js/dc.js/pull/1477)

## 3.0.6
* Enable the stroke for line chart dots, making it possible to actually use `strokeOpacity` ([#1449](https://github.com/dc-js/dc.js/pull/1449) / [#1447](https://github.com/dc-js/dc.js/issues/1447))
* Fix an error when horizontal grid lines were drawn on a chart with an ordinal Y scale, by the3ver ([#1448](https://github.com/dc-js/dc.js/pull/1448) / [#539](https://github.com/dc-js/dc.js/issues/539))
* Bubbles were not disappearing when bins were removed from the group, by Brendan Heberton ([#1466](https://github.com/dc-js/dc.js/pull/1466))
* Protect value accessor from `sunburstChart`'s virtual parent nodes, by Deepak Kumar ([#1444](https://github.com/dc-js/dc.js/pull/1444) / [#1440](https://github.com/dc-js/dc.js/issues/1440))

## 3.0.5
* Scatter plot symbols were not getting removed when group changed size, by Deepak Kumar. ([#1463](https://github.com/dc-js/dc.js/pull/1463) / [#1460](https://github.com/dc-js/dc.js/issues/1460))
* Use Chrome and Firefox headless at Travis CI, by Deepak Kumar. See ([#1452](https://github.com/dc-js/dc.js/pull/1452)), an attempt to resolve ([#1451](https://github.com/dc-js/dc.js/pull/1451))

## 3.0.4
* Box plot enhancements: jittered data points, data point tooltips, bold outliers, by Chris Wolcott. Also implements `yRangePadding` to fix problems with not enough/too much space for labels in box plots. ([#1439](https://github.com/dc-js/dc.js/pull/1439) / [#1370](https://github.com/dc-js/dc.js/issues/1370) / [#1120](https://github.com/dc-js/dc.js/issues/1120))
* Code cleanup - replaced `.rangesEqual` with `dc.utils.arraysEqual`, by Deepak Kumar ([#1436](https://github.com/dc-js/dc.js/pull/1436) / [#1405](https://github.com/dc-js/dc.js/issues/1405))
* New tests for range filters with dates, by Deepak Kumar. ([#1437](https://github.com/dc-js/dc.js/pull/1437) / [#1432](https://github.com/dc-js/dc.js/issues/1432))
* Fix readme references to 3.0, by Deepak Kumar. ([#1441](https://github.com/dc-js/dc.js/pull/1441))
* Propagate filters on composite chart to children, by Deepak Kumar ([#1435](https://github.com/dc-js/dc.js/pull/1435)). Fixes remaining parts of ([#390](https://github.com/dc-js/dc.js/issues/390) / [#706](https://github.com/dc-js/dc.js/issues/706)).
* Listen to rangeChart's filtered event with a namespace, by Keith Dahlby ([#1366](https://github.com/dc-js/dc.js/pull/1366))

## 3.0.3
* Update versions and release new fiddles and blocks pegged to dc@3 and d3@5

## 3.0.2
* Allow row chart `.xAxis` to be settable. Since the type of axis can't be detected by the chart, provide [example](https://dc-js.github.io/dc.js/examples/row-top-axis.html) of setting the position of axis and grid lines manually.
* In a composite chart, the brush is only applied on the parent, by Deepak Kumar. This fixes many composite chart brushing issues, but let us know if it broke any of your use cases! ([#1408](https://github.com/dc-js/dc.js/pull/1408) / [#1424](https://github.com/dc-js/dc.js/issues/1424) / [#479](https://github.com/dc-js/dc.js/issues/479) / [#390](https://github.com/dc-js/dc.js/issues/390) / [#706](https://github.com/dc-js/dc.js/issues/706) / [#878](https://github.com/dc-js/dc.js/issues/878))

## 3.0.1
* Test compatibility with D3v4 as well as D3v5, by Deepak Kumar ([#1430](https://github.com/dc-js/dc.js/pull/1430))
* Add new charts/widgets to class hierarchy in documentation

## 3.0.0
* Sunburst chart, by Blair Nilsson, with contributions by Sean Micklethwaite and Deepak Kumar ([#781](https://github.com/dc-js/dc.js/issues/781) / [#907](https://github.com/dc-js/dc.js/pull/907) / [#1337](https://github.com/dc-js/dc.js/pull/1337) /[#1388](https://github.com/dc-js/dc.js/pull/1388))
* Text filter widget, by Xavier Dutoit ([#383](https://github.com/dc-js/dc.js/issues/383) / [#936](https://github.com/dc-js/dc.js/pull/936) / [#1387](https://github.com/dc-js/dc.js/pull/1387))
* Checkbox/radio button filtering, by Amelia Ireland, with contributions by Deepak Kumar ([#1348](https://github.com/dc-js/dc.js/pull/1348) / [#1389](https://github.com/dc-js/dc.js/pull/1389))
* HTML Legend, by David Long and Ramesh Rajagopalon, with contributions by Deepak Kumar ([#1325](https://github.com/dc-js/dc.js/issues/1325) / [#577](https://github.com/dc-js/dc.js/pull/577) / [#1329](https://github.com/dc-js/dc.js/pull/1329) / [#1392](https://github.com/dc-js/dc.js/pull/1392))

## 3.0.0 beta 2
* declare `pkg.main` for compatibility with some bundlers (and hopefully Observable)

## 3.0.0 beta 1
* First NPM release of dc.js, compatible with D3 versions 4 and 5. Thanks to Deepak Kumar for all his effort on the port! We've made every effort to keep the library backward-compatible, but see [the 3.0 changes in the wiki](https://github.com/dc-js/dc.js/wiki/Changes-in-dc.js-version-3.0).
* `fadeDeselectedArea` checks if brushing is enabled for the chart. Restores backward compatibility. By Deepak Kumar. ([#1422](https://github.com/dc-js/dc.js/pull/1422) / [#1401](https://github.com/dc-js/dc.js/issues/1401))
* Rename `selection` --> `brushSelection`. By Deepak Kumar.([#1423](https://github.com/dc-js/dc.js/issues/1423) / [#1398](https://github.com/dc-js/dc.js/issues/1398))

## 3.0.0 alpha 12
* Use `d3.stack` from d3v4+, transforming the data from/to the old layer/stack objects. Remove `d3v3-compat.js` ([#1375](https://github.com/dc-js/dc.js/issues/1375)

## 3.0.0 alpha 11
* xAxisPaddingUnit should be the d3 interval not the name of it ([#1320](https://github.com/dc-js/dc.js/issues/1320), [#1326](https://github.com/dc-js/dc.js/issues/1326), [#1420](https://github.com/dc-js/dc.js/issues/1420))

## 3.0.0 alpha 10
* Streamlined creation of YAxis in coordinate grid charts, by Deepak Kumar ([#1416](https://github.com/dc-js/dc.js/pull/1416))
* Updated XAxis and YAxis documentation, by Deepak Kumar ([#1416](https://github.com/dc-js/dc.js/pull/1416))
* `dc.config.defaultColors` is a mechanism to change default color scheme for all ordinal charts, by Deepak Kumar ([#1409](https://github.com/dc-js/dc.js/pull/1409)).
* deprecate use of default color scheme `d3.schemeCategory20c`, which has been [removed in D3v5](https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50). Provide a temporary copy of the old colors for backward compatibility, but the defaults will change in DCv3.1. By Deepak Kumar ([#1409](https://github.com/dc-js/dc.js/pull/1409)).
* more cleanup from d3v4 refactor, by Deepak Kumar. Warn before converting from `d3.scaleOrdinal` to `d3.scaleBands` ([#1414](https://github.com/dc-js/dc.js/pull/1414), [#1417](https://github.com/dc-js/dc.js/pull/1417), [#1418](https://github.com/dc-js/dc.js/pull/1418))

## 3.0.0 alpha 9
* `numberDisplay` uses [d3.easeQuad](https://github.com/d3/d3-ease/blob/master/README.md#easeQuad) instead of [quad-out-in](https://github.com/d3/d3-3.x-api-reference/blob/master/Transitions.md#d3_ease), which didn't make sense. ([#1413](https://github.com/dc-js/dc.js/pull/1413))
* `dc.units.ordinal` is now purely a placeholder or magic value, and not called as a function. Previously dc.js would call the `xUnits` function with three arguments: the start, end, and domain array, but this was not compliant with d3 range functions. Now these functions are called with only the start and end, and `dc.units.ordinal` is detected with `===`. ([#1410](https://github.com/dc-js/dc.js/pull/1410))
* cleanup from d3v4 refactor, by Deepak Kumar ([#1412](https://github.com/dc-js/dc.js/pull/1412))

## 3.0.0 alpha 8
* don't show brush handles on scatter plot, by Deepak Kumar ([#1407](https://github.com/dc-js/dc.js/pull/1407) / [#1406](https://github.com/dc-js/dc.js/issues/1406))
* remove `d3.functor`. [`d3.functor` was removed in d3 version 4]( https://github.com/d3/d3/blob/master/CHANGES.md#internals); to replace it, use  `typeof x === "function" ? x : dc.utils.constant(x)` ([#1374](https://github.com/dc-js/dc.js/issues/1374))

## 3.0.0 alpha 7
* `elasticY` should look only at points within the X domain, even with `evadeDomainFilter` enabled, by Keith Dahlby ([#1367](https://github.com/dc-js/dc.js/pull/1367))
* fixes to animated resizing of brush when chart resizes, by Deepak Kumar ([#1402](https://github.com/dc-js/dc.js/pull/1402) / [#1376](https://github.com/dc-js/dc.js/issues/1399)

## 3.0.0 alpha 6
* initialize all positions for entering objects, since d3.transition will now start them at zero if you don't ([#1400](https://github.com/dc-js/dc.js/issues/1400))

## 3.0.0 alpha 5
* d3v5 support: all examples upgraded to d3-fetch. `schemeCategory20c` is patched into `d3` temporarily, by Deepak Kumar, but see [#1403](https://github.com/dc-js/dc.js/issues/1403)

## 3.0.0 alpha 4
* switch to Karma for testing across browsers, by Deepak Kumar ([#1393](https://github.com/dc-js/dc.js/pull/1393))

## 3.0.0 alpha 3
* improved integration with `d3.zoom`, by Deepak Kumar. Since the d3v4 implementation is a lot more powerful, this eliminates a lot of custom zoom code. ([#1385](https://github.com/dc-js/dc.js/pull/1385))

## 3.0.0 alpha 2
* backward compatibility for `dc.lineChart.interpolate` and `dc.geoChoroplethChart.projection`, by Deepak Kumar ([#1381](https://github.com/dc-js/dc.js/pull/1381) / [#1376](https://github.com/dc-js/dc.js/issues/1376), [#1382](https://github.com/dc-js/dc.js/pull/1382) / [#1379](https://github.com/dc-js/dc.js/issues/1379))
* Fixed test cases for Edge/IE, by Deepak Kumar ([#1378](https://github.com/dc-js/dc.js/pull/1378) / [#1373](https://github.com/dc-js/dc.js/issues/1373)
* lint ([#1372](https://github.com/dc-js/dc.js/pull/1372))

## 3.0.0 alpha 1
* first pass of d3v4 support, by Deepak Kumar ([#1363](https://github.com/dc-js/dc.js/pull/1363))
* until more stable, releases will be github-only (no npm/cdnjs)
* all [axis.tickArguments()](https://github.com/d3/d3-axis/blob/master/README.md#axis_tickArguments) are applied to `scale.ticks()` to produce horizontal & vertical gridlines, not just the first argument.

## 3.0
dc.js 3.0 is compatible with d3 versions 4 and 5! Thanks to Deepak Kumar for his tireless effort on making this finally happen.

New features will only be added to 3.0; however, 2.1 will be maintained for a limited time for those who still need compatibility with d3 version 3.


## 2.1.10
* Update dependencies, including crossfilter2 v1.4
* Example of adding a vertical line to a row chart

## 2.1.9
* Fix selectMenu crashing IE11 on Windows 8 and below, by Victor Parpoil ([#1338](https://github.com/dc-js/dc.js/pull/1338) / [#1334](https://github.com/dc-js/dc.js/issues/1334))

## 2.1.8
(see 2.0.5)

## 2.1.7
* viewBox-based resizing of charts, by James Tindall ([#1312](https://github.com/dc-js/dc.js/pull/1312))
* workaround for [issue #949](https://github.com/dc-js/dc.js/issues/949) merged from 2.0.4
* remove pointless and confusing optimization from number display - it now uses `computeOrderedGroups` like everything else.

## 2.1.6
* fix test syntax for Microsoft browsers

## 2.1.5
* crossfilter is loaded by its module name (crossfilter2), not its filename (crossfilter). This is intended to help webpack and other automatic module loaders. This is likely to break requireJS configurations; see [#1304](https://github.com/dc-js/dc.js/issues/1304) for details. ([#1213](https://github.com/dc-js/dc.js/issues/1213), [#1214](https://github.com/dc-js/dc.js/issues/1214), [#1261](https://github.com/dc-js/dc.js/issues/1261), [#1293](https://github.com/dc-js/dc.js/issues/1293), [#1302](https://github.com/dc-js/dc.js/issues/1302))
 * Default capMixin.ordering to sort decreasing by value, to emulate old group.top(N)
 * `numberDisplay` should pick the highest value in the case where it is given a regular group

## 2.1.4
 * Simplified `capMixin.othersGrouper` default implementation by passing the rest of the items as well as those before the cap. This is possible because of [#934](https://github.com/dc-js/dc.js/issues/934) relying on sorting of `group.all()` instead of `group.top()`. The default implementation is now easy to understand and it should be easier to customize (if anyone should want to).
 * Added example filtering segments of stack ([#657](https://github.com/dc-js/dc.js/issues/657))

## 2.1.3
 * 2.1.2 did not observe the common convention of having the rows/pie slices ordered from greatest to least - now we take from the front by default. ([#1296](https://github.com/dc-js/dc.js/issues/1296)
 * Add [`takeFront`](http://dc-js.github.io/dc.js/docs/html/dc.capMixin.html#takeFront) option, defaulted true, in case you want to take from the back isntead.
 * Remove `component.json`, since [component-js has been deprecated for a long time](https://github.com/componentjs/component/issues/639) (actually it got deprecated immediately after we added this in [#860](https://github.com/dc-js/dc.js/pull/860))

## 2.1.2
 * Lift `elasticRadius` from `bubbleChart` to `bubbleMixin`, making it available to `bubbleOverlay` ([#661](https://github.com/dc-js/dc.js/issues/661))
Stop using `group.top()` in favor of `group.all()` sorting and slicing. ([#934](https://github.com/dc-js/dc.js/issues/934))
 * Eliminate use of `group.top()` in cap mixin, by Macy Abbey ([#1184](https://github.com/dc-js/dc.js/pull/1184)). It already had to agree with `chart.ordering()` for the results to make sense.
 * Eliminate `group.top()` in number display. This one is more problematic but probably less common. Although the number display now defaults ordering to `function (kv) { return kv.value; }`, applications which use a group with multiple bins with the number display, which were using `group.order()` to specify which bin should be displayed, must now specify `numberDisplay.ordering()` instead.
 * Eliminate `group.top()` in bubble mixin, which was used to draw the bubbles in descending order of size, when the `group.order()` specified the radius. The bubble chart's `sortBubbleSize` is more general and is lifted to the mixin.

## 2.1.1
 * Merges 2.0.1

## 2.1.0
 * `dc.selectMenu`, implementing a `<select>` menu or multiple-select widget, by Andrea Singh ([#771](https://github.com/dc-js/dc.js/pull/771))
 * Heatmap allows customizing the ordering separately from the values, by Matt Traynham ([#869](https://github.com/dc-js/dc.js/pull/869) - thanks also to Quinn Lee for [#837](https://github.com/dc-js/dc.js/pull/837))
 * Front page stable version automatically read from GitHub, by Enrico Spinielli ([#865](https://github.com/dc-js/dc.js/pull/865))
 * Functional-style filter handlers: instead of modifying the array of filters in-place, filter handlers must return the new filter array. This is consistent with the old documention, but a different implementation: any changes to the `filters` argument will be ignored unless they are returned. This should make filter handlers easier to reason about.

# 2.0 Series
## 2.0.5
* legend highlighting functions of scatter plots would select symbols in sibling charts, causing the symbols and sizes to change ([#874](https://github.com/dc-js/dc.js/issues/874))

## 2.0.4
* Temporary flag [`stackMixin.evadeDomainFilter`](http://dc-js.github.io/dc.js/docs/html/dc.stackMixin.html#evadeDomainFilter__anchor) to work around [issue #949](https://github.com/dc-js/dc.js/issues/949) until it's fixed. The flag completely disables filtering of points by the stack mixin, because the current filtering is wrong. (The correct fix will be included in dc.js 2.1.x when it's ready.)

## 2.0.3
* crossfilter is loaded by its module name (crossfilter2), not its filename (crossfilter). This is intended to help webpack and other automatic module loaders. This is likely to break requireJS configurations; see [#1304](https://github.com/dc-js/dc.js/issues/1304) for details. ([#1213](https://github.com/dc-js/dc.js/issues/1213), [#1214](https://github.com/dc-js/dc.js/issues/1214), [#1261](https://github.com/dc-js/dc.js/issues/1261), [#1293](https://github.com/dc-js/dc.js/issues/1293), [#1302](https://github.com/dc-js/dc.js/issues/1302))
* Do not make the pie chart radius bigger than the chart size, by Sandeep Fatangare ([#1279](https://github.com/dc-js/dc.js/pull/1279))
* Allow custom scatter plot symbols ([#1274](https://github.com/dc-js/dc.js/issues/1274))
* Download example sorts the table data in the same order as it's shown ([#1232](https://github.com/dc-js/dc.js/issues/1232))
* `baseChart.replaceFilter` should return the chart ([#1227](https://github.com/dc-js/dc.js/issues/1227))

## 2.0.2
* Allow bracketed selectors for charts to work with numeric/quoted values, by Marcel Pfeiffer ([#1282](https://github.com/dc-js/dc.js/pull/1282))
* Fix images in [European Parliament example](http://dc-js.github.io/dc.js/ep/), by Xavier Dutoit ([#1284](https://github.com/dc-js/dc.js/pull/1284) / [#1256](https://github.com/dc-js/dc.js/issues/1256))
* Add `seriesChart` to [class hierarchy in HTML docs](http://dc-js.github.io/dc.js/docs/html/).

## 2.0.1
* `sans-serif` was specified as a string, which is invalid, by Kyle Doherty ([#1260](https://github.com/dc-js/dc.js/pull/1260))

## 2.0.0
* xAxisPaddingUnit also applied to stacked charts, by Alexander Stillesjö ([#1234](https://github.com/dc-js/dc.js/pull/1234)
* Limit zoom bounds - panning past the end should not cause brush to turn inside out. Thanks to Indri Muska for initial implementation and test ([#1026](https://github.com/dc-js/dc.js/pull/1026))
* Legend was wrapping one item too late, by alexnb ([#1229](https://github.com/dc-js/dc.js/pull/1229))
* Limit the number of legend items with `maxItems`, by Renoth ([#1114](https://github.com/dc-js/dc.js/pull/1114))
* [Example of switching time intervals](http://dc-js.github.io/dc.js/examples/switching-time-intervals.html), for doing simple aggregation of simple time series data
* Scatter plot titles, by Daniel Gall ([#1200](https://github.com/dc-js/dc.js/pull/1200))
* `scatterPlot` and `RangedTwoDimensionalFilter` no longer require that the dimension key have exactly two elements, to support the common trick of putting the color in the third element.
* [Scatter plot matrix brushing example](http://dc-js.github.io/dc.js/examples/splom.html)
* `emptyOpacity` is exposed, and `emptySize` is a radius like the other sizes (squared for symbol size), by Ganesh Iyer ([#1058](https://github.com/dc-js/dc.js/pull/1058))
* Bubble chart and heatmap correctly re-select (not selectAll) the sub-components in order to correctly apply new data when redrawn. This affects uses of dc.js where the data is replaced instead of being modified in place. (For example, the case where crossfilter is not used.) By Steffen Dienst and Matt Traynham. ([#1032](https://github.com/dc-js/dc.js/pull/1032), [#1237](https://github.com/dc-js/dc.js/pull/1237))
* Further changed other unnecessary uses of `selectAll` to `select` - when appending or inserting a single element, one should almost always match that with `select` for updates. ([#1239](https://github.com/dc-js/dc.js/issues/1239))
* Heatmap column/row filtering is a lot faster ([#649](https://github.com/dc-js/dc.js/issues/649))
* `colorMixin.colorCalculator` properly documented and deprecated ([#1225](https://github.com/dc-js/dc.js/issues/1225))
* Development dependencies upgraded, by Matt Traynham ([#1233](https://github.com/dc-js/dc.js/pull/1233))
* Add a class diagram to the [HTML documentation](http://dc-js.github.io/dc.js/docs/html/).
* Many documentation fixes. ([#612](https://github.com/dc-js/dc.js/issues/612), [#636](https://github.com/dc-js/dc.js/issues/636), [#1110](https://github.com/dc-js/dc.js/issues/1110), [#1224](https://github.com/dc-js/dc.js/issues/1224), [#1226](https://github.com/dc-js/dc.js/issues/1226), [#1228](https://github.com/dc-js/dc.js/issues/1228), [#1231](https://github.com/dc-js/dc.js/issues/1231), [#1235](https://github.com/dc-js/dc.js/issues/1235))

## 2.0.0 beta 33
* Use Sass 3 (SCSS) for generating CSS, by Matt Traynham ([#1049](https://github.com/dc-js/dc.js/pull/1049))
* Don't try to interpolate user data in label paths, by Alexander Stillesjö ([#1151](https://github.com/dc-js/dc.js/pull/1151))
* Allow specifying the unit for padding the X axis, by Alexander Stillesjö (thanks also to Matt Traynham for the alternate implementation in [#892](https://github.com/dc-js/dc.js/pull/892))
* Force dots to be shown with `.xyTipsOn('always')`, by Anders Dalvander ([#1152](https://github.com/dc-js/dc.js/issues/1152))
* Use keyAccessor for box plots; fix ordinal boxplot brushing and whisker widths, by Matt Traynham ([#1022](https://github.com/dc-js/dc.js/pull/1022))
* `transitionDelay` allows staggered transitions, by Mauricio Bustos ([#1116](https://github.com/dc-js/dc.js/pull/1116))
* Removed the confusing callback from dc.transition and documented the function

## 2.0.0 beta 32
* `elasticY` and `elasticX` did not work if all values were negative (coordinate grid and row charts, respectively), by Sebastian Gröhn ([#879](https://github.com/dc-js/dc.js/issues/879) / [#1156](https://github.com/dc-js/dc.js/pull/1156))
* Improved implementation of alignYAxes, by Mohamed Gazal and Gordon Woodhull ([#1033](https://github.com/dc-js/dc.js/pull/1033))
* Examples of downloading the table data as it's formatted, and formatting legend items.
* `legend.legendText` documentation was missing.
* Stop error spew when row chart is emptied out, thanks Einar Norðfjörð and Fil ([#1008](https://github.com/dc-js/dc.js/issues/1008) / ([#1024](https://github.com/dc-js/dc.js/pull/1024))
* Example of adjusting a pie chart threshold dynamically, by Wei Ding ([#1166](https://github.com/dc-js/dc.js/pull/1166))
* Do not allow pie slices to overlap pie labels, by Michael Dougherty ([#664](https://github.com/dc-js/dc.js/issues/664) / [#1167](https://github.com/dc-js/dc.js/pull/1167))
* Highlight pie slices when hovering labels and paths. (addressing a concern raised in commit [0a35ef61](https://github.com/dc-js/dc.js/pull/1167/commits/0a35ef61568baf8e84e0bc489f678df560dc7f31) in PR [#1167](https://github.com/dc-js/dc.js/pull/1167), but in a more robust way)
* Transition dots in line chart, by Paul Mach ([#1181](https://github.com/dc-js/dc.js/pull/1181))
* Number display was getting stuck on Infinity, by Xaser Acheron ([#1176](https://github.com/dc-js/dc.js/issues/1176) / [#1177](https://github.com/dc-js/dc.js/pull/1177))
* Improved bar chart transitions, by Fil ([#822](https://github.com/dc-js/dc.js/issues/822) / [#1146](https://github.com/dc-js/dc.js/pull/1146))

## 2.0.0 beta 31
* Brush was sometimes not displaying, fix by Paul Briton ([#1134](https://github.com/dc-js/dc.js/issues/1134))
* Example of workaround for using series chart as a range chart ([#479](https://github.com/dc-js/dc.js/issues/479))

## 2.0.0 beta 30
* Fix the doc build, which was crashing due to an impolite library and the upgrade of another one that knew nothing about it ([#1142](https://github.com/dc-js/dc.js/issues/1142))
* Strip fragment from URL before creating clip path URL ([#1079](https://github.com/dc-js/dc.js/issues/1079))

## 2.0.0 beta 29
* Fix node/browserify require(crossfilter2) again (first fix was lost in merge). Thanks Timothy Pfafman! ([#1133](https://github.com/dc-js/dc.js/pull/1133))

## 2.0.0 beta 28
* Line chart labels, by Mohamed Gazal ([#1045](https://github.com/dc-js/dc.js/pull/1045))
* Don't break when scatter plot key contains more than two elements, by Cathy Nangini ([#1123](https://github.com/dc-js/dc.js/pull/1123))
* Fix row chart title label offset, by Adrián de la Rosa ([#941](https://github.com/dc-js/dc.js/issues/941) / [#1129](https://github.com/dc-js/dc.js/pull/1129))
* Fix clip paths being dropped by Angular by using abolute paths, by @yandongCoder ([#1079](https://github.com/dc-js/dc.js/issues/1079))
* Fix error with object-valued crossfilter groups in pie chart, by Xaser Acheron ([#1085](https://github.com/dc-js/dc.js/issues/1085) / [#1128](https://github.com/dc-js/dc.js/pull/1128))
* Pass `value` function to `stackLayout` to make it possible to specify other stack layouts, by @jetsnguns ([#1102](https://github.com/dc-js/dc.js/issues/1102))
* Clarify documentation for `dataCount`, `rangeChart` ([#1076](https://github.com/dc-js/dc.js/issues/1076), [#1112](https://github.com/dc-js/dc.js/issues/1112))
* Documentation syntax fixes by @devginie, Chaitanya Chandukar ([#1131](https://github.com/dc-js/dc.js/issues/1131), [#1111](https://github.com/dc-js/dc.js/pull/1111))
* Switch to community fork of crossfilter. (Thanks Timothy Pfafman for correcting the node/browserify code here.) ([#1124](https://github.com/dc-js/dc.js/pull/1124))
* Add an HTML documentation front/welcome page ([#1103](https://github.com/dc-js/dc.js/issues/1103))

## 2.0.0 beta 27
* Improvements to HTML documentation, by Matt Traynham ([#1096](https://github.com/dc-js/dc.js/issues/1096) / [#1097](https://github.com/dc-js/dc.js/issues/1097) / [#1099](https://github.com/dc-js/dc.js/issues/1099) / [#1100](https://github.com/dc-js/dc.js/issues/1100) / [#1101](https://github.com/dc-js/dc.js/pull/1101))
* Ability to set color and opacity of non-brushed ("excluded") points in scatterplot; also separate brushing from highlighting, which seems like a different thing. ([#938](https://github.com/dc-js/dc.js/issues/938))

## 2.0.0 beta 26
* Apply pie chart labels before transition, so they are easier to manipulate with the pretransition hook. Added example of showing percentages in pie chart labels. (Workaround for [#703](https://github.com/dc-js/dc.js/issues/703))
* Documentation of chart registry, by Jasmine Hegman ([#676](https://github.com/dc-js/dc.js/issues/676) / [#1082](https://github.com/dc-js/dc.js/pull/1082))
* HTML documentation generation, by Matt Traynham. There are still some kinks to be worked out here, but in principle it should be more robust than the gigantic markdown file we are generating. ([#1086](https://github.com/dc-js/dc.js/pull/1086))
* Document that you need to use a `RangedFilter` when filtering a range, by koefoed ([#1090](https://github.com/dc-js/dc.js/pull/1090))
* Fix links to box plot examples, by Yuval Greenfield ([#1094](https://github.com/dc-js/dc.js/pull/1094))
* [Sparkline example](http://dc-js.github.io/dc.js/examples/sparkline.html) ([#1013](https://github.com/dc-js/dc.js/issues/1013))
* Example of [complex reductions](http://dc-js.github.io/dc.js/examples/complex-reduce.html) that need all the rows in each group, like min, max, median.
* [Time interval](http://dc-js.github.io/dc.js/examples/time-intervals.html) example.

## 2.0.0 beta 25
* Improved dataTable docs (including a fix for [#1030](https://github.com/dc-js/dc.js/issues/1030))
* Generate proper data table header ([#1015](https://github.com/dc-js/dc.js/issues/1015))
* Fix various test failures on Safari/IE/Edge (regular testing is on Chrome/Firefox/Opera) ([#1072](https://github.com/dc-js/dc.js/issues/1072), [#1073](https://github.com/dc-js/dc.js/issues/1073), [#1074](https://github.com/dc-js/dc.js/issues/1064))

## 2.0.0 beta 24
* Only auto-calculate width/height once each render - sizes were getting calculated wrong ([#1070](https://github.com/dc-js/dc.js/issues/1070)) and charts were changing size on redraw if they didn't have a fixed size in the chart spec or in the div style ([#980](https://github.com/dc-js/dc.js/issues/980))
* Tell browserify the correct entry point `browser: dc.js`, so it won't try to bundle jsdom, by Sam Dunster ([#1005](https://github.com/dc-js/dc.js/issues/1005) / ([#1062](https://github.com/dc-js/dc.js/pull/1062))
* Lighten the vertical lines in row chart (consistent with other charts), by Mike Vashevko ([#1046](https://github.com/dc-js/dc.js/issues/1046) / ([#1047](https://github.com/dc-js/dc.js/pull/1047))
* dc.utils docs, by Matt Traynham ([#961](https://github.com/dc-js/dc.js/issues/961) / ([#1041](https://github.com/dc-js/dc.js/pull/1041))

## 2.0.0 beta 23
* Domain was getting set for composite charts even when `elasticY` disabled. ([#1056](https://github.com/dc-js/dc.js/issues/1056)

## 2.0.0 beta 22
(no changes; bump due to botched npm publish)

## 2.0.0 beta 21
* Ability to use non-crossfilter backend with asynchronous connection (callback), via `commitHandler`.
* Domain comparison was failing for undefined/null domain values.
* Option `controlsUseVisibility` to use `visibility` attribute instead of `display` for `filter` and `reset` controls, to reduce disruption to the layout. Was originally on 2.1 branch with default true, now on 2.0 branch with default false. ([#888](https://github.com/dc-js/dc.js/issues/888), [#1016](https://github.com/dc-js/dc.js/issues/1016))
* Option to add labels above bars in bar chart (e.g. to show the value), by N Reese ([#211](https://github.com/dc-js/dc.js/issues/211) / [#1031](https://github.com/dc-js/dc.js/pull/1031))
* Option to sort bubbles with smaller bubbles in front; make bubble labels not clickable because they can get in the way, by Matt Traynham ([#1025](https://github.com/dc-js/dc.js/pull/1025))

## 2.0.0 beta 20
* Slicing functionality for basic data table paging, based on Chris Alvino's feature for the data grid ([#101](https://github.com/dc-js/dc.js/issues/101))
* Ability to customize the legend text, by Chris Alvino ([#982](https://github.com/dc-js/dc.js/pull/982))
* Option to align the left and right Y axes if either or both has negative values, by Mohomed Gazal ([#985](https://github.com/dc-js/dc.js/pull/985))
* Connector lines from pie wedges to external labels, by Alan Kavanagh ([#986](https://github.com/dc-js/dc.js/pull/986))
* Further documentation improvements, including lots more cross-linking, by Matt Traynham ([#1012](https://github.com/dc-js/dc.js/pull/1012))
* Minified CSS, by Indri Muska ([#1023](https://github.com/dc-js/dc.js/pull/1023))

## 2.0.0 beta 19
* Allow d3.selection to be passed as parent, as documented ([#1006](https://github.com/dc-js/dc.js/issues/1006))
* Properly derive dc.errors from Error prototype to get stack
* Add BadArgumentException and make .anchor() parent argument mandatory
* Enable crossfilter optimizations by not resetting the filter and by using filterExact and filterRange, by Ethan Jewett ([#990](https://github.com/dc-js/dc.js/pull/990) / [#989](https://github.com/dc-js/dc.js/issues/989) / [#478](https://github.com/dc-js/dc.js/issues/478))
* Add `filterType` to dc.filters, for filter optimizations and [easier serialization](https://github.com/dc-js/dc.js/issues/819)
* More documentation improvements, by Matt Traynham ([#999](https://github.com/dc-js/dc.js/pull/999))
* Fix method name in documentation ([#1009](https://github.com/dc-js/dc.js/issues/1009))
* Move x axis when row chart size changes, by Wang Xuan ([#1001](https://github.com/dc-js/dc.js/pull/1001)
* Fix css rule that was improperly selecting all axes, not just dc.js ones ([#1011](https://github.com/dc-js/dc.js/pull/1011) / ([#1005](https://github.com/dc-js/dc.js/issues/1007))
* Add pre-commit hook to hopefully avoid ever checking in merge artifacts again.

## 2.0.0 beta 18
* Fixes resizing examples to use `rescale` - currently all coordinate grid charts need to call this when changing width/height, in order to get axes moved ([#974](https://github.com/dc-js/dc.js/issues/974))
* Update all dependencies, continued linting, by Matt Traynham ([#975](https://github.com/dc-js/dc.js/pull/975))
* Bubble mixin minimum radius accessor ([#687](https://github.com/dc-js/dc.js/issues/687))
* Example of single selection of ordinal bar chart (for [#996](https://github.com/dc-js/dc.js/issues/996))
* Move documentation to JSDoc toolchain, by Matt Traynham ([#978](https://github.com/dc-js/dc.js/pull/978) / [#994](https://github.com/dc-js/dc.js/pull/994))
* Resize heat map axes when chart size changes, by Wang Xuan ([#995](https://github.com/dc-js/dc.js/pull/995)

## 2.0.0 beta 17
* Fixes issue where transitions were applied to the brush as it's being applied, causing it to lag ([#973](https://github.com/dc-js/dc.js/issues/973))

## 2.0.0 beta 16
* Reposition brush when coordinate grid chart size changes ([#972](https://github.com/dc-js/dc.js/pull/972))
* Ability to slice the data grid, by Chris Alvino ([#946](https://github.com/dc-js/dc.js/pull/946)). Also a much-needed warning that data table and data grid `.group()` means something completely different.
* Ability not to apply grouping to data table, by Emiliano Guevara ([#863](https://github.com/dc-js/dc.js/pull/863))

## 2.0.0 beta 15
* Reposition X axis on chart resize, by Rob Hardwick ([#856](https://github.com/dc-js/dc.js/pull/856)). Y axis as well
* More fixes for resizing charts, and [a new resizing examples directory](http://dc-js.github.io/dc.js/resizing/), mostly for testing.

## 2.0.0 beta 14
* Fix a test for IE and add svg subpath matcher, for #894

## 2.0.0 beta 13
* Pie chart radius padding, by Matt Traynham ([#894](https://github.com/dc-js/dc.js/pull/894))
* Example of a table showing group-aggregated data, by Ion Alberdi ([#929](https://github.com/dc-js/dc.js/pull/929))
* Filtered items were not displayed after render in coordinate grid charts, by Matt Traynham ([#900](https://github.com/dc-js/dc.js/pull/900))
* grammar/spelling/formatting fixes to annotated stock example, by Johnny Peck and Enrico Spinielli ([#956](https://github.com/dc-js/dc.js/pull/956), [#875](https://github.com/dc-js/dc.js/pull/875))
* document bower install, by Mayfarth ([#899](https://github.com/dc-js/dc.js/pull/899))
* remove unused bower version, by Kevin Kirsche ([#948](https://github.com/dc-js/dc.js/pull/948))

## 2.0.0 beta 12
 * axes should rescale on chart rescale (not just on zoom). ([#791](https://github.com/dc-js/dc.js/issues/791))
 * always rescale x axis on render, and detect domain change more thoroughly, by Matt Traynham
 ([#896](https://github.com/dc-js/dc.js/pull/896))

## 2.0.0 beta 11
 * pretransition event ([#806](https://github.com/dc-js/dc.js/issues/806))
 * replace `.renderlet(...)` with `.on("renderlet", ...)` in test and examples, by Alan Kavanagh ([#906](https://github.com/dc-js/dc.js/issues/906) / ([#917](https://github.com/dc-js/dc.js/pull/917))

## 2.0.0 beta 10
 * component package manager support, by Shobhit Gupta ([#860](https://github.com/dc-js/dc.js/pull/860))
 * add sourcemaps (*.map) to distributions ([#866](https://github.com/dc-js/dc.js/issues/866))
 * allow `.options()` to take an array of arguments (for better angular-dc support), by Tim Ruhle ([#886](https://github.com/dc-js/dc.js/pull/886) / ([#769](https://github.com/dc-js/dc.js/issues/769))
 * make bower distro smaller, by Matt Traynham and Tim Ruhle ([#925](https://github.com/dc-js/dc.js/pull/925 / [#935](https://github.com/dc-js/dc.js/pull/935))
 * added infrastructure for testing transitions by eye
 * added area and stacked bar examples ([#777](https://github.com/dc-js/dc.js/issues/#777))

## 2.0.0 beta 9
 * propagate elasticX to child charts so that domain can be calculated correctly ([#926](https://github.com/dc-js/dc.js/issues/926))

## 2.0.0 beta 8
 * simplify Gruntfile and further update dependencies, by Matt Traynham ([#849](https://github.com/dc-js/dc.js/pull/849))
 * setting the chart group should automatically put the chart in that group, by Matt Traynham ([#834](https://github.com/dc-js/dc.js/pull/834) / [#775](https://github.com/dc-js/dc.js/issues/775))

## 2.0.0 beta 7
 * fixes a bug introduced in the last release where the ordering function was defined inconsistently, causing the default ordering function to be incorrect and causing crashes with largish data in crossfilter's quicksort on IE. ([#909](https://github.com/dc-js/dc.js/issues/909))

## 2.0.0 beta 6
 * pie chart consistently pass data object to pie title function, by Jasmine Hegman ([#824](https://github.com/dc-js/dc.js/pull/824) / [#755](https://github.com/dc-js/dc.js/issues/755))
 * heatmap box titles were not updated on redraw, by hhravn ([#798](https://github.com/dc-js/dc.js/pull/798))
 * apply ordering to ordinal bar chart, by Mihai Hodorogea ([#766](https://github.com/dc-js/dc.js/pull/766) / [#772](https://github.com/dc-js/dc.js/issues/772))
 * add option to hide mouseover dots for line chart, by Davis Ford ([#735](https://github.com/dc-js/dc.js/pull/735))
 * adding example bar-extra-line, overlaying a line with a renderlet

## 2.0.0 beta 5
 * updating this doc to link to issues/PRs manually (until we get a better changelog
   system?), by Matt Traynham ([#845](https://github.com/dc-js/dc.js/issues/845))
 * update all NPM dependencies and fix tests that were not expecting any results,
   by Matt Traynham ([#844](https://github.com/dc-js/dc.js/issues/844))

## 2.0.0 beta 4
 * make barChart.onClick a proper override, by Gordon Woodhull (fixes the complaint in [#168](https://github.com/dc-js/dc.js/issues/168))

## 2.0.0 beta 3
 * Properly tagged this time.

## 2.0.0 beta 2
 * Re-implement renderlets as regular event `.on('renderlet')`. old function `.renderlet()`
   is deprecated, by Matt Traynham ([#776](https://github.com/dc-js/dc.js/issues/776) / [#833](https://github.com/dc-js/dc.js/issues/833), replaces [#779](https://github.com/dc-js/dc.js/issues/779))
 * Geochoropleth tests sped up, by Jasmine Hegman ([#825](https://github.com/dc-js/dc.js/issues/825) / [#817](https://github.com/dc-js/dc.js/issues/817))
 * Number display test cleaned up, by Jasmine Hegman ([#826](https://github.com/dc-js/dc.js/issues/826)/ [#783](https://github.com/dc-js/dc.js/issues/783))
 * Provide a way to override the heatmap labels, by hhravn ([#794](https://github.com/dc-js/dc.js/issues/794) / [#793](https://github.com/dc-js/dc.js/issues/793))

## add-logo tag
 * Added logo to main page and favicon ([#618](https://github.com/dc-js/dc.js/issues/618))

## 2.0.0 beta 1
 * Merged [#800](https://github.com/dc-js/dc.js/issues/800): unselectable ids starting with numbers [#789](https://github.com/dc-js/dc.js/issues/789). Thanks Jasmine Hegman!
 * Interface and features frozen - from this point all fixes will be merged to
   `master` and `develop`, and all interface changes only merged to `develop`.

## Starting dc.js Changelog
 * Here we start using git-flow, start a changelog, and start 2015.  Under git-flow,
   the latest release (starting with 2.0.0-beta.1) is always on the master branch,
   development (2.1.0-dev) is on the develop branch, and releases and fixes are always
   merged into develop.
 * Read about git-flow here: http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/
 * It follows that this document will always have two active sections: the master
   section, and the develop section.  Since any changes merged to master are also
   merged to develop, any changes added to the changelog for the master branch will
   get merged into the same section in the develop version of this document.
