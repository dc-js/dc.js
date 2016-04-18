// Import everything
import * as d3 from 'd3';
import './style/dc.scss';
import {Exception, InvalidStateException, BadArgumentException} from './src/errors';
import trigger from './src/events';
import {RangedFilter, RangedTwoDimensionalFilter, TwoDimensionalFilter} from './src/filters';
import {enableDebugLog, warn, debug, deprecate} from './src/logger';
import baseMixin from './src/base-mixin';
import bubbleMixin from './src/bubble-mixin';
import capMixin from './src/cap-mixin';
import colorMixin from './src/color-mixin';
import coordinateGridMixin from './src/coordinate-grid-mixin';
import marginMixin from './src/margin-mixin';
import stackMixin from './src/stack-mixin';
import d3box from './src/d3.box';

// Utils
export * from './src/core';
export const errors = {
    Exception,
    InvalidStateException,
    BadArgumentException
};
export const events = {
    trigger
};
export const filters = {
    RangedFilter,
    RangedTwoDimensionalFilter,
    TwoDimensionalFilter
};
export const logger = {
    enableDebugLog,
    warn,
    debug,
    deprecate
};
export * from './src/utils';

// Legend
export {default as legend} from './src/legend';

// Mixins
export {baseMixin, baseMixin as baseChart};
export {bubbleMixin, bubbleMixin as abstractBubbleChart};
export {capMixin, capMixin as capped};
export {colorMixin, colorMixin as colorChart};
export {coordinateGridMixin, coordinateGridMixin as coordinateGridChart};
export {marginMixin, marginMixin as marginable};
export {stackMixin, stackMixin as stackableChart};

// Charts
export {default as barChart} from './src/bar-chart';
export {default as boxPlot} from './src/box-plot';
export {default as bubbleChart} from './src/bubble-chart';
export {default as bubbleOverlay} from './src/bubble-overlay';
export {default as compositeChart} from './src/composite-chart';
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

d3.box = d3box;
