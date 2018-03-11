##Non working examples

- http://localhost:8888/web/examples/filter-stacks.html 
 (fading is peculiar)
- http://localhost:8888/web/zoom/restrict-panning.html
  Inconsistent with previous version
- http://localhost:8888/web/  
  Range brushing inconsistent with previous version
  If the range chart is brushed first it works correctly
  If the Focus chart is zoomed first, brushing range chart fails.


##Issues to be fixed

- Peculiar fading in filter-stacks.html (Medium)


##Before release

- All High priority issues
- Possibly Medium priority issues
- Update documentation

    - setters for `xAxis` and `yAxis` update docs for D3v4. 
    - Update docs for `yAxis` or `_useRightYAxis`. These are now related.
    - `.tension` can now be dropped, it can be handled by `.interpolate` itself

- Prepare upgrade guide
