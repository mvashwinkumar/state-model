import {Diff} from './diff'
import {CircularQueue} from './circular-queue'

export class Manager {
    constructor(obj, opts) {
        let initialDiff = new Diff(null, obj);
        this.currentModel = obj;
        this.dcq = new CircularQueue([initialDiff], opts);
    }

    getState(num) {
        return this.dcq.peek(num);
    }
}