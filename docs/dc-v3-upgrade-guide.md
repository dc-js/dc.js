# dc v3 Upgrade Guide

The dc has undergone significant internal changes while moving to v3.
Effort has been made to keep the API as close as possible.

d3 team has released version 4 which is not backward compatible with
their version 3. dc relies very heavily on d3. It is quite likely that
your code uses bits of d3.

Outline of the upgrade process:

- First of all update all d3 functions calls in your code. Most of these
  would start with d3. Check https://github.com/d3/d3/blob/master/CHANGES.md
  for new function name corresponding to old functions.
- dc.lineChart .interpolate earlier took string parameter, these will get
  replaced by specialized curve functions. For example 'step-before'
  changes to `d3.curveStepBefore` and 'cardinal' to `d3.curveCardinal`.
  See https://github.com/d3/d3/blob/master/CHANGES.md#shapes-d3-shape
  for equivalent function calls.
- For dc.geoChoroplethChart earlier `d3.geoAlbersUsa()` was the default
  for .projection. If you are plotting US states please call 
  `.projection(d3.geoAlbersUsa())` explicitly on your chart.
