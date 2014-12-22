/**
 * 
 * Geocoder
 * 
 * First geocoder in array of sources is set as default when opened
 * After that you can can get and set the current geocoders with
 *
 * getCurrentGeocoder
 * getAllGeocoders
 * getGeocoderById
 * setGeocoderById
 * requestProxy
 * 
 */

var Geocoder = Geocoder || {};

Geocoder['sources'] = [
    {
        name: "Bag",
        id: 'bag',
        request: function( request, response ) {
            $.ajax({
                url: "http://demo.bag42.plannerstack.org/api/v0/geocode/json",
                dataType: "json",
                data: {
                    address : request.term + "*"
                },
                success: function( data ) {
                    response( $.map( data.results, function( item ) {
                        return {
                            label: item.formatted_address,
                            value: item.formatted_address,
                            latlng: item.geometry.location.lat+','+item.geometry.location.lng
                        };
                    }));
                }
            });
        }
    },
    {
        name: "Bliksem",
        id: 'bliksem',
        request: function( request, response ) {
            $.ajax({
               url: "https://1313.nl/geocoder/" + request.term + '*',
                dataType: "json",
                success: function( data ) {
                    response( $.map( data.features, function( item ) {
                        return {
                            label: item.properties.search,
                            value: item.properties.search,
                            latlng: item.geometry.coordinates[1]+','+item.geometry.coordinates[0]
                        };
                    }));
                }
            });
        }
    }
];

Geocoder['currentId'] = null;

Geocoder['getCurrentGeocoder'] = function () {
    if (!Geocoder['currentId']) {
        return null;
    }
    return Geocoder['getGeocoderById'](Geocoder['currentId']);
};

Geocoder['getGeocoderById'] = function (id) {
    if (!id) {
        console.error("getGeocoderById:: Couldn't get router, no id passed along");
        return null;
    }

    for (var i = Geocoder['sources'].length - 1; i >= 0; i--) {
        if (Geocoder['sources'][i].id === id){
            return Geocoder['sources'][i];
        }
    }
    console.error("getGeocoderById:: Couldn't set router, no router found with id");
    return null;
};

Geocoder['getAllGeocoders'] = function () {
    return Geocoder['sources'];
};

Geocoder['setGeocoderById'] = function (id) {
    if (!id) {
        return null;
    }
    if (Geocoder.getCurrentGeocoder() && Geocoder.getCurrentGeocoder().id === id ) {
        return null;
    }
    for (var i = Geocoder['sources'].length - 1; i >= 0; i--) {
        if (Geocoder['sources'][i].id === id){
            Geocoder['currentId'] = Geocoder['sources'][i].id;
            return Geocoder['currentId'];
        }
    }
    console.error("setGeocoderById:: Couldn't set router, no router found with id");
    return null;
};

Geocoder['requestProxy'] = function (request, response) {
  var geocoder = Geocoder.getCurrentGeocoder();
  if (geocoder) {
    geocoder.request(request, response);
  } else {
    console.error('no geocoder set up');
    response ([]);
  }
};


// 'init'
Geocoder['setGeocoderById'](Geocoder['sources'][0].id);