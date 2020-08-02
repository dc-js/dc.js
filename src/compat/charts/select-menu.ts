import {SelectMenu as SelectMenuNeo} from '../../charts/select-menu';
import {BaseMixinExt} from '../base/base-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

export class SelectMenu extends BaseMixinExt(SelectMenuNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const selectMenu = (parent: ChartParentType, chartGroup: ChartGroupType) => new SelectMenu(parent, chartGroup);
