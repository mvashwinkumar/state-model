'use strict';
var chai = require('chai');
var expect = chai.expect;

var Manager = require('./state-manager').Manager;

describe('Manager Module', function() {
    it('should create manager instance', function() {
        let obj = {'a':'b'};
        let m = new Manager(obj);
        expect(m.currentModel).deep.equal(obj);
    })
})