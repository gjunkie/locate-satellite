var should = require('chai').should();
var through = require('through2');
var Satellite = require('../');

describe('satellite', function() {

  it('should get data from api', function(done) {
    var satellite = new Satellite(25544, { rate: 1000 });
    satellite.pipe(through.obj(function(chunk, enc, callback) {
      if (chunk) {
        chunk.should.be.a('object');
        this.emit('close');
        done();
      }
      callback();
    }));
  });

  it('data should be from satellite requested', function(done) {
    var satellite = new Satellite(25544, { rate: 1000 });
    var id = 25544;
    satellite.pipe(through.obj(function(chunk, enc, callback) {
      if (chunk) {
        chunk.id.should.equal(id);
        this.emit('close');
        done();
      }
      callback();
    }));
  });

  it('data should have latitude and longitude', function(done) {
    var satellite = new Satellite(25544, { rate: 1000 });
    satellite.pipe(through.obj(function(chunk, enc, callback) {
      if (chunk) {
        chunk.latitude.should.be.a('number');
        chunk.longitude.should.be.a('number');
        this.emit('close');
        done();
      }
      callback();
    }));
  });

  it('fetch rate should be at least 1000 milliseconds', function(done) {
    var satellite = new Satellite(25544, { rate: 500 });
    satellite.should.be.an.instanceOf(Error);
    done();
  });

});
