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
        expect(cq.enqueue).be.function;
        expect(cq.dequeue).be.function;
        expect(cq.find).be.function;
        // expect(cq.replace()).be.function;
    })
    it('should push, find and pop object', function() {
        let list = [];
        list.push({id:1, name:'one'});
        list.push({id:2, name:'two'});
        list.push({id:3, name:'three'});
        let opts = {
            maxSize : 10,
            overflow : 'silent'
        };

        let cq = new CQ(list, opts);

        cq.enqueue({id:4, name:'four'});
        expect(cq.find(4)).to.have.any.keys('name');

        let firstDequeue = cq.dequeue();
        expect(firstDequeue).deep.equal(list[0]);
    })
    it('should throw error when push invalid object', function() {
        let Car = (id, name) => {
            this.id = id;
            this.name = name;
        };
        let opts = {
            maxSize : 10,
            collectionType : Car
        };
        let carList = [];
        carList.push(new Car(1,'Car 1'));
        carList.push(new Car(2,'Car 2'));
        let cq = new CQ(carList, opts);

        let errMsg = "";
        try {
            cq.enqueue({id:4, name:'four'});
        } catch (e) {
            errMsg = e.message;
        } finally {
            expect(errMsg).to.equal('NOT_INSTANCE : This object is not an instance of collection type');
        }        
    })
    it('should throw error when push more than capacity', function() {
        let Car = (id, name) => {
            this.id = id;
            this.name = name;
        };
        let opts = {
            maxSize : 2,
            collectionType : Car,
            overflow : 'throw'
        };
        let carList = [];
        carList.push(new Car(1,'Car 1'));
        carList.push(new Car(2,'Car 2'));
        let cq = new CQ(carList, opts);

        let errMsg = "";
        try {
            cq.enqueue(new Car(3,'Car 3'));
        } catch (e) {
            errMsg = e.message;
        } finally {
            expect(errMsg).to.equal('FULL : This queue at full capacity');
        }
        
    })
})