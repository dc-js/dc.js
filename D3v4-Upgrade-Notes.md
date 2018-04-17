##Non working examples

- http://localhost:8888/web/examples/filter-stacks.html 
 (fading is peculiar)
- http://localhost:8888/web/zoom/restrict-panning.html
  Need to increase height of range chart - currently height of
  brushable area is zero. New implementation needs it be more than zero.
- http://localhost:8888/web/  
  Range brushing inconsistent with previous version
  If the range chart is brushed first it works correctly
  If the Focus chart is zoomed first, brushing range chart fails.


##Issues to be fixed

- Peculiar fading in filter-stacks.html (Medium)


##Before release

- All High priority issues
- Possibly Medium priority issues
- Prepare upgrade guide (Initial version ready)


### Next set of pull requests

- Cleanup of zoom behavior. Testing of restrict panning etc.
- dc.event.trigger
- exit/enter/update sequence
- Additional test cases for dc.util.add and dc.util.subtract
- One for each new chart type - original PRs from community
- Consider removing transitions for zooming and brushing
- d3 stack to D3v4
- Changing .tension call in lineChart


### For end users

- Changes to `xUnits` interface.
- geoChart
- Color scheme
- tension in curves

