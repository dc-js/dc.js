import {DataGrid as DataGridNeo} from '../../charts/data-grid';
import {BaseMixinExt} from '../base/base-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

// @ts-ignore, remove after group method is moved here
export class DataGrid extends BaseMixinExt(DataGridNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const dataGrid = (parent: ChartParentType, chartGroup: ChartGroupType) => new DataGrid(parent, chartGroup);
