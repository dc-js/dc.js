import {DataCount as DataCountNeo} from '../../charts/data-count';
import {logger} from '../../core/logger';
import {BaseMixinExt} from '../base/base-mixin';

export class DataCount extends BaseMixinExt(DataCountNeo) {
    public dimension ();
    public dimension (cf): this;
    public dimension (cf?) {
        logger.warnOnce('consider using dataCount.crossfilter instead of dataCount.dimension for clarity');
        if (!arguments.length) {
            return this.crossfilter();
        }
        return this.crossfilter(cf);
    }

    public group ();
    public group (groupAll): this;
    public group (groupAll?) {
        logger.warnOnce('consider using dataCount.groupAll instead of dataCount.group for clarity');
        if (!arguments.length) {
            return this.groupAll();
        }
        return this.groupAll(groupAll);
    }
}

export const dataCount = (parent, chartGroup) => new DataCount(parent, chartGroup);
