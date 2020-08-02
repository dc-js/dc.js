import {DataTable as DataTableNeo} from '../../charts/data-table';
import {BaseMixinExt} from '../base/base-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

// @ts-ignore, remove after group method is moved here
export class DataTable extends BaseMixinExt(DataTableNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const dataTable = (parent: ChartParentType, chartGroup: ChartGroupType) => new DataTable(parent, chartGroup);
