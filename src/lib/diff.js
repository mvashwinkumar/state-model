import _ from 'lodash';

const TYPES = {
    ADD: 'add',
    MODIFY: 'update',
    DELETE: 'delete'
};

// private functions
function _generateUUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function _createDiffObj(oldObj, newObj) {
    let _d = {};
    // object added completely
    if (!oldObj) {
        _d[TYPES.ADD] = _.cloneDeep(newObj);
        return _d;
    }
    // object deleted completely
    if (!newObj) {
        _d[TYPES.DELETE] = _.cloneDeep(oldObj);
        return _d;
    }
    // object properties deleted in oldObj
    for (let p in oldObj) {
        if (newObj[p] === undefined || newObj[p] === null) {
            // existing property deleted
            _d[TYPES.DELETE] = _d[TYPES.DELETE] || {};
            _d[TYPES.DELETE][p] = oldObj[p];
        }
    }
    // object properties added/modified in newObj
    for (let p in newObj) {
        // for a modified property
        if (!_.isEqual(newObj[p], oldObj[p])) {
            if (oldObj[p] === undefined || oldObj[p] === null) {
                // new property added
                _d[TYPES.ADD] = _d[TYPES.ADD] || {};
                _d[TYPES.ADD][p] = newObj[p];
            } else {
                // existing property modified
                _d[TYPES.MODIFY] = _d[TYPES.MODIFY] || {};
                _d[TYPES.MODIFY][p] = {};
                _d[TYPES.MODIFY][p].o = oldObj[p];
                _d[TYPES.MODIFY][p].n = newObj[p];
            }
        }
    }
    return _d;
}

export class Diff {
    constructor(oldObj, newObj) {
        this._id = _generateUUID();
        this._dObj = _createDiffObj(oldObj, newObj);
    }

    getId() {
        return this._id;
    }

    added() {
        let _dObj = this._dObj;
        if (!_dObj[TYPES.ADD] || _.isEmpty(_dObj[TYPES.ADD])) {
            return false;
        }
        return _.cloneDeep(_dObj[TYPES.ADD]);
    }

    modified() {
        let _dObj = this._dObj;
        if (!_dObj[TYPES.MODIFY] || _.isEmpty(_dObj[TYPES.MODIFY])) {
            return false;
        }
        return _.cloneDeep(_dObj[TYPES.MODIFY]);
    }

    deleted() {
        let _dObj = this._dObj;
        if (!_dObj[TYPES.DELETE] || _.isEmpty(_dObj[TYPES.DELETE])) {
            return false;
        }
        return _.cloneDeep(_dObj[TYPES.DELETE]);
    }

    isInstance(diffInstance) {
        // need to implement state instance checking
        if (diffInstance instanceof Diff) {
            return true;
        }
        return false;
    }

    resetDiffTo(diffInstance) {
        let _dObj = this._dObj;

        if(!this.isInstance(diffInstance)) {
            return false;
        }

        let _a = diffInstance.added(),
            _m = diffInstance.modified(),
            _d = diffInstance.deleted();

        if (_a || _m || _d) {
            _dObj[TYPES.ADD] = _.cloneDeep(_a);
            _dObj[TYPES.MODIFY] = _.cloneDeep(_m);
            _dObj[TYPES.DELETE] = _.cloneDeep(_d);
            return true;
        } else {
            return false;
        }
    }

    mergeNext(nextDiff) {
        let _dObj = this._dObj;
        if(!this.isInstance(nextDiff)) {
            return false;
        }
        let numOfChanges = 0;

        /*  
        *   State Transition Matrix
        *   Next Transition (Diff) ---------->
        *   p       |   ADD |   MOD |   DEL |   NoM |
        *   r   -------------------------------------   
        *   e   ADD |   N/A |   ADD |   Rmv |   ADD |
        *   v   MOD |   N/A |   MOD |   DEL |   MOD |   
        *   |   DEL |   MOD |   N/A |   N/A |   DEL |
        *   |   NoM |   ADD |   MOD |   DEL |   N/A |
        *   V   -------------------------------------
        *   Rmv - Remove; NoM - Not Mentioned; 
        */

        // for all properties added in next state
        let addProps = nextDiff.added();
        for(let p in addProps) {
            if(_dObj[TYPES.DELETE] && _dObj[TYPES.DELETE][p]) {
                // previous deleted property and added again, shift it deletion -> modification
                _dObj[TYPES.MODIFY] = _dObj[TYPES.MODIFY] || {};
                _dObj[TYPES.MODIFY][p] = {
                    n: _.cloneDeep(addProps[p]),
                    o: _dObj[TYPES.DELETE][p]
                };
                delete _dObj[TYPES.DELETE][p];
                numOfChanges++;
            } else {
                // property change not recorded previously, then addition
                _dObj[TYPES.ADD] = _dObj[TYPES.ADD] || {};
                _dObj[TYPES.ADD][p] = _.cloneDeep(addProps[p]);
                numOfChanges++;
            }
        }
        // for all properties deleted in next state
        let delProps = nextDiff.deleted();
        for(let p in delProps) {
            if(_dObj[TYPES.ADD] && _dObj[TYPES.ADD][p]) {
                // if added property in previous state and deleted in next, then remove it
                delete _dObj[TYPES.ADD][p];
                numOfChanges++;
            } else if(_dObj[TYPES.MODIFY] && _dObj[TYPES.MODIFY][p]){
                // if modified property in previous state and deleted in next, shift it modification -> deletion
                _dObj[TYPES.DELETE] = _dObj[TYPES.DELETE] || {};
                _dObj[TYPES.DELETE][p] = _.cloneDeep(delProps[p]);
                delete _dObj[TYPES.MODIFY][p];
                numOfChanges++;
            } else {
                // property change not recorded previously, then deletion
                _dObj[TYPES.DELETE] = _dObj[TYPES.DELETE] || {};
                _dObj[TYPES.DELETE][p] = _.cloneDeep(delProps[p]);
                numOfChanges++;
            }                
        }
        // for all properties modified in next state
        let modProps = nextDiff.modified();
        for(let p in modProps) {
            if(_dObj[TYPES.ADD] && _dObj[TYPES.ADD][p]) {
                // if added property in previous state and modified in next, then update its value in addition
                _dObj[TYPES.ADD][p] = _.cloneDeep(modProps[p]);
                numOfChanges++;
            } else {
                // property change not recorded previously, then modification
                _dObj[TYPES.MODIFY] = _dObj[TYPES.MODIFY] || {};
                _dObj[TYPES.MODIFY][p] = {
                    n: _.cloneDeep(modProps[p]),
                    o: _dObj[TYPES.MODIFY][p]
                };
                numOfChanges++;
            }
        }
        if(numOfChanges>0) {
            return numOfChanges;
        } else {
            return false;
        }
    }
}