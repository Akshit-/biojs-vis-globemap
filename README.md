# biojs-vis-globemap

[![NPM version](http://img.shields.io/npm/v/biojs-vis-globemap.svg)](https://www.npmjs.org/package/biojs-vis-globemap) 
> A Multidimensional Globe to display all the happening events in the world.

## Getting Started
Install the module with: `npm install biojs-vis-globemap`

## Documentation
How to have a Globe with markers showing your events?

- In the simple.js replace with your json file.
```javascript
var app = require("biojs-vis-globemap");
var instance = new app({el: yourDiv, worldMapJSON: '../data/world-countries.json', markerJSON: "../data/markerEvents.json"});
```

- the `markerJSON` file should be in a structure/format as shown below
```javascript
[{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [76.7794179, 30.7333148]
    },
    "properties": {
        "name": "Chandigarh, India"
    }
},{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [5.117778, 52.091667]
    },
    "properties": {
        "name": "Utrecht, Netherlands"
    }
}]
```
- Customize the globe like width, height,..etc by changing the values.

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
- **"json"** : the **.json** which contains list of all countries which is going to host the events.
- **" mapWidth"** : the top position of the visualization component.
- **" mapHeight"** : the right position of the visualization component.
- **"focused"** : to have a general 3D globe view without being focussed on a particuar country.
- **"ortho"** : the default view, if false then 2D view is displayed.
- **"sens"** : the degree of sensitivity for mouse events with related to map.
- **"radius"** : to increase the size of globe.
- **"hoverRadius"** : the area for displaying the country/city names during the mouseover events.

#### Features
- Ortho(3D) and Equirectangular(2D) views are available.
- Rotatable
- Automatic ZoomIN of selected countries.
- Markers

## Contributing

All contributions are welcome.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/Akshit-/biojs-vis-globemap/issues).

## License 

This software is licensed under the Apache 2 license, quoted below.

Copyright (c) 2015, Akshit, Vinod

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
