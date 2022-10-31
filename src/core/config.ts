import { timeFormat } from 'd3-time-format';

import { logger } from './logger.js';
import { ColorsList } from './types.js';
import { format } from 'd3-format';

/**
 * General configuration
 */
export class Config {
    /**
     * The default date format for dc.js,
     * by default d3.timeFormat('%m/%d/%Y')
     */
    public dateFormat: (date: Date) => string;

    /**
     * The default floating point format for dc.js.
     */
    public floatFormat = format('.2f');

    /**
     * If this boolean is set truthy, all transitions will be disabled, and changes to the charts will happen
     * immediately.
     */
    public disableTransitions: boolean;

    private _defaultColors: ColorsList;

    constructor() {
        this._defaultColors = Config._schemeCategory20c;

        this.dateFormat = timeFormat('%m/%d/%Y');

        this.disableTransitions = false;
    }

    /**
     * Set the default color scheme for ordinal charts. Changing it will impact all ordinal charts.
     *
     * By default it is set to a copy of
     * `d3.schemeCategory20c` for backward compatibility. This color scheme has been
     * [removed from D3v5](https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50).
     * In DC 3.1 release it will change to a more appropriate default.
     *
     * @example
     * ```
     * config.defaultColors(d3.schemeSet1)
     * ```
     */
    public defaultColors(): ColorsList;
    public defaultColors(colors: ColorsList): this;
    public defaultColors(colors?) {
        if (!arguments.length) {
            // Issue warning if it uses _schemeCategory20c
            if (this._defaultColors === Config._schemeCategory20c) {
                logger.warnOnce(
                    'You are using d3.schemeCategory20c, which has been removed in D3v5. ' +
                        'See the explanation at https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50. ' +
                        'DC is using it for backward compatibility, however it will be changed in DCv3.1. ' +
                        'You can change it by calling dc.config.defaultColors(newScheme). ' +
                        'See https://github.com/d3/d3-scale-chromatic for some alternatives.'
                );
            }
            return this._defaultColors;
        }
        this._defaultColors = colors;
        return this;
    }

    // D3v5 has removed schemeCategory20c, copied here for backward compatibility
    // prettier-ignore
    public static _schemeCategory20c: ColorsList = [
        '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d',
        '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476',
        '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc',
        '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9'];
}

/**
 * General configuration object; see {@link Config} for members.
 */
export const config = new Config();
