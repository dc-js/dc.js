import {BasicTransformMixin} from './basic-transform-mixin';
import {FilterMixin} from './filter-mixin';
import {CrossFilterSimpleAdapter} from './cross-filter-simple-adapter';
import {CapperMixin} from './capper-mixin';

export const SimpleDataProvider = BasicTransformMixin(FilterMixin(CrossFilterSimpleAdapter));
export const CappedDataProvider = CapperMixin(SimpleDataProvider);
