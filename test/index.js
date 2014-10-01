var should = require('chai').should();
var through = require('through2');
var Satellite = require('../');

describe('satellite', function() {

  it('data should be ok', function(done) {
    var satellite = new Satellite.Satellite(25544, { rate: 1000 });
    satellite.pipe(through.obj(function(chunk, enc, callback) {
      chunk.should.be.ok;
      chunk.should.be.a('object');
      this.emit('close');
      done();
      callback();
    }));
  });

  it('data should be from satellite requested', function(done) {
    var satellite = new Satellite.Satellite(25544, { rate: 1000 });
    var id = 25544;
    satellite.pipe(through.obj(function(chunk, enc, callback) {
      chunk.id.should.be.ok;
      chunk.id.should.equal(id);
      this.emit('close');
      done();
      callback();
    }));
  });

  it('data should have latitude and longitude', function(done) {
    var satellite = new Satellite.Satellite(25544, { rate: 1000 });
    satellite.pipe(through.obj(function(chunk, enc, callback) {
      chunk.id.should.be.ok;
      chunk.latitude.should.be.a('number');
      chunk.longitude.should.be.a('number');
      this.emit('close');
      done();
      callback();
    }));
  });

  it('fetch rate should be at least 1000 milliseconds', function(done) {
    var satellite = new Satellite.Satellite(25544, { rate: 500 });
    satellite.should.be.an.instanceOf(Error);
    done();
  });

});

describe('location', function() {

  it('change data should be streamed', function(done) {
    this.timeout(3500);
    var satellite = new Satellite.Satellite(25544, { rate: 1000 });
    var location = new Satellite.LocationStream();
    satellite.pipe(location).pipe(through.obj(function(chunk, enc, callback) {
      chunk.should.be.ok;
      chunk.should.be.a('object');
      this.emit('close');
      done();
      callback();
    }));
  });

  it('data should have delta on every request', function(done) {
    this.timeout(3500);
    var satellite = new Satellite.Satellite(25544, { rate: 1000 });
    var location = new Satellite.LocationStream();
    var count = 0;
    satellite.pipe(location).pipe(through.obj(function(chunk, enc, callback) {
      chunk.should.be.ok;
      chunk.latitude_delta.should.not.equal(0);
      chunk.longitude_delta.should.not.equal(0);
      this.emit('close');
      done();
      callback();
    }));
  });


});
