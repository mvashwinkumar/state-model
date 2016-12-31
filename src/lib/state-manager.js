import {Diff} from './diff'

export class Manager {
    constructor(obj) {
        let initialDiff = new Diff(null, obj);
        this.lastSavedModel = obj;
        this.currentModel = obj;
        this.diffs = [];
        this.diffs.push(initialDiff);
    }
}