var request = require('request')
var Stream = require('stream');
var util = require('util');

exports.Satellite = Satellite;
exports.LocationStream = LocationStream;

/**
 * Set up module
 *
 * @param id: int, the satellite id
 * @param options: obj, request options. e.g. rate, api 
 *
 * @returns: obj, location stream
 */
function Satellite(id, options) {
  this.options = options || {};
  this.options.objectMode = true;

  Stream.Readable.call(this, this.options);

  var self = this;

  this.running = false;
  this.id = id || 25544;
  this.options.api = this.options.api || 'https://api.wheretheiss.at/v1/satellites/' + this.id;
  this.options.rate = options.rate || 1000;

  // prevent back-to-back requests faster than 1 second
  if (options.rate < 1000) {
    return new Error('rate must be at least 1000 milliseconds');
  }

  return this;
}

// let Satellite inherit
util.inherits(Satellite, Stream.Readable);

/**
 * Fetch data from specified api
 */
Satellite.prototype._fetchData = function() {
  var self = this;

  request({uri: self.options.api, strictSSL: false}, function(error, response, data) {
    // if we get an error back, stop the stream
    if (response.statusCode !== 200) {
      self.stop();
      return new Error(data.error);
    }
    var result = JSON.parse(data);
    self.push(result);
  });
}

/**
 * Set the _read method
 */
Satellite.prototype._read = function () {
  // make sure we only run 1 request at a time
  if (!this.running) {
    var self = this;
    this.running = true;
    this.timer = setTimeout(function(){
      self._fetchData();
      self.running = false;
    }, this.options.rate);
  }
}

/**
 * Clear the timeout and finish streaming
 */
Satellite.prototype.stop = function () {
  clearTimeout(this.timer);
  this.running = false;
  this.push(null);
}


/**
 * Stream the change in location
 */
function LocationStream() {
  Stream.Transform.call(this, { objectMode: true });
  return this;
}

// let LocationStream inherit
util.inherits(LocationStream, Stream.Transform);

/**
 * Clear the timeout and finish streaming
 *
 * @param chunk: obj, satellite location oject
 * @param encoding: string, encoding type, defaults to utf8
 * @param callback: function, callback function
 */
LocationStream.prototype._transform = function(chunk, encoding, callback){
  if (this.oldResult) {
    var timeDelta = (chunk.timestamp - this.oldResult.timestamp)/1000;
    var delta = {
      latitude_delta: (chunk.latitude - this.oldResult.latitude) / timeDelta,
      longitude_delta: (chunk.longitude - this.oldResult.longitude) / timeDelta
    }

    if (delta.latitude_delta !== 0 && delta.longitude_delta !== 0) {
      this.push(delta);
    }
  }
  this.oldTime = new Date();
  this.oldResult = chunk;
  callback();
};
