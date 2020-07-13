
// Used for mix-ins
export type Constructor<T = {}> = new (...args: any[]) => T;

export type DCPrimitive = number | string | Date;

export type Margins = { top: number; left: number; bottom: number; right: number };

export type KeyAccessor =  (d: any, i?: number) => any; // TODO: check if using generics gives better type safety
export type ValueAccessor =  (d: any, i?: number) => any; // TODO: check if using generics gives better type safety
export type ColorAccessor =  (d: any, i?: number) => any;

export interface MinimalColorScale {
    (x: any): string;

    // TODO: after refactoring we may not need it
    domain(): any;
    domain(newDomain: any): this;
}
