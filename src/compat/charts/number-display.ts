import {NumberDisplay as NumberDisplayNeo} from '../../charts/number-display';
import {BaseMixinExt} from '../base/base-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

export class NumberDisplay extends BaseMixinExt(NumberDisplayNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const numberDisplay = (parent: ChartParentType, chartGroup: ChartGroupType) => new NumberDisplay(parent, chartGroup);
