var map;
var feature;

function load_map() {
	map = new L.Map('map', {zoomControl: true});

	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

	map.setView(new L.LatLng(51.538594, -0.198075), 12).addLayer(osm);
}

function chooseAddr(lat1, lng1, lat2, lng2, osm_type) {
	var loc1 = new L.LatLng(lat1, lng1);
	var loc2 = new L.LatLng(lat2, lng2);
	var bounds = new L.LatLngBounds(loc1, loc2);

	if (feature) {
		map.removeLayer(feature);
	}
	if (osm_type == "node") {
		feature = L.circle( loc1, 25, {color: 'green', fill: false}).addTo(map);
		map.fitBounds(bounds);
		map.setZoom(18);
	} else {
		var loc3 = new L.LatLng(lat1, lng2);
		var loc4 = new L.LatLng(lat2, lng1);

		feature = L.polyline( [loc1, loc4, loc2, loc3, loc1], {color: 'red'}).addTo(map);
		map.fitBounds(bounds);
	}
}

function addr_search() {
    var inp = document.getElementById("addr");

    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
        var items = [];

        $.each(data, function(key, val) {
            bb = val.boundingbox;
            items.push("<li><a href='#' onclick='chooseAddr(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></li>');
        });

		$('#results').empty();
        if (items.length != 0) {
            $('<p>', { html: "Search results:" }).appendTo('#results');
            $('<ul/>', {
                'class': 'my-new-list',
                html: items.join('')
            }).appendTo('#results');
        } else {
            $('<p>', { html: "No results found" }).appendTo('#results');
        }
    });
}

/*function addr_put() {
    var inp = document.getElementById("addr");

    $.getJSON('https://nominatim.openstreetmap.org/reverse?format=xml&lat=52.5487429714954&lon=-1.81602098644987&zoom=18&addressdetails=1', function(data) {
        var items = [];

        $.each(data, function(key, val) {
        	console.log(val);
            bb = val.boundingbox;
            items.push("<li><a href='#' onclick='chooseAddr(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></li>');
        });

		$('#results').empty();
        if (items.length != 0) {
            $('<p>', { html: "Search results:" }).appendTo('#results');
            $('<ul/>', {
                'class': 'my-new-list',
                html: items.join('')
            }).appendTo('#results');
        } else {
            $('<p>', { html: "No results found" }).appendTo('#results');
        }
    });
}*/

function addr_put(source_coordinates) {

var dest_coordinates = '72.8264,18.9322';

    console.log("source_coordinates : "+source_coordinates);
     console.log("dest_coordinates : "+dest_coordinates);

	try{
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://router.project-osrm.org/route/v1/driving/"+source_coordinates+";"+dest_coordinates+"?overview=false",
        "method": "POST",
        "headers": {
            "cache-control": "no-cache"
        }
    }

    $.ajax(settings).done(function(response) {
       //alert("response : "+JSON.stringify(response.routes[0]));
       //alert("value :"+JSON.stringify(response.routes[0].distance));

       var value = JSON.stringify(response.routes[0].distance);

      //alert("value :"+value);

       var distance = value/1000;

       console.log("distance :"+distance);

       document.getElementById("dist").value = distance;

   });
	}catch(e){
		alert(e);
	}
}


window.onload = load_map;
