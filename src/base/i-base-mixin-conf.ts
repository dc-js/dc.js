import { KeyAccessor, LabelAccessor, SizeT, TitleAccessor } from '../core/types.js';

export interface IBaseMixinConf {
    readonly keyAccessor?: KeyAccessor;
    readonly renderTitle?: boolean;
    readonly title?: TitleAccessor;
    readonly label?: LabelAccessor;
    readonly renderLabel?: boolean;
    readonly commitHandler?: (render: boolean, callback: (error: any, result: any) => void) => void;
    readonly controlsUseVisibility?: boolean;
    readonly transitionDelay?: number;
    readonly transitionDuration?: number;
    readonly filterPrinter?: (filters: any) => string;
    readonly useViewBoxResizing?: boolean;
    readonly width?: number;
    readonly height?: number;
    readonly minWidth?: number;
    readonly minHeight?: number;
    readonly beforeResize?: (rect: SizeT) => SizeT;
}
