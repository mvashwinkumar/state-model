import _ from 'lodash'

const OPTIONS = {
    MAXSIZE : {
        OPT : 'maxSize',
        INF : Infinity
    },
    KEY : {
        OPT : 'key',
        ID : 'id'
    },
    COLLTYPE : {
        OPT : 'collectionType',
        OBJECT : 'Object'
    },
    OVERFLOW : {
        OPT : 'overflow',
        SILENT : 'silent'
    }
};

let defaultOpts = {};
defaultOpts[OPTIONS.MAXSIZE.OPT] = OPTIONS.MAXSIZE.INF;
defaultOpts[OPTIONS.KEY.OPT] = OPTIONS.KEY.ID;
defaultOpts[OPTIONS.COLLTYPE.OPT] = OPTIONS.COLLTYPE.OBJECT;
defaultOpts[OPTIONS.OVERFLOW.OPT] = OPTIONS.OVERFLOW.SILENT;

// function _next() {}

// function _prev() {}

// function _resolvePtr(ptr, maxSize) {}

// function _isInstance(obj) {}

// function _handleOverflow(obj) {}

// function _handleUnderflow() {}

export class CircularQueue {
    // options - max data size : non-negative number || Infinity
    // options - key : class member to search with peek || id
    // options - collectionType : allowed object instance of a class || Object
    // options - overflow : behaviour on overflow is throw err, override last  || throw err
    constructor(list, opts) {
        this.data = _.cloneDeep(list);
        this.opts = _.extend(defaultOpts, opts);
        this.lastPtr = this.data.length - 1; // 0-based index
        this.topPtr = 0;
    }

    push(obj) {
        return false;
    }

    pop() {
        return false;
    }

    find(key) {
        return false;
    }

    replace(startKey, numObjs, replaceObjs) {
        // replaces the data with replaceObjs in collection from startKey until numObjs
        // if size different, then resize collection elements
        return false;
    }

}