import {Selection} from 'd3-selection';

export type ColorsList = string[];

// Used for mix-ins
export type Constructor<T = {}> = new (...args: any[]) => T;

export type DCPrimitive = number | string | Date;

export type Margins = { top: number; left: number; bottom: number; right: number };

// Accessors

export type KeyAccessor =  (d: any, i?: number) => any; // TODO: check if using generics gives better type safety
export type ValueAccessor =  (d: any, i?: number) => any; // TODO: check if using generics gives better type safety
export type ColorAccessor =  (d: any, i?: number) => any;
export type RValueAccessor = (d: any, i?: number) => number;
export type LabelAccessor = (d: any, i?: number) => string|number;
export type TitleAccessor = (d: any, i?: number) => string|number;

// Scales

export interface MinimalScaleWithRange<DomainType, RangeType> {
    (x: DomainType): RangeType;

    domain (): DomainType;
    domain (newDomain: DomainType): this;

    range (): RangeType[];
    range (newRange: [RangeType, RangeType]): this;
}

export type MinimalColorScale = MinimalScaleWithRange<any, string>;

export type MinimalRadiusScale = MinimalScaleWithRange<any, number>;

// Specifically created for scales in Coordinate Grid charts
export interface MinimalXYScale extends MinimalScaleWithRange<any, number> {
    rangeRound (range: [number | { valueOf (): number }, number | { valueOf (): number }]): this;

    bandwidth? (): number;
    paddingInner? (): number;
    paddingInner? (padding: number): this;
    paddingOuter? (): number;
    paddingOuter? (padding: number): this;

    invert? (value: number | { valueOf (): number }): any;

    ticks? (count?: number): number[];

    copy (): this;
}

// Units, used by Coordinate Grid Charts
export interface Units {
    // Sometimes it returns an array
    (start: any, end: any): number|any[];

    // Used by floating point units
    resolution?: number;
}

// The most common Selection used in DC
export type SVGGElementSelection = Selection<SVGGElement, any, SVGGElement, any>;

// Used by Coordinate Grid charts
export type RoundFn = (inp:Date|number) => Date|number;

export type DCBrushSelection = [Date, Date]|[number, number];
