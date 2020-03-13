import {BasicTransformMixin} from './basic-transform-mixin';
import {FilterMixin} from './filter-mixin';
import {CrossFilterAdapter} from './cross-filter-adapter';
import {CapperMixin} from './capper-mixin';

export const DefaultDataProvider = BasicTransformMixin(FilterMixin(CrossFilterAdapter));
export const CappedDataProvider = CapperMixin(DefaultDataProvider);
