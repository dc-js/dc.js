# 2.0 Series
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
