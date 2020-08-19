import { BaseAccessor } from '../../core/types';

export interface IColorHelper {
    getColor(d, i?: number): string;
    colorAccessor: BaseAccessor<string>;
}
