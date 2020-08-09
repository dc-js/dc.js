import {BaseAccessor, KeyAccessor, LabelAccessor, MinimalCFDimension, ValueAccessor} from '../core/types';

export interface IBaseMixinConf {
    readonly valueAccessor?: ValueAccessor;
    readonly keyAccessor?: KeyAccessor;
    readonly renderTitle?: boolean;
    readonly label?: LabelAccessor;
    readonly renderLabel?: boolean;
    readonly resetFilterHandler?: (filters: any) => any[];
    readonly addFilterHandler?: (filters: any, filter: any) => any;
    readonly removeFilterHandler?: (filters: any, filter: any) => any;
    readonly filterHandler?: (dimension: MinimalCFDimension, filters: any) => any;
    readonly hasFilterHandler?: (filters, filter) => boolean;
    readonly commitHandler?: (render: boolean, callback: (error: any, result: any) => void) => void;
    readonly controlsUseVisibility?: boolean;
    readonly transitionDelay?: number;
    readonly transitionDuration?: number;
    readonly filterPrinter?: (filters: any) => string;
    readonly ordering?: BaseAccessor<any>;
    readonly dimension?: MinimalCFDimension;
    readonly useViewBoxResizing?: boolean;
    readonly minWidth?: number;
    readonly minHeight?: number;
}
