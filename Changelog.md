## Ruhley Changes
  * Row Chart ```useRightYAxis``` (ba8bbc0e1d5d203ec39a39f9f99a0ee83d4597a2 / 217e294651961981a6959fa7ce30f21afe100fc7)
  * Paired Row Charts (137213b566ae39e5f646016c9f13e30b0f6385a1 / 1267f7a82d4b8280d102460e1e85126aaffd0a60 / 5494b449f95a183bbc8416aa01b7bbc37efcf460 / 8c5ed0de8ac914c934da497fbfc54d7c85caa22f / 7e71309853c6a664f9a6827d8b291c5c56bd1db1 / 58c93c1b3773fd4a7b455bbc09f2725eeec55aef)
  * New ```clickOn``` option to disable all clicking events (c65346338df0f88a24847fd518cd950f657d0ae6)
  * ```xAxisTickLabelRotate``` and ```yAxisTickLabelRotate``` (d2bcf2338e21e5f7f3c9c4ff63e93e3cb2f7383d / f9e08c55fbe99649ae0b8052672f988aae81ee03)
  * Row chart ```xAxisLabel``` (c6e473bf359f069f5d4e6883d16f25827084a7a0 / a8d72ae8b8a2d0d4a4dce11b377f044365cd58fc / 289ae4600a53aa7a3396e9d95257264535fc5cfc / 27c03a48d9328673c632064aa7c784bfd6a1411a)
  * Responsive Charts - the chart is fit into the parent container, labels wrap and ellipses, all labels and legends make the chart body smaller, legend just has a position property (top, right, bottom, left) and it automatically fits it in (f939481ff921e6020d97e508728546dca0260c45 / 9cd85df7e43ca57c4504a09b0091de53321fb2ff / 7196dfa8c35c4f0da6be26cc102a031c06cd255b / 3f8b768021a947442b6d8500ce81fdc47133e728 / 670078d7e10513b57ac79e23ac8f0d5796c9ca48 / 2ce1fe8fd89b63b2953fe80fb6a1d19fd847fe96)
  * Pie chart - fixed there being no hover effect when mouse was over the text (aaeb3542ef3f83e48e23797f099c5f8d21785632 / d5c6ad1b31c1c297b252f8fd79432a233c6b2d34 / a93180dcf15dc88bb2ca27bf4b1d12931ce869dc)
  * Getting grunt server to watch and compile the main css file (60353aa2eca1ec32174a7dedf6aec7c2a2cadef6)
  * Changing deselected to a low opacity rather than changing to grey (6294d82ace8a5d1e9297c92dcc553f3db9a8c64d)
  * y axis tick integers only flag (0ecd81729bdbdbeac33d470b3413f8665c8c8888)
  * Fixing composite chart resetting all filters - Bugs #390, #677 and #706 (f1b218db107afaee7910f87426d33240fb4cc166)
  * Fixing line charts ordering potentially creating skewed lines (ab15d786855100936e4b7b53dccf8f5ee58ce79b / 4afcd0c61f99fcb44e4f952635936ad8834fd803)
  * Tooltip redesign (324399d64e736102e8ca9073481d78ec9a78ef7a / c47b46b704c74e63803bfbc315b62ea77525e806 / f2124fa0b10c96e890c917a3908b446bb91b803c / e27405308ab14faa36b510f28b1fa6f90a68b3aa / 1e6d6d06074fbffda66631b62ad5f59e3432ab35 / 819f75c67a4faee6a9a31be1d8e2dcd18de2eea3 / b0230acdfae849a39d569825bb81bfdbcc110cdc)

## 2.1.0
 * Heatmap allows customizing the ordering separately from the values, by Matt Traynham ([#869](https://github.com/dc-js/dc.js/pull/869) - thanks also to Quinn Lee for [#837](https://github.com/dc-js/dc.js/pull/837))
 * Front page stable version automatically read from GitHub, by Enrico Spinielli ([#865](https://github.com/dc-js/dc.js/pull/865))
 * Functional-style filter handlers: instead of modifying the array of filters in-place, filter handlers must return the new filter array. This is consistent with the old documention, but a different implementation: any changes to the `filters` argument will be ignored unless they are returned. This should make filter handlers easier to reason about.

# 2.0 Series
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
