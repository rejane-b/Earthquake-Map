
var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(Url, function(data) {
    
    createFeatures(data.features);
  });

  function createFeatures(earthquakeData) {

    
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3> Location: " + feature.properties.place +
        "</h3><hr><p> Date/Time: " + new Date(feature.properties.time) + "</p><p> Magnitude: " + feature.properties.mag + "</p>");
    }  
    
    function radiusSize(magnitude) {
      return magnitude * 15000;
    }
  
    
    function circleColor(depth) {
      if (depth < 10) {
        return "#00ffff"
      }
      else if (depth < 30) {
        return "#80ff00"
      }
      else if (depth < 50) {
        return "#ffff00"
      }
      else if (depth < 70) {
        return "#ffbf00"
      }
      else if (depth < 90) {
        return "#ff4000"
      }
      else {
        return "#ff0000"
      }
    }
  
    
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(earthquakeData, latlng) {
        return L.circle(latlng, {
          radius: radiusSize(earthquakeData.properties.mag),
          color: "black",
          stroke: "1",
          fillColor: circleColor(earthquakeData.geometry.coordinates[2]),
          fillOpacity: 1
        });
      },
      onEachFeature: onEachFeature
    });
  
    
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      }); 
          
    
    var baseMaps = {
        "Street Map": streetmap      
    };

  
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Creating map with streetmap and earthquakes layers 
    var myMap = L.map("map", {
        center: [25, -70],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });  
    
    
    function getColor(d) {
        return d > 90 ? '#ff0000' :
           d > 70  ? '#ff4000' :
           d > 50  ? '#ffbf00' :
           d > 30  ? '#ffff00' :
           d > 10  ? '#80ff00' :
                    '#00ffff';
    }
    // Add legend
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info-legend'),
          depths = [-10, 10, 30, 50, 70, 90],
          labels = [];
  
      // loop to generate a label with a different color for each interval
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
      }
  
      return div;
    };
legend.addTo(myMap)
}