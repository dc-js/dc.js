import {BasicTransformMixin} from './basic-transform-mixin';
import {FilterMixin} from './filter-mixin';
import {CrossFilterAdapter} from './cross-filter-adapter';

export const DefaultDataProvider = BasicTransformMixin(FilterMixin(CrossFilterAdapter));
