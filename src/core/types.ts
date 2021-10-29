import { Selection } from 'd3-selection';
import { BaseMixin } from '../base/base-mixin';
import { IChartGroup } from './i-chart-group';

export type ChartParentType = string | BaseMixin | Selection<Element, undefined, Element, unknown>;

export type ChartGroupType = string | IChartGroup;

export type ColorsList = string[];

export interface MinimalCFDimension {
    filter(value): this;
    filterExact(value): this;
    filterRange(value: any[]): this;
    filterFunction(value: (k) => any): this;
    // filterAll(): this; // unused
    top(k: number): any[];
    bottom(k: number): any[];
}

export interface CFGrouping {
    key: any;
    value?: any; // Original as given by CrossFilter
    _value?: any; // After applying valueAccessor
}

export interface MinimalCFGroup {
    all(): ReadonlyArray<CFGrouping>;
}

// Used for mix-ins
export type Constructor<T = {}> = new (...args: any[]) => T;

export type DCPrimitive = number | string | Date;

export type Margins = { top: number; left: number; bottom: number; right: number };

export interface CompareFn {
    (a: number, b: number): number;
    (a: string, b: string): number;
    (a: Date, b: Date): number;
    <T>(a: T, b: T): number;
}

export type GroupingFn = (d) => any;

// Accessors

export type BaseAccessor<T> = (d: any, i?: number) => T;
export type KeyAccessor = BaseAccessor<any>; // TODO: check if using generics gives better type safety
export type ValueAccessor = BaseAccessor<any>; // TODO: check if using generics gives better type safety
export type ColorAccessor = BaseAccessor<any>;
export type RValueAccessor = BaseAccessor<number>;
export type LabelAccessor = BaseAccessor<string | number>;
export type TitleAccessor = BaseAccessor<string | number>;

// Scales

export interface MinimalScaleWithRange<DomainType, RangeType> {
    (x: DomainType): RangeType;

    domain(): DomainType;
    domain(newDomain: DomainType): this;

    range(): RangeType[];
    range(newRange: [RangeType, RangeType]): this;
}

export type MinimalColorScale = MinimalScaleWithRange<any, string>;

export type MinimalRadiusScale = MinimalScaleWithRange<any, number>;

// Specifically created for scales in Coordinate Grid charts
export interface MinimalXYScale extends MinimalScaleWithRange<any, number> {
    rangeRound(range: [number | { valueOf(): number }, number | { valueOf(): number }]): this;

    bandwidth?(): number;
    paddingInner?(): number;
    paddingInner?(padding: number): this;
    paddingOuter?(): number;
    paddingOuter?(padding: number): this;

    invert?(value: number | { valueOf(): number }): any;

    ticks?(count?: number): number[];

    copy(): this;
}

// Units, used by Coordinate Grid Charts
export interface IUnits {
    // Sometimes it returns an array
    (start: any, end: any): number | any[];

    // Used by floating point units
    resolution?: number;
}

// The most common Selection used in DC
export type SVGGElementSelection = Selection<SVGGElement, any, SVGGElement, any>;

// Used by Coordinate Grid charts

// TODO: convert to two alternate signatures for Date and number
export type RoundFn = (inp: Date | number) => Date | number;

// TODO: handle 2D brush selection as well - as in ScatterPlot
export type DCBrushSelection = [Date, Date] | [number, number];

// Used by BoxPlot
export type BoxWidthFn = (effectiveWitdh: number, noOfBoxes: number) => number;

export type NumberFormatFn = (n: number | { valueOf(): number }) => string;

// Legends
export interface ParentOfLegend {
    legendToggle: (d: LegendItem) => void;
    legendReset: (d: LegendItem) => void;
    legendHighlight: (d: LegendItem) => void;
    filters; // function, TODO: signature
    legendables: () => LegendItem[];

    svg(): Selection<SVGElement, any, any, any>;
}

export interface LegendItem {
    others?; // TODO: will not be needed after refactoring
    name: string;
    data?;
    chart: ParentOfLegend;
    color?: string;
    dashstyle?;
}

export type LegendTextAccessor = (d: LegendItem) => string;

// BubbleOverlay
export type BubblePoint = { name: string; x: number; y: number };

// DataCount
export interface DataCountHTMLOptions {
    all: string;
    some: string;
}

// DataTable
export type DataTableColumnSpec =
    | ((d) => string)
    | string
    | { label: string; format: (d) => string };

// GeoChoroplethChart
export interface IGeoJson {
    data;
    name: string;
    keyAccessor: BaseAccessor<any>;
}

// HeatMap
export type HeatMapClickHandler = (d: any) => void;
