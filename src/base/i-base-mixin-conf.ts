import {MinimalCFDimension, MinimalCFGroup} from '../core/types';

export interface IBaseMixinConf {
    dimension?: MinimalCFDimension;
    useViewBoxResizing?: boolean;
    minWidth?: number;
    minHeight?: number;
}
