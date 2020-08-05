import {BaseAccessor, MinimalCFDimension} from '../core/types';

export interface IBaseMixinConf {
    ordering?: BaseAccessor<any>;
    dimension?: MinimalCFDimension;
    useViewBoxResizing?: boolean;
    minWidth?: number;
    minHeight?: number;
}
