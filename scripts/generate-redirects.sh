#!/usr/bin/env bash

OLDIES="dc.barChart.html
dc.baseMixin.html
dc.boxPlot.html
dc.bubbleChart.html
dc.bubbleMixin.html
dc.bubbleOverlay.html
dc.capMixin.html
dc.cboxMenu.html
dc.chartRegistry.html
dc.colorMixin.html
dc.compositeChart.html
dc.config.html
dc.coordinateGridMixin.html
dc.dataCount.html
dc.dataGrid.html
dc.dataTable.html
dc.filters.HierarchyFilter.html
dc.filters.html
dc.filters.RangedFilter.html
dc.filters.RangedTwoDimensionalFilter.html
dc.filters.TwoDimensionalFilter.html
dc.geoChoroplethChart.html
dc.heatMap.html
dc.htmlLegend.html
dc.legend.html
dc.lineChart.html
dc.logger.html
dc.marginMixin.html
dc.numberDisplay.html
dc.pieChart.html
dc.printers.html
dc.rowChart.html
dc.scatterPlot.html
dc.selectMenu.html
dc.seriesChart.html
dc.stackMixin.html
dc.sunburstChart.html
dc.textFilterWidget.html
dc.units.fp.html
dc.units.html
dc.utils.html"

generate () {
    echo "<html><script>window.location.href = '$2#' + window.location.href.split('#')[1]</script></html>" > $1
}

for f in $OLDIES; do
    g=`echo $f | sed s:^dc\.::`
    if echo $g | grep filters > /dev/null; then
        generate web/docs/html/$f $g
    else
        generate web/docs/html/$f ${g^}
    fi
done

generate web/docs/html/dc.html global.html
