# dc v5 Upgrade Guide

The library has been significantly refactored in v5.
The code has been arranged around clearer separation of responsibilities.
This has enabled fixing long-standing issues and enabled clean support for remote data sources.

The library is distributed in two variants:

- dc.js — only the newer API, recommended for new projects.
- dc-compat.js — v4 compatibility mode, which is close to the v4 API. 
  
In certain cases, however, you would need to upgrade:

- Only UMD bundles are distributed with `compat` option. If you were using ES6 modules, you would need to upgrade.
- Support for newer features is not guaranteed in the `compat` mode.
  Mixing of newer APIs with older ones may produce unexpected results.
- Some APIs are no longer available. Notably `filterHandler`, `hasFilterHandler`, `addFilterHandler` and `removeFilterHandler`. If your code relies on any of these, you would need to upgrade rewrite using newer features.
  
Please raise an issue on GitHub if you run into problems not covered here!

## Key changes

- The code base has been upgraded to TypeScript. Type definitions are included.
- Charts need to be created using [constructors](#chart-creation).
- Key/value pair [configuration](#keyvalue-pair-configuration).
- Concept of [ChartGroup](#chartgroup).
- Concept of [DataProvider](#dataproviders) classes.
- Concept of [ColorHelper](#colorhelpers) classes.
- Many methods and accessors have been [deprecated](#deprecated).

## Chart creation

This was introduced in v4. The older function-based methods were deprecated and now have been removed from v5.

Change `dc.pieChart(parent, chartGroup)` &#10137; `new dc.PieChart(parent, chartGroup)`

## Key/value pair configuration

Charts now support key/value configuration.
This should simplify sharing configuration across charts easier.

For every chart, there is a corresponding interface that covers the list of supported options.
For example, the interface for {@link PieChart} is {@link IPieChartConf}.
The {@link PieChart.configure} and {@link PieChart.conf} will refer to this interface.

To use it:

```
// It will be merged with exisiting configuration
chart.configure({
   minHeight: 250,
   minWidth: 300
});

// it will return entire configuration
const conf = chart.conf();

// minHeight
chart.conf().minHeight;
```

List of accessors that have moved to conf:

- {@link BaseMixin}
  - {@link IBaseMixinConf.commitHandler | commitHandler}
  - {@link IBaseMixinConf.controlsUseVisibility | controlsUseVisibility}
  - {@link IBaseMixinConf.filterPrinter | filterPrinter}
  - {@link IBaseMixinConf.keyAccessor | keyAccessor}
  - {@link IBaseMixinConf.label | label}
  - {@link IBaseMixinConf.minHeight | minHeight}
  - {@link IBaseMixinConf.minWidth | minWidth}
  - {@link IBaseMixinConf.renderLabel | renderLabel}
  - {@link IBaseMixinConf.renderTitle | renderTitle}
  - {@link IBaseMixinConf.title | title}
  - {@link IBaseMixinConf.transitionDelay | transitionDelay}
  - {@link IBaseMixinConf.transitionDuration | transitionDuration}
  - {@link IBaseMixinConf.useViewBoxResizing | useViewBoxResizing}
- {@link BubbleMixin}
  - {@link IBubbleMixinConf.elasticRadius | elasticRadius}
  - {@link IBubbleMixinConf.excludeElasticZero | excludeElasticZero}
  - {@link IBubbleMixinConf.maxBubbleRelativeSize | maxBubbleRelativeSize}
  - {@link IBubbleMixinConf.minRadiusWithLabel | minRadiusWithLabel}
  - {@link IBubbleMixinConf.radiusValueAccessor | radiusValueAccessor}
  - {@link IBubbleMixinConf.sortBubbleSize | sortBubbleSize}
- {@link ColorMixin}
  - {@link IColorMixinConf.colorAccessor | colorAccessor}
- {@link CoordinateGridMixin}
  - {@link ICoordinateGridMixinConf.brushOn | brushOn}
  - {@link ICoordinateGridMixinConf.clipPadding | clipPadding}
  - {@link ICoordinateGridMixinConf.elasticX | elasticX}
  - {@link ICoordinateGridMixinConf.elasticY | elasticY}
  - {@link ICoordinateGridMixinConf.mouseZoomable | mouseZoomable}
  - {@link ICoordinateGridMixinConf.parentBrushOn | parentBrushOn}
  - {@link ICoordinateGridMixinConf.renderHorizontalGridLines | renderHorizontalGridLines}
  - {@link ICoordinateGridMixinConf.renderVerticalGridLines | renderVerticalGridLines}
  - {@link ICoordinateGridMixinConf.round | round}
  - {@link ICoordinateGridMixinConf.useRightYAxis | useRightYAxis}
  - {@link ICoordinateGridMixinConf.xAxisPadding | xAxisPadding}
  - {@link ICoordinateGridMixinConf.xAxisPaddingUnit | xAxisPaddingUnit}
  - {@link ICoordinateGridMixinConf.xUnits | xUnits}
  - {@link ICoordinateGridMixinConf.yAxisPadding | yAxisPadding}
  - {@link ICoordinateGridMixinConf.zoomOutRestrict | zoomOutRestrict}
  - {@link ICoordinateGridMixinConf.zoomScale | zoomScale}
- {@link StackMixin}
  - {@link IStackMixinConf.evadeDomainFilter | evadeDomainFilter}
  - {@link IStackMixinConf.hidableStacks | hidableStacks}
- {@link BarChart}
  - {@link IBarChartConf.alwaysUseRounding}
  - {@link IBarChartConf.centerBar}
- {@link BoxPlot}
  - {@link IBoxPlotConf.boldOutlier}
  - {@link IBoxPlotConf.dataOpacity}
  - {@link IBoxPlotConf.dataWidthPortion}
  - {@link IBoxPlotConf.renderDataPoints}
  - {@link IBoxPlotConf.showOutliers}
  - {@link IBoxPlotConf.tickFormat}
  - {@link IBoxPlotConf.yRangePadding}
- {@link CboxMenu}
  - {@link ICboxMenuConf.filterDisplayed}
  - {@link ICboxMenuConf.multiple}
  - {@link ICboxMenuConf.order}
  - {@link ICboxMenuConf.promptText}
  - {@link ICboxMenuConf.promptValue}
- {@link CompositeChart}
  - {@link ICompositeChartConf.shareColors}
  - {@link ICompositeChartConf.shareTitle}
- {@link DataCount}
  - {@link IDataCountConf.formatNumber}
  - {@link IDataCountConf.html}
- {@link DataGrid}
  - {@link IDataGridConf.beginSlice}
  - {@link IDataGridConf.endSlice}
  - {@link IDataGridConf.html}
  - {@link IDataGridConf.htmlSection}
  - {@link IDataGridConf.order}
  - {@link IDataGridConf.section}
  - {@link IDataGridConf.size}
  - {@link IDataGridConf.sortBy}
- {@link DataTable}
  - {@link IDataTableConf.beginSlice}
  - {@link IDataTableConf.columns}
  - {@link IDataTableConf.endSlice}
  - {@link IDataTableConf.order}
  - {@link IDataTableConf.section}
  - {@link IDataTableConf.showSections}
  - {@link IDataTableConf.size}
  - {@link IDataTableConf.sortBy}
- {@link GeoChoroplethChart}
  - {@link IGeoChoroplethChartConf.geoJsons}
- {@link HeatMap}
  - {@link IHeatMapConf.boxOnClick}
  - {@link IHeatMapConf.colOrdering}
  - {@link IHeatMapConf.cols}
  - {@link IHeatMapConf.colsLabel}
  - {@link IHeatMapConf.rowOrdering}
  - {@link IHeatMapConf.rows}
  - {@link IHeatMapConf.rowsLabel}
  - {@link IHeatMapConf.xAxisOnClick}
  - {@link IHeatMapConf.xBorderRadius}
  - {@link IHeatMapConf.yAxisOnClick}
  - {@link IHeatMapConf.yBorderRadius}
- {@link NumberDisplay}
  - {@link INumberDisplayConf.formatNumber}
- {@link PieChart}
  - {@link IPieChartConf.drawPaths}
  - {@link IPieChartConf.emptyTitle}
  - {@link IPieChartConf.externalLabels}
  - {@link IPieChartConf.externalRadiusPadding}
  - {@link IPieChartConf.innerRadius}
  - {@link IPieChartConf.minAngleForLabel}
  - {@link IPieChartConf.radius}
- {@link RowChart}
  - {@link IRowChartConf.elasticX}
  - {@link IRowChartConf.fixedBarHeight}
  - {@link IRowChartConf.gap}
  - {@link IRowChartConf.labelOffsetX}
  - {@link IRowChartConf.labelOffsetY}
  - {@link IRowChartConf.renderTitleLabel}
  - {@link IRowChartConf.titleLabelOffsetX}
- {@link ScatterPlot}
  - {@link IScatterPlotConf.emptyColor}
  - {@link IScatterPlotConf.emptyOpacity}
  - {@link IScatterPlotConf.emptySize}
  - {@link IScatterPlotConf.excludedColor}
  - {@link IScatterPlotConf.excludedOpacity}
  - {@link IScatterPlotConf.excludedSize}
  - {@link IScatterPlotConf.existenceAccessor}
  - {@link IScatterPlotConf.highlightedSize}
  - {@link IScatterPlotConf.nonemptyOpacity}
  - {@link IScatterPlotConf.symbolSize}
  - {@link IScatterPlotConf.useCanvas}
- {@link SelectMenu}
  - {@link ISelectMenuConf.filterDisplayed}
  - {@link ISelectMenuConf.multiple}
  - {@link ISelectMenuConf.numberVisible}
  - {@link ISelectMenuConf.order}
  - {@link ISelectMenuConf.promptText}
  - {@link ISelectMenuConf.promptValue}
- {@link SeriesChart}
  - {@link ISeriesChartConf.seriesAccessor}
  - {@link ISeriesChartConf.seriesSort}
  - {@link ISeriesChartConf.valueSort}
- {@link SunburstChart}
  - {@link ISunburstChartConf.emptyTitle}
  - {@link ISunburstChartConf.externalLabels}
  - {@link ISunburstChartConf.innerRadius}
  - {@link ISunburstChartConf.minAngleForLabel}
  - {@link ISunburstChartConf.radius}
  - {@link ISunburstChartConf.ringSizes}
- {@link TextFilterWidget}
  - {@link ITextFilterWidgetConf.filterFunctionFactory}
  - {@link ITextFilterWidgetConf.normalize}
  - {@link ITextFilterWidgetConf.placeHolder}

## Deprecated

- {@link BaseMixin}
  - dimension: see [DataProviders](#dataproviders)
  - group: see [DataProviders](#dataproviders)
  - ordering: see [DataProviders](#dataproviders)
  - valueAccessor: see [DataProviders](#dataproviders)
- CapMixin
  - cap: see [DataProviders](#dataproviders)
  - takeFront: see [DataProviders](#dataproviders)
  - othersLabel: see [DataProviders](#dataproviders)
  - othersGrouper: see [DataProviders](#dataproviders)
- {@link ColorMixin}
  - colorCalculator: see [ColorHelpers](#colorhelpers)
  - colors: see [ColorHelpers](#colorhelpers)
  - colorDomain: see [ColorHelpers](#colorhelpers)
- {@link CoordinateGridMixin}
  - rangeChart: no longer needed. Just associate charts with the same dimension. See [stocks example](../..)
  - focusChart: no longer needed. Just associate charts with the same dimension. See [stocks example](../..)
- {@link StackMixin}
  - stack: see [DataProviders](#dataproviders)
  - group: see [DataProviders](#dataproviders)
  - title(titleAccessor): remains the same
  - title(stackName, titleAccessor) -> assign {@link IStackMixinConf.titles} like
    ```
    chart.configure({
      titles: {
        volume: titleAccessor1,
        movement: titleAccessor2
      }
    })
    ```
- {@link BubbleOverlay}
  - point: instead of setting point at a time, set all points via {@link IBubbleOverlayConf.points}
- {@link DataCount}
  - dimension -> misleading name, renamed to {@link DataCount.crossfilter}
  - group -> misleading name, renamed to {@link DataCount.groupAll}
- {@link DataGrid}
  - group -> misleading name, renamed, use {@link IDataGridConf.section | section} conf option
  - htmlGroup -> misleading name, renamed, use {@link IDataGridConf.htmlSection | htmlSection} conf option
- {@link DataTable}
  - group -> misleading name, renamed, use {@link IDataTableConf.section | section} conf option
  - showGroups -> misleading name, renamed, use {@link IDataTableConf.showSections | showSections} conf option
- {@link GeoChoroplethChart}
  - overlayGeoJson -> assign / update array {@link IGeoChoroplethChartConf.geoJsons} as needed
  - removeGeoJson -> assign / update array {@link IGeoChoroplethChartConf.geoJsons} as needed
- {@link PieChart}
  - slicesCap -> configure it through {@link ICFDataCapHelperConf.cap | cap} configuration option in {@link CFDataCapHelper}
- {@link ScatterPlot}
  - hiddenSize -> use {@link IScatterPlotConf.emptySize | emptySize} configuration option
- {@link SelectMenu}
  - size -> use {@link ISelectMenuConf.numberVisible | numberVisible} configuration option
- {@link SeriesChart}
  - chart -> use {@link ISeriesChartConf.chartFunction | chartFunction} configuration option
- ChartRegistry (see [ChartGroup example](#chartgroup)).
  - registerChart -> {@link ChartGroup.register}
  - deregisterChart -> {@link ChartGroup.deregister}
  - hasChart -> {@link ChartGroup.has}
  - deregisterAllCharts -> {@link ChartGroup.clear}, probably no longer needed, see [ChartGroup example](#chartgroup)
  - filterAll -> {@link ChartGroup.filterAll}
  - refocusAll -> {@link ChartGroup.refocusAll}
  - renderAll -> {@link ChartGroup.renderAll}, see also {@link ChartGroup.renderlet}
  - redrawAll -> {@link ChartGroup.redrawAll}, see also {@link ChartGroup.renderlet}
  - renderlet -> {@link ChartGroup.renderlet}
- filters
  - filters.RangedFilter -> {@link RangedFilter.constructor | new RangedFilter}
  - filters.TwoDimensionalFilter -> {@link TwoDimensionalFilter.constructor | new TwoDimensionalFilter}
  - filters.RangedTwoDimensionalFilter -> {@link RangedTwoDimensionalFilter.constructor | new RangedTwoDimensionalFilter}
  - filters.HierarchyFilter -> {@link HierarchyFilter.constructor | new HierarchyFilter}
- units
  - units.integers -> {@link UnitsInteger}
  - units.ordinal -> {@link UnitsOrdinal}
  - units.fp.precision -> {@link UnitWithPrecision}
- utils
  - pluck(x) -> convert to function like `d => d.x`
  - pluck(x, f) -> {@link pluck2 | pluck2(x, f)}
  - utils.add -> {@link add}
  - utils.allChildren -> {@link allChildren}
  - utils.appendOrSelect -> {@link appendOrSelect}
  - utils.arraysEqual -> {@link arraysEqual}
  - utils.arraysIdentical -> {@link arraysIdentical}
  - utils.clamp -> {@link clamp}
  - utils.constant -> convert to function like `x => () => x`
  - utils.getAncestors -> {@link getAncestors}
  - utils.isFloat -> {@link isFloat}
  - utils.isInteger -> {@link isInteger}
  - utils.isNegligible -> {@link isNegligible}
  - utils.isNumber -> {@link isNumber}
  - utils.nameToId -> {@link nameToId}
  - utils.printSingleValue -> {@link printSingleValue}
  - utils.printSingleValue.fformat -> {@link Config.floatFormat | config.floatFormat}
  - utils.safeNumber -> {@link safeNumber}
  - utils.subtract -> {@link subtract}
  - utils.toHierarchy -> {@link toHierarchy}
  - utils.uniqueId -> {@link uniqueId}

## Examples

### DataProviders

### ColorHelpers

### ChartGroup

ChartGroup is a key concept in dc.
This links all charts so that filtering one of the charts causes updates in all linked charts.
Up to dc@v4 ChartRegistry maintained these lists as global variables.
This required `deregisterAllCharts` to be called to clear those references so that charts could be garbage collected.
dc@v5 introduces {@link ChartGroup}, an instance of {@link ChartGroup} maintains list of all related charts.
References to charts are no longer kept in global variables, so as soon as the `chartObject` instance 
and all chart instances go out of scope, these should get garbage collected without needing an explicit call to
clear the list.

It is recommended that a `chartGroup` is explicitly created for better code structuring.
If a `chartGroup` is not explicitly passed during chart creation,
the instances will be linked to the default `chartGroup`, which is a global object.

In either case the `chartGroup` is available as an attribute in each of charts.

Example for ChartRegistry to ChartGroup
