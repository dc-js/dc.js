## 2.0.0 beta 3
 * Properly tagged this time.

## 2.0.0 beta 2
 * Re-implement renderlets as regular event `.on('renderlet')`. old function `.renderlet()`
   is deprecated, by Matt Traynham (#776 / #833, replaces #779)
 * Geochoropleth tests sped up, by Jasmine Hegman (#825 / #817)
 * Number display test cleaned up, by Jasmine Hegman (#826/ #783)
 * Provide a way to override the heatmap labels, by hhravn (#794)

## add-logo tag
 * Added logo to main page and favicon (#618)

## 2.0.0 beta 1
 * Merged #800: unselectable ids starting with numbers #789. Thanks Jasmine Hegman!
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
