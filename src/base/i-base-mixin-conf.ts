import { KeyAccessor, LabelAccessor, TitleAccessor } from '../core/types';

export interface IBaseMixinConf {
    readonly keyAccessor?: KeyAccessor;
    readonly renderTitle?: boolean;
    readonly title?: TitleAccessor;
    readonly label?: LabelAccessor;
    readonly renderLabel?: boolean;
    readonly groupName?: string;
    readonly commitHandler?: (render: boolean, callback: (error: any, result: any) => void) => void;
    readonly controlsUseVisibility?: boolean;
    readonly transitionDelay?: number;
    readonly transitionDuration?: number;
    readonly filterPrinter?: (filters: any) => string;
    readonly useViewBoxResizing?: boolean;
    readonly minWidth?: number;
    readonly minHeight?: number;
}
