import { IBaseMixinConf } from '../base/i-base-mixin-conf.js';
import { BaseAccessor, CompareFn } from '../core/types.js';

export interface ISelectMenuConf extends IBaseMixinConf {
    readonly order?: CompareFn;
    readonly filterDisplayed?: BaseAccessor<boolean>;
    readonly numberVisible?: number;
    readonly promptValue?: string;
    readonly multiple?: boolean;
    readonly promptText?: string;
}
