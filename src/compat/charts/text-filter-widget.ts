import {TextFilterWidget as TextFilterWidgetNeo} from '../../charts/text-filter-widget';
import {BaseMixinExt} from '../base/base-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

export class TextFilterWidget extends BaseMixinExt(TextFilterWidgetNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const textFilterWidget = (parent: ChartParentType, chartGroup: ChartGroupType) => new TextFilterWidget(parent, chartGroup);
