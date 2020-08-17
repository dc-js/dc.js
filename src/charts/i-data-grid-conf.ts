import { IBaseMixinConf } from '../base/i-base-mixin-conf';
import { BaseAccessor, CompareFn, GroupingFn } from '../core/types';

export interface IDataGridConf extends IBaseMixinConf {
    readonly order?: CompareFn;
    readonly htmlSection?: BaseAccessor<string>;
    readonly sortBy?: BaseAccessor<any>;
    readonly html?: BaseAccessor<string>;
    readonly endSlice?: number;
    readonly beginSlice?: number;
    readonly size?: number;
    readonly section?: GroupingFn;
}
