##Non working examples

- http://localhost:8888/web/examples/filter-stacks.html 
 (fading is peculiar)
 

##Issues to be fixed

- geoChoroplethChart
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
