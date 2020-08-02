import {CboxMenu as CboxMenuNeo} from '../../charts/cbox-menu';
import {BaseMixinExt} from '../base/base-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

export class CboxMenu extends BaseMixinExt(CboxMenuNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const cboxMenu = (parent: ChartParentType, chartGroup: ChartGroupType) => new CboxMenu(parent, chartGroup);
