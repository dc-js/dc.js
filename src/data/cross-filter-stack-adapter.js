import {CrossFilterSimpleAdapter} from './cross-filter-simple-adapter';

export class CrossFilterStackAdapter extends CrossFilterSimpleAdapter {
    constructor () {
        super();
        this._stack = [];
    }

    data () {
        // return this.stack().map(layer => Object.assign({}, layer));
        return this._stack.map((layer, index) => {
            // Defensively clone
            const rawData = layer.group.all().map(d=> Object.assign({}, d));
            return {
                name: layer.name,
                accessor: layer.accessor,
                rawData: rawData
            }
        });
    }

    stack (group, name, accessor) {
        if (!arguments.length) {
            return this._stack;
        }

        if (arguments.length <= 2) {
            accessor = name;
        }

        const layer = {group: group};
        if (typeof name === 'string') {
            layer.name = name;
        } else {
            // Name is quite critical, it is used to uniquely identify the layer
            layer.name = String(this._stack.length);
        }
        if (typeof accessor === 'function') {
            layer.accessor = accessor;
        }
        this._stack.push(layer);

        return this;
    }

    clearStack () {
        this._stack = [];
    }
}
