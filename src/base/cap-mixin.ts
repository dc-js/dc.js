import { sum } from "d3-array";
import { Constructor } from "../core/types";
import { ICapMixinConf } from "./i-cap-mixin-conf";
import { IBaseMixinConf } from "./i-base-mixin-conf";
import { CFSimpleAdapter } from "../data/c-f-simple-adapter";
import { sortBy } from "../core/utils";
import { CFDataCapHelper } from "../data/c-f-data-cap-helper";

interface MinimalBase {
    configure(conf: IBaseMixinConf);
    onClick(d: any);
    filter(arg0: any[]);
    dataProvider(): CFSimpleAdapter;
    dataProvider(dataProvider: CFSimpleAdapter): this;
}

/**
 * Cap is a mixin that groups small data elements below a _cap_ into an *others* grouping for both the
 * Row and Pie Charts.
 *
 * The top ordered elements in the group up to the cap amount will be kept in the chart, and the rest
 * will be replaced with an *others* element, with value equal to the sum of the replaced values. The
 * keys of the elements below the cap limit are recorded in order to filter by those keys when the
 * others* element is clicked.
 * @mixin CapMixin
 * @param {Object} Base
 * @returns {CapMixin}
 */
// tslint:disable-next-line:variable-name
export function CapMixin<TBase extends Constructor<MinimalBase>>(Base: TBase) {
    // @ts-ignore
    return class extends Base {
        public _conf: ICapMixinConf;

        constructor(...args: any[]) {
            super();

            this.dataProvider(new CFDataCapHelper());
        }

        public configure(conf: ICapMixinConf): this {
            super.configure(conf);
            return this;
        }

        public conf(): ICapMixinConf {
            return this._conf;
        }
    };
}
