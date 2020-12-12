import { IFilterStorage } from './i-filter-storage';
import { IMinimalChart } from './i-minimal-chart';

export interface IChartGroup {
    register(chart: IMinimalChart): void;
    deregister(chart: IMinimalChart): void;
    renderAll(): void;
    redrawAll(): void;
    filterAll(): void;
    refocusAll(): void;
    filterStorage: IFilterStorage;
    beforeRedrawAll: () => Promise<void>;
    beforeRenderAll: () => Promise<void>;
    renderlet: () => void;
}
