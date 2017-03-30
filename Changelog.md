# 2.0 Series
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
* Front page stable version automatically read from GitHub, by Enrico Spinielli ([#865](https://github.com/dc-js/dc.js/pull/865))

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
