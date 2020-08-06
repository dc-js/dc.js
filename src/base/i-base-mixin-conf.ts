import {BaseAccessor, KeyAccessor, LabelAccessor, MinimalCFDimension} from '../core/types';

export interface IBaseMixinConf {
    keyAccessor?: KeyAccessor;
    renderTitle?: boolean;
    label?: LabelAccessor;
    renderLabel?: boolean;
    resetFilterHandler?: (filters: any) => any[];
    addFilterHandler?: (filters: any, filter: any) => any;
    removeFilterHandler?: (filters: any, filter: any) => any;
    filterHandler?: (dimension: MinimalCFDimension, filters: any) => any;
    hasFilterHandler?: (filters, filter) => boolean;
    commitHandler?: (render: boolean, callback: (error: any, result: any) => void) => void;
    controlsUseVisibility?: boolean;
    transitionDelay?: number;
    transitionDuration?: number;
    filterPrinter?: (filters: any) => string;
    ordering?: BaseAccessor<any>;
    dimension?: MinimalCFDimension;
    useViewBoxResizing?: boolean;
    minWidth?: number;
    minHeight?: number;
}
