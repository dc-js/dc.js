import { IBaseMixinConf } from '../base/i-base-mixin-conf.js';
import { BaseAccessor } from '../core/types.js';

export interface ITextFilterWidgetConf extends IBaseMixinConf {
    readonly placeHolder?: string;
    readonly filterFunctionFactory?: (query) => BaseAccessor<boolean>;
    readonly normalize?: BaseAccessor<string>;
}
