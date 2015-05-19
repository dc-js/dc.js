// Import DC and dependencies

export * from './src/core';
export * from './src/errors';
export {default as events} from './src/events';
export * from './src/filters';
export * from './src/logger';
export * from './src/utils';

export {default as legend} from './src/legend';

export {default as baseMixin} from './src/base-mixin';
export {default as bubbleMixin} from './src/bubble-mixin';
export {default as capMixin} from './src/cap-mixin';
export {default as colorMixin} from './src/color-mixin';
export {default as coordinateGridMixin} from './src/coordinate-grid-mixin';
export {default as marginMixin} from './src/margin-mixin';
export {default as stackMixin} from './src/stack-mixin';

export {default as compositeChart} from './src/composite-chart';

export {default as barChart} from './src/bar-chart';
export {default as boxPlot} from './src/box-plot';
export {default as bubbleChart} from './src/bubble-chart';
export {default as bubbleOverlay} from './src/bubble-overlay';
export {default as dataCount} from './src/data-count';
export {default as dataGrid} from './src/data-grid';
export {default as dataTable} from './src/data-table';
export {default as geoChoroplethChart} from './src/geo-choropleth-chart';
export {default as heatMap} from './src/heatmap';
export {default as lineChart} from './src/line-chart';
export {default as numberDisplay} from './src/number-display';
export {default as pieChart} from './src/pie-chart';
export {default as rowChart} from './src/row-chart';
export {default as scatterPlot} from './src/scatter-plot';
export {default as seriesChart} from './src/series-chart';

//
//dc.abstractBubbleChart = dc.bubbleMixin;
//dc.baseChart = dc.baseMixin;
//dc.capped = dc.capMixin;
//dc.colorChart = dc.colorMixin;
//dc.coordinateGridChart = dc.coordinateGridMixin;
//dc.marginable = dc.marginMixin;
//dc.stackableChart = dc.stackMixin;
