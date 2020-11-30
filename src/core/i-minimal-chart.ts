export interface IMinimalChart {
    render(): void;
    redraw(): void;
    filterAll(): void;
    focus?(): void;
    dispose?(): void;
}
