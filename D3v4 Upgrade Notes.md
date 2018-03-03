##Non working examples

- http://localhost:8888/web/examples/area.html (lines ok, area missing)
- http://localhost:8888/web/examples/box-plot-time.html
- http://localhost:8888/web/examples/line.html (lines ok, area missing)
- http://localhost:8888/web/examples/time-intervals.html (bar width)
- http://localhost:8888/web/examples/switching-time-intervals.html 
  (warnings)
- http://localhost:8888/web/examples/filter-stacks.html 
 (fading is peculiar)
 

##Issues to be fixed

- Lines chart - Area is not working
- geoChoroplethChart
- Bar width
- Peculiar fading in filter-stacks.html
- Need proper color matcher for Jasmine (Low)
- Need proper URL matcher for Jasmine (Low)
- Update/fix test cases


##Before release

- Update documentation

    - setters for `xAxis` and `yAxis` update docs for D3v4. 
    - Update docs for `yAxis` or `_useRightYAxis`. These are now related.
    - `.tension` can now be dropped, it can be handled by `.interpolate` itself

- Prepare upgrade guide
