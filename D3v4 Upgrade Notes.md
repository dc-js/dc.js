##Non working examples

- http://localhost:8888/web/examples/filter-stacks.html 
 (fading is peculiar)
 

##Issues to be fixed

- Peculiar fading in filter-stacks.html (Medium)
- Need proper color matcher for Jasmine (Low)
- Need proper URL matcher for Jasmine (Low)
- Update/fix test cases (High)
- Remove D3v3 compat (High)
    
    - Apply renames
    - Apply d3.dispatch changes
    - Move remaining compat functions inside dc namespace


##Before release

- All High priority issues
- Possibly Medium priority issues
- Update documentation

    - setters for `xAxis` and `yAxis` update docs for D3v4. 
    - Update docs for `yAxis` or `_useRightYAxis`. These are now related.
    - `.tension` can now be dropped, it can be handled by `.interpolate` itself

- Prepare upgrade guide
