'use strict';
var chai = require('chai');
var expect = chai.expect;

var Diff = require('./diff').Diff;

describe('Diff Module', function() {
    it('should create diff instance', function() {
        let d1 = new Diff(null, null);
        expect(d1.getId()).exist;
    })
    it('should record added props', function() {
        let obj = {'a':'b'};
        let d1 = new Diff(null, obj);
        expect(d1.added()).deep.equal(obj);
    })
    it('should record deleted props', function() {
        let obj = {'a':'b'};
        let d1 = new Diff(obj, null);
        expect(d1.deleted()).deep.equal(obj);
    })
    it('should record modified props', function() {
        let obj = {'a':'b'};
        let modObj = {'a':'c'};
        let recObj = {'a':{'n':'c','o':'b'}};
        let d1 = new Diff(obj, modObj);
        expect(d1.modified()).deep.equal(recObj);
    })
    it('should return false invalid arguments', function() {
        let obj1 = {'a':'b'};
        let obj2 = {'a':'c'};
        let invalidArg = 'invalid argument here';
        let d12 = new Diff(obj1, obj2);

        expect(d12.mergeNext(invalidArg)).equal(false);
        expect(d12.resetDiffTo(invalidArg)).equal(false);
    })
    it('should return false on merge empty diffs', function() {
        let obj1 = null;
        let obj2 = null;
        let obj3 = null;
        let d12 = new Diff(obj1, obj2);
        let d23 = new Diff(obj2, obj3);

        expect(d12.mergeNext(d23)).equal(false);
    })
    it('should merge adjacent states', function() {
        let obj1 = {'a':'b'};
        let obj2 = {'a':'c'};
        let obj3 = {'a': 'c','d':'e'};
        let obj4 = {'d':'e'};
        let d12 = new Diff(obj1, obj2);
        let d23 = new Diff(obj2, obj3);
        let d34 = new Diff(obj3, obj4);
        let d14 = new Diff(obj1, obj4);

        d12.mergeNext(d23);
        d12.mergeNext(d34);

        expect(d12.added()).deep.equal(d14.added());
        expect(Object.keys(d12.deleted())).deep.equal(Object.keys(d14.deleted()));
        expect(d12.modified()).deep.equal(d14.modified());
    })
    it('reset diff', function() {
        let obj1 = {'a':'b'};
        let obj2 = {'a':'c'};
        let obj3 = {'a': 'c','d':'e'};
        let obj4 = {'d':'e'};
        let d12 = new Diff(obj1, obj2);
        let d23 = new Diff(obj2, obj3);
        let d34 = new Diff(obj3, obj4);
        let d13 = new Diff(obj1, obj3);
        d12.mergeNext(d23);
        d12.mergeNext(d34);

        d12.resetDiffTo(d13);

        expect(d12.added()).deep.equal(d13.added());
        expect(Object.keys(d12.deleted())).deep.equal(Object.keys(d13.deleted()));
        expect(d12.modified()).deep.equal(d13.modified());
    })
})