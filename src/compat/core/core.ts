import { config } from './config.js';

export * from '../../core/core.js';

export function renderlet(_?: (arg0?) => void): (arg0) => void {
    if (!arguments.length) {
        // @ts-ignore
        return config._renderlet;
    }
    // @ts-ignore
    config._renderlet = _;
    return null;
}
