import {BaseAccessor, MinimalCFDimension} from '../core/types';

export interface IBaseMixinConf {
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
