import {IBaseMixinConf} from '../base/i-base-mixin-conf';
import {BaseAccessor, CompareFn, DataTableColumnSpec} from '../core/types';

export interface IDataTableConf extends IBaseMixinConf {
    readonly section?: BaseAccessor<string>;
    readonly showSections?: boolean;
    readonly endSlice?: number;
    readonly beginSlice?: number;
    readonly order?: CompareFn;
    readonly sortBy?: BaseAccessor<any>;
    readonly columns?: DataTableColumnSpec[];
    readonly size?: number;
}
