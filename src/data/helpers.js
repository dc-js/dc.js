import {BasicTransformMixin} from './basic-transform-mixin';
import {FilterMixin} from './filter-mixin';
import {CrossFilterSimpleAdapter} from './cross-filter-simple-adapter';
import {CapperMixin} from './capper-mixin';
import {CrossFilterStackAdapter} from './cross-filter-stack-adapter';

export const SimpleDataProvider = BasicTransformMixin(FilterMixin(CrossFilterSimpleAdapter));
export const CappedDataProvider = CapperMixin(SimpleDataProvider);
export const StackedDataProvider = FilterMixin(CrossFilterStackAdapter);
