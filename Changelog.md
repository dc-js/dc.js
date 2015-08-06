## 2.1.0
 * Heatmap allows customizing the ordering separately from the values, by Matt Traynham ([#869](https://github.com/dc-js/dc.js/pull/869) - thanks also to Quinn Lee for [#837](https://github.com/dc-js/dc.js/pull/837))
 * Front page stable version automatically read from GitHub, by Enrico Spinielli ([#865](https://github.com/dc-js/dc.js/pull/865))

# 2.0 Series
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
