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
        OBJECT : Object
    },
    OVERFLOW : {
        OPT : 'overflow',
        SILENT : 'silent',
        THROW : 'throw'
    }
};

const ERR = {
    NOT_INSTANCE : 'NOT_INSTANCE : This object is not an instance of collection type',
    EMPTY : 'EMPTY : This queue is empty',
    FULL : 'FULL : This queue at full capacity',
    INVALID_ARG : 'INVALID_ARG : Invalid Argument(s)',
    KEY_NOT_FOUND : 'KEY_NOT_FOUND : Requested key not found in queue',
    REPLACE_OVERFLOW : 'REPLACE_OVERFLOW : More objects to replace than found from startKey'
};

let defaultOpts = {};
defaultOpts[OPTIONS.MAXSIZE.OPT] = OPTIONS.MAXSIZE.INF;
defaultOpts[OPTIONS.KEY.OPT] = OPTIONS.KEY.ID;
defaultOpts[OPTIONS.COLLTYPE.OPT] = OPTIONS.COLLTYPE.OBJECT;
defaultOpts[OPTIONS.OVERFLOW.OPT] = OPTIONS.OVERFLOW.SILENT;

function _next() {
    let afterLastPtr = _resolvePtr(this.lastPtr + 1, this.opts[OPTIONS.MAXSIZE.OPT]);
    if(afterLastPtr == (this.topPtr)) {
        return false;
    } else {
        this.lastPtr = afterLastPtr;
        return true;
    }
}

function _prev() {
    let beforeTopPtr = _resolvePtr(this.topPtr - 1, this.opts[OPTIONS.MAXSIZE.OPT]);
    if(beforeTopPtr == (this.lastPtr)) {
        return false;
    } else {
        this.topPtr = beforeTopPtr;
        return true;
    }
}

function _resolvePtr(ptr, maxSize) {
    if(ptr >= 0) {
        return ptr % maxSize;
    } else {
        return (maxSize + ptr);
    }
}

function _isInstance(obj) {
    return obj instanceof this.opts[OPTIONS.COLLTYPE.OPT];
}

function _handleOverflow(obj) {
    if(this.opts[OPTIONS.OVERFLOW.OPT] === OPTIONS.OVERFLOW.SILENT) {
        let maxSize = this.opts[OPTIONS.MAXSIZE.OPT];
        this.lastPtr = _resolvePtr(this.lastPtr + 1, maxSize);
        this.topPtr = _resolvePtr(this.topPtr - 1, maxSize);
        this.data[this.lastPtr] = _.cloneDeep(obj);
        return true;
    } else {
        throw new Error(ERR.FULL);
    }
}

function _handleUnderflow() {
    throw new Error(ERR.EMPTY);
}

export class CircularQueue {
    // options - max data size : non-negative number || Infinity
    // options - key : class member to search with peek || id
    // options - collectionType : allowed object instance of a class || Object
    // options - overflow : behaviour on overflow is throw err, override top  || throw err
    constructor(list, opts) {
        this.data = _.cloneDeep(list);
        this.opts = _.extend(defaultOpts, opts);
        this.lastPtr = this.data.length - 1; // 0-based index
        this.topPtr = 0;
    }

    enqueue(obj) {
        if(!_isInstance.call(this, obj)) {
            throw new Error(ERR.NOT_INSTANCE);
        }
        if(_next.call(this)) {
            this.data[this.lastPtr] = _.cloneDeep(obj);
            return true;
        } else {
            return _handleOverflow.call(this, obj);
        }
    }

    dequeue() {
        let top = this.data[this.topPtr];
        this.data[this.topPtr] = null;
        if(_prev.call(this)) {
            return top;
        } else {
            return _handleUnderflow.call(this);
        }
    }

    peek(num) {
        if(num > 0) {
            return false;
        }
        let ptr = _resolvePtr(this.topPtr + num, this.opts[OPTIONS.MAXSIZE.OPT]);
        return _.cloneDeep(this.data[ptr]);
    }

    find(key) {
        // returns the reference to the data instance with matching key as defined in options
        return _.find(this.data, (obj) => key === obj[this.opts[OPTIONS.KEY.OPT]]);
    }

    // replace() {
    //     // replaces the data with replaceObjs in collection from startKey until numObjs
    //     // if size different, then resize collection elements
    //     return false;
    // }

}