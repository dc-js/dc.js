// Need rollup-plugin-json for the following magic
export {version} from '../package.json';

export * from './index';
import './compat/d3v5';
import './compat/d3v6';