import {IBaseMixinConf} from '../base/i-base-mixin-conf';
import {BaseAccessor} from '../core/types';

export interface ITextFilterWidgetConf extends IBaseMixinConf {
    readonly placeHolder?: string;
    readonly filterFunctionFactory?: (query) => BaseAccessor<boolean>;
    readonly normalize?: BaseAccessor<string>;
}
