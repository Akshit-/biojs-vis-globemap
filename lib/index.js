
var extend = require("js-extend").extend;
var d3 = require("d3");

var Globe = function(optsUser){

var opts =  {
  mapWidth: 960,
  mapHeight: 600,
  focused: false,
  ortho: true, 
  sens: 0.25,
  radius: 2,  // px
  hoverRadius: 20 // px
};

opts = extend(opts, optsUser);

var el = opts.el;

var mapWidth = opts.mapWidth,
mapHeight = opts.mapHeight,
focused = opts.focused,
ortho = opts.ortho, 
sens = opts.sens;
var x = mapWidth / 2;
var y = mapHeight / 2;
var k = 1;
var centered = null;

var zoom2D = false;


var countriesWithEvents = {};

var radius = opts.radius,  // px
    hoverRadius = opts.hoverRadius; // px

var projectionGlobe = d3.geo.orthographic()
.scale(300)
.rotate([0, 0])
.translate([mapWidth / 2, mapHeight / 2])
.clipAngle(90);

var projectionMap = d3.geo.equirectangular()
.scale(145)
.translate([mapWidth / 2, mapHeight / 2])

var projection = projectionGlobe;

var path = d3.geo.path()
.projection(projection)
.pointRadius( function(d,i) {
    return radius;
});

// Define the longitude and latitude scales, which allow us to map lon/lat coordinates to pixel values:
var lambda = d3.scale.linear()
    .domain([0, mapWidth])
    .range([-180, 180]);

var phi = d3.scale.linear()
    .domain([0, mapHeight])
    .range([90, -90]);

var countryList = d3.select(el).append("select").attr("name", "countries");

var shapeData = ["Ortho", "equirectangular"], 
    j = 0;  // Choose the star as default

// Create the shape selectors
var form = d3.select(el).append("form");

var labelEnter = form.selectAll("span")
    .data(shapeData)
    .enter().append("span");

var svgMap = d3.select(el).append("svg")
.attr("overflow", "hidden")
.attr("width", mapWidth)
.attr("height", mapHeight);


var backgroundCircle = svgMap.append("svg:circle")
            .attr('cx', mapWidth / 2)
            .attr('cy', mapHeight / 2)
            .attr('r', 0)
            .attr('class', 'geo-globe');



var infoLabel = d3.select(el).append("div").attr("class", "infoLabel");

var circles;

var equirectangular = false;

var g = svgMap.append('g');


//Rotate to default before animation
var locations = svgMap.append('g')
          .attr('id', 'locations');

// Having defined the projection, update the backgroundCircle radius:
 backgroundCircle.attr('r', projection.scale() );



function defaultRotate() {
  d3.transition()
  .duration(1500)
  .tween("rotate", function() {
    var r = d3.interpolate(projection.rotate(), [0, 0]);
    return function(t) {
      projection.rotate(r(t));
      g.selectAll("path").attr("d", path);
    };
  })
};

//Loading data
d3.json(opts.worldMapJSON, function(world) { 
          
  var countryById = {};
  countries = world.features;

  var collectionCountries = [];

  function setCollectionCountriesData(countries){

      for (var i = 0, l = countries.length; i < l; i++) {
                var country = countries[i];

                var  splits = country.properties.name.split(", ");
                if(splits.length>1 ){
                  var countryName = splits[1].trim();
                  if(collectionCountries.indexOf(countryName) === -1){
                    collectionCountries.push(countryName);
                  }
                }
             

        }   

    } 

  var collectionCountriesDataG = [];
  

  d3.json(opts.markerJSON, function(collectionCountriesData) { 
      collectionCountriesDataG = collectionCountriesData;
      setCollectionCountriesData(collectionCountriesData);
      countrySelectedList(collectionCountries.sort());
      plotMarkers();
  });

 // Plot the positions on the map:
    function plotMarkers(country){   
          
          locations.selectAll("*").data([]).exit().remove();

          circles = [];
          circles = locations.selectAll('path')
            .data(collectionCountriesDataG, function(d) { 
                if(typeof(country) != 'undefined'){
                  var  splits = d.properties.name.split(",");

                  if(splits.length>1 && splits[1].trim().indexOf(country.properties.name) >= 0){
                    return d.properties.name;
                  }else{
                    return null;
                  }

                }else{
                  return d.properties.name;
                }
                
               
            })
            .enter()
            .append('svg:path')
              .attr('class', 'geo-node')
              .attr('d', path);

          circles.append('svg:title')
              .text( function(d) { return d.properties.name; } );

    }

     //Adding countries by name
    function countrySelectedList(countryData) { 

      countryData.forEach(function(d) {
          countryById[d] = d;
          option = countryList.append("option");
          option.text(d);
          option.property("value", d);
      });

    }

  //Drawing countries on the globe

var world = g.selectAll('path')
          .data(countries)
          .enter()
          .append('path')
            .attr('class', 'geo-path')
            .attr('d', path)
              .classed("ortho", ortho = true); 
        

    var zoom = d3.behavior.zoom(true)
            .scale( projection.scale() )
            .scaleExtent([100, 800])
            .on("zoom", globeZoom);

    function globeZoom() {
      console.log("zooom call");

      if(equirectangular === true){
          if (d3.event) {
            var _scale = d3.event.scale;
              projection.scale(_scale);
              backgroundCircle.attr('r', _scale);
              path.pointRadius( radius );

              svgMap.selectAll("path").attr("d", path);
          }
      }; 
    };

  svgMap.call(d3.behavior.drag()
    .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
    .on("drag", function() {

      //No drag when we are in equi and zoomed modes
      if(equirectangular || zoom2D) return;

      var lambda = d3.event.x * sens,
      phi = -d3.event.y * sens,
      rotate = projection.rotate();
      //Restriction for rotating upside-down
      phi = phi > 30 ? 30 :
      phi < -30 ? -30 :
      phi;
      projection.rotate([lambda, phi]);
      g.selectAll("path.ortho").attr("d", path);
      g.selectAll(".focused").classed("focused", focused = false);

      svgMap.selectAll("path").attr("d", path);


    }))


  //Events processing
  world.on("mouseover", function(d) {     
      infoLabel.text(d.properties.name)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
        .style("display", "inline");

  })
  .on("mouseout", function(d) {
      infoLabel.style("display", "none");
  })
  .on("mousemove", function() {
      infoLabel.style("left", (d3.event.pageX + 7) + "px")
               .style("top", (d3.event.pageY - 15) + "px");
  })
  .on("dblclick", function(d) {

   var clickable = false;
   for(var i=0; i<collectionCountries.length; i++){
       if(d.properties.name.indexOf(collectionCountries[i]) >=0 ){

          clickable = true;

    }
   }
   
                 


    if(!clickable){
      return;
    }

    if (focused === d && zoom2D === true ) {
      zoom2D = false;
      zoomin2D(d);

      circles.transition().duration(2000).style("display", "block");

      if(equirectangular === false){
        reset();
      }else{
        plotMarkers();
        g.selectAll(".focused").classed("focused", false);

      }

      return;
    }


    if(zoom2D === true){
      return;
    }    

    infoLabel.text(d.properties.name)
            .style("display", "inline");


    g.selectAll(".focused").classed("focused", false);
    
    d3.select(this).classed("focused", focused = d);


    //Transforming Globe to Map

    if (ortho === true) {
        //defaultRotate();
        openGlobe();
        zoomGlobe(d, true);
    }else{
        zoomGlobe(d, false);
    }

   
  });


  function openGlobe(){

        backgroundCircle.transition().duration(5000).style("display", "none");

        g.selectAll(".ortho").classed("ortho", ortho = false);
        projection = projectionMap;
        path.projection(projection);
        g.selectAll("path").transition().duration(5000).attr("d", path);

        circles.transition().duration(5000).attr("d", path);

  }

  function zoomGlobe(d, ortho){
        zoom2D = true;
        
        var time = ortho?5000:0;

        setTimeout(function() {
          function zoomedAnim() {
            zoomin2D(d);
          };

          zoomedAnim();
        }, time);
       
  }


labelEnter.append("input")
    .attr({
        type: "radio",
        class: "shape",
        name: "mode",
        value: function(d, i) {return i;}
    })
    .property("checked", function(d, i) {
        return (i===j); 
    })
    .on("click", function(d,i) { 
        
        equirectangular = (i === 0) ? false : true;
        
        if(zoom2D) return;

        if( i === 1){
       
            openGlobe();

        }
        else{
          return reset();
        }

         })

    ;

labelEnter.append("label").text(function(d) {return d;});

var x, y, k, centered;

function zoomin2D(d) 
{

  plotMarkers(d);
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 3;
    centered = d;
  } else {
    x = mapWidth / 2;
    y = mapHeight / 2;
    k = 1;
    centered = null;
  }
    g.selectAll(".focused").classed("focused", true);

    g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });


  g.transition()
      .duration(800)
      .attr("transform", "translate(" + mapWidth / 2 + "," + mapHeight / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

  

  circles.transition()
      .duration(800)
      .attr("transform", "translate(" + mapWidth / 2 + "," + mapHeight / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

}
  ///TEST
  var selectionCountries = d3.select("select");

  selectionCountries.on("change", function(d) {
        

      if(zoom2D) return;

      var rotate = projection.rotate(),
      focusedCountry = country(countries, this),
      p = d3.geo.centroid(focusedCountry);

      svgMap.selectAll(".focused").classed("focused", focused = false);

    //Globe rotating
    (function transition() {
      d3.transition()
      .duration(2500)
      .tween("rotate", function() {
        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function(t) {
          if(!equirectangular) projection.rotate(r(t));
          svgMap.selectAll("path").attr("d", path)
          .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
          

        };
      });

      if(!equirectangular) {
          
        //optional feature: Zoom in when country is selected from  drop down list.
        setTimeout(function() {
          function zoomedAnim(d) {

            backgroundCircle.transition().duration(5000).style("display", "none");

            zoomGlobe(d, false);

          };

          zoomedAnim(focusedCountry);
        }, 2800);

      }

      })();


      if(equirectangular) zoomGlobe(focusedCountry, false);
      
    });


    function country(cnt, sel) { 
      for(var i = 0, l = cnt.length; i < l; i++) {
        if(cnt[i].properties.name.indexOf(sel.value) >-1) {return cnt[i];}
      }
    };


  //Adding extra data when focused

  function focus(d) {
    if (focused === d) return reset();
    g.selectAll(".focused").classed("focused", false);
    d3.select(this).classed("focused", focused = d);
  }

  function reset() {
    g.selectAll(".focused").classed("focused", focused = false);
    infoLabel.style("display", "none");

    //Transforming Map to Globe and plotting markers
    plotMarkers();

    projection = projectionGlobe;
    path.projection(projection);
    g.selectAll("path").transition().duration(5000).attr("d", path)
    g.selectAll("path").classed("ortho", ortho = true);

    circles.transition().duration(5000).attr("d", path)


    backgroundCircle.transition().duration(5000).style("display", "block");


  }


});


};

module.exports = Globe;