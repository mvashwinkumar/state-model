'use strict';
var chai = require('chai');
var expect = chai.expect;

var Manager = require('./state-manager').Manager;

describe('Manager Module', function() {
    xit('should create manager instance', function() {
        let obj = {'a':'b'};
        let m = new Manager(obj);
        expect(m.diffs[0]).exist;
    })
})