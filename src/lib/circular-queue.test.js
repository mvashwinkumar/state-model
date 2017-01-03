'use strict';
var chai = require('chai');
var expect = chai.expect;

var CQ = require('./circular-queue').CircularQueue;

describe('Circular Queue Module', function() {
    it('should create Circular Queue instance', function() {
        let list = [];
        list.push(new Object());
        let opts = {};
        opts.maxSize = 10;
        let cq = new CQ(list, opts);
        expect(cq.opts.maxSize).equal(10);
        expect(cq.push()).exist;
        expect(cq.pop()).exist;
        expect(cq.find()).exist;
        expect(cq.replace()).exist;
    })
})