locate-satellite
================

Retrieve satellite location data from [wheretheiss.at].

###Installation

```
npm install locate-satellite
```

###Usage

```
var options = {
  api: https://api.wheretheiss.at/v1/satellites/ //default
  rate: 1000 //default, in milliseconds
}

// returns an object stream of location data
var satellite = new Satellite(25544, options);
```

You can also get the difference in latitude and longitude since the last location
```
var satellite = new Satellite.Satellite(25544, { rate: 1000 });

// returns the change in location since the last
var location = new Satellite.LocationStream();

satellite.pipe(location).pipe(through.obj(function(chunk, enc, callback) {
  // chunk is an object with latitude and longitude change
  doSomethingWith(chunk);
  callback();
}));
```
  
###MIT License (MIT)

Copyright (c) 2014 Freddie Carthy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[wheretheiss.at]:http://wheretheiss.at/w/developer
