import { MinimalCFDimension } from '../core/types.js';
import { FilterHandler } from './filter-handler.js';

export interface ICFFilterHandlerConf {
    dimension?: MinimalCFDimension;
}

export class CFFilterHandler extends FilterHandler {
    protected _conf: ICFFilterHandlerConf;

    constructor(conf: ICFFilterHandlerConf = {}) {
        super();
        this.configure(conf);
    }
    public configure(conf: ICFFilterHandlerConf): this {
        this._conf = { ...this._conf, ...conf };
        return this;
    }

    public conf(): ICFFilterHandlerConf {
        return this._conf;
    }

    public applyFilters() {
        if (!(this._conf.dimension && this._conf.dimension.filter)) {
            return;
        }

        if (this.filters.length === 0) {
            this._conf.dimension.filter(null);
        } else if (this.filters.length === 1 && !this.filters[0].isFiltered) {
            // single value and not a function-based filter
            this._conf.dimension.filterExact(this.filters[0]);
        } else if (this.filters.length === 1 && this.filters[0].filterType === 'RangedFilter') {
            // single range-based filter
            this._conf.dimension.filterRange(this.filters[0]);
        } else {
            this._conf.dimension.filterFunction(d => {
                for (let i = 0; i < this.filters.length; i++) {
                    const filter = this.filters[i];
                    if (filter.isFiltered) {
                        if (filter.isFiltered(d)) {
                            return true;
                        }
                    } else if (filter <= d && filter >= d) {
                        return true;
                    }
                }
                return false;
            });
        }
    }
}
