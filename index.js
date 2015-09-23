// Import DC and dependencies

export * from './src/core';
import {Exception, InvalidStateException} from './src/errors';
export var errors = {
    Exception: Exception,
    InvalidStateException: InvalidStateException
};
import trigger from './src/events';
export var events = {
    trigger: trigger
};
import {rangedFilter, rangedTwoDimensionalFilter, twoDimensionalFilter} from './src/filters';
export var filters = {
    RangedFilter: rangedFilter,
    RangedTwoDimensionalFilter: rangedTwoDimensionalFilter,
    TwoDimensionalFilter: twoDimensionalFilter
};
import {enableDebugLog, warn, debug, deprecate} from './src/logger';
export var logger = {
    enableDebugLog: enableDebugLog,
    warn: warn,
    debug: debug,
    deprecate: deprecate
};
export * from './src/utils';

export {default as legend} from './src/legend';

import baseMixin from './src/base-mixin';
export {baseMixin, baseMixin as baseChart};
import bubbleMixin from './src/bubble-mixin';
export {bubbleMixin, bubbleMixin as abstractBubbleChart};
import capMixin from './src/cap-mixin';
export {capMixin, capMixin as capped};
import colorMixin from './src/color-mixin';
export {colorMixin, colorMixin as colorChart};
import coordinateGridMixin from './src/coordinate-grid-mixin';
export {coordinateGridMixin, coordinateGridMixin as coordinateGridChart};
import marginMixin from './src/margin-mixin';
export {marginMixin, marginMixin as marginable};
import stackMixin from './src/stack-mixin';
export {stackMixin, stackMixin as stackableChart};

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
export {default as selectMenu} from './src/select-menu';

import * as d3 from 'd3';
import d3box from './src/d3.box';
d3.box = d3box;
