import {BaseAccessor, MinimalCFDimension} from '../core/types';

export interface IBaseMixinConf {
    transitionDelay?: number;
    transitionDuration?: number;
    filterPrinter?: (filters: any) => string;
    ordering?: BaseAccessor<any>;
    dimension?: MinimalCFDimension;
    useViewBoxResizing?: boolean;
    minWidth?: number;
    minHeight?: number;
}
