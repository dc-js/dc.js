import { Legend as LegendNeo } from '../../charts/legend.js';

export class Legend extends LegendNeo {
    constructor() {
        super();
    }
}

export const legend = () => new Legend();
