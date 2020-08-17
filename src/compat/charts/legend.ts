import { Legend as LegendNeo } from '../../charts/legend';

export class Legend extends LegendNeo {
    constructor() {
        super();
    }
}

export const legend = () => new Legend();
