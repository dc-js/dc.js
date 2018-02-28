To look soon:

- Need proper color matcher for Jasmine
- Need proper URL matcher for Jasmine
- setters for `xAxis` and `yAxis` update docs for D3v4.
- Either of `yAxis` or `_useRightYAxis` should go. Better to drop `_useRightYAxis`.
  Current workaround not great.
- In brushing events - if change filter is applied on brush end no event 
  delay is needed.
- MouseZoom needs careful reimplementation. .focus not working as it uses zoom.
- Lines chart - Area is not working - the function d3.area seems to return different
  value from D3v3 - manual debugging needed


Non working examples:

- http://localhost:8888/web/examples/area.html (lines ok, area missing)
- http://localhost:8888/web/examples/box-plot-time.html
- http://localhost:8888/web/examples/line.html (lines ok, area missing)
- http://localhost:8888/web/examples/multi-focus.html
- http://localhost:8888/web/examples/range-series.html (brush/zoom not working)
- http://localhost:8888/web/examples/scatter-brushing.html (brush not working)
- http://localhost:8888/web/examples/series.html
- http://localhost:8888/web/examples/splom.html (brush not working)
- http://localhost:8888/web/examples/time-intervals.html 
  (bar width, some warnings, brushing not working)
- http://localhost:8888/web/examples/time-intervals.html (bar width incorrect)

