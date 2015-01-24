# biojs-vis-globemap

[![NPM version](http://img.shields.io/npm/v/biojs-vis-globemap.svg)](https://www.npmjs.org/package/biojs-vis-globemap) 

> 

## Description
A Multidimensional Globe to display all the happening events in the world.

## Getting Started
Install the module with: `npm install biojs-vis-globemap`

How to have a Globe with markers showing your events?
- In the simple.js replace with your json file.
```javascript
var app = require("biojs-vis-globemap");
var instance = new app({el: yourDiv, worldMapJSON: '../data/world-countries.json', markerJSON: "../data/markerEvents.json"});
```
- Customize the globe width, height,..etc by changing the values.
```javascript
var opts =  {

  mapWidth: 960,
mapHeight: 600,
focused: false,
ortho: true, 
sens: 0.25,
radius: 2,  // px
hoverRadius: 20 // px
};

```

With all the parameters, you have to change them accordingly. Here are the descriptions:
-	**"json"** : the **.json** which contains list of all countries, by default all countries are included.
-	**" mapWidth"** : the top position of the visualization component.
-	**" mapHeight"** : the right position of the visualization component.
-	**".text"** : the function to display the text in each arc, additional parameter can be added like size.
-	**".duration"** : the function to adjust the transition time which is represented in milliseconds.

#### Features
-	Ortho(3D) and Equirectangular(2D) views are available.
-	Rotatable
-	Automatic ZoomIN of selected countries.
-	Markers

## Contributing

All contributions are welcome.

## Support

 you have any problem or suggestion please open an issue [here](https://github.com/Akshit-/biojs-vis-globemap/issues).

## License 

The MIT License

Copyright (c) 2015, akshit, vinod

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
