import { config } from './config';

export * from '../../core/core';

export function renderlet(_?: (arg0?) => void): (arg0) => void {
    if (!arguments.length) {
        // @ts-ignore
        return config._renderlet;
    }
    // @ts-ignore
    config._renderlet = _;
    return null;
}
