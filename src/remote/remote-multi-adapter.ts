import { RemoteSimpleAdapter } from './remote-simple-adapter.js';

export class RemoteMultiAdapter extends RemoteSimpleAdapter {
    layers() {
        return this.data().map(l => ({ name: l.name }));
    }
}
