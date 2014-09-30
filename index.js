var request = require('request')
var Stream = require('stream').Readable;
var util = require('util');

module.exports = Satellite;

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

  Stream.call(this, this.options);

  var self = this;

  this.id = id || 25544;
  this.options.api = this.options.api || 'https://api.wheretheiss.at/v1/satellites/' + this.id;
  this.options.rate = options.rate || 1000;
  this.options.objectMode = true;

  if (options.rate < 1000) {
    return new Error('rate must be at least 1000 milliseconds');
  }

  this._fetchData(this.options.api);

  return this;
}

util.inherits(Satellite, Stream);

/**
 * Fetch data from specified api
 */
Satellite.prototype._fetchData = function() {
  var self = this;
  clearTimeout(this.timer);

  request({uri: self.options.api, strictSSL: false}, function(error, response, data) {
    if (response.statusCode !== 200) {
      self.stop();
      return new Error(data.error);
    }
    var result = JSON.parse(data);
    self.push(result);
    self._finished();
  });
}

/**
 * Finished streaming data, set the timer 
 */
Satellite.prototype._finished = function() {
  this.timer = setTimeout(this._fetchData(), this.options.rate);
}

/**
 * Set the _read method
 */
Satellite.prototype._read = function () {
  // do something
}

/**
 * Clear the timeout and finish streaming
 */
Satellite.prototype.stop = function () {
  clearTimeout(this.timer);
  this.push(null);
}
