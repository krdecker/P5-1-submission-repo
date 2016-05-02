
//(function () {
//   'use strict';
   // this function is strict...



'use strict';
////////////////////////////////////MODEL/////////////////////////////////////

// eats data: an array of places to eat
// around Commercial-Broadway Station
// East Van
// British Columbia

// basic data, loaded if more detailed model not found in localStorage
var EatsModel = {
    zoomLevel: 18,
    center: {lat: 49.262387, lng: -123.069956},//49.262387, -123.069768
    spots: [
        {
            name: "Uncle Fatih's Pizza",
            location: {lat: 49.262437, lng: -123.070215},
            category: "pizza"
        },
        {
            name: "Buddha's Orient Express",
            location: {lat: 49.262719, lng: -123.069289},
            category: "asian"
        },
        {
            name: "Booster Juice",
            location: {lat: 49.262641, lng: -123.069438},
            category: "juice"
        },
        {
            name: "Starbucks Coffee",
            location: {lat: 49.261874, lng: -123.070076},
            category: "coffee"
        },
        {
            name: "Blenz Coffee",
            location: {lat: 49.262534, lng: -123.069529},
            category: "coffee"
        },
        {
            name: "Megabite Pizza",
            location: {lat: 49.262779, lng: -123.069317},
            category: "pizza"
        },
        {
            name: "Broadway Station Sushi",
            location: {lat: 49.262084, lng: -123.070962},
            category: "asian"
        }
    ]
};

var model = {};

function getModel() {
    if (localStorage.model) {
        return JSON.parse(localStorage.model);
    } else {
        return EatsModel;
    }
}


function buildWindowContent(marker) {
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=300x250&location=' +
                            marker.position.toString().slice(1,-1) ;// + '&key=' + kr.streetview.key;
    // marker.position.toString() method changed to include parentheses, hence the slice
    // key not required

    var picture = '<img class="bgimg" src="' + streetviewUrl + '">';
    var css = '"height:100%;width:80%"';
    var content = '<div onclick="itchwindow()" style=' +
                    css + '>' + picture + '<br><span style="color:darkgreen">' +
                    marker.title + '</span>' +
                    '<br><span style="color:red">-CLICK FOR MORE INFO-</span></div>';

    return content;
}

//==========================================================
// 3rd party API stuff
var fourSquareURL = 'https://api.foursquare.com';

// get content for info slides from 3rd party sources
// based on info from model
// then add to model and to view objects
function buildSlideContent(spot) {
    var formattedData = "";
    var loc = "ll=" + spot.location.lat.toString() + "," + spot.location.lng.toString();
    var ajax_error;

    // get the foursquare ID number of the spot
    $.ajax({
            url: fourSquareURL + '/v2/venues/search',
            dataType: 'json',
            data: 'limit=1' +
                    '&' + loc + '&query=' + spot.name +
                    '&client_id='+ kr.foursquare.Client_id +
                    '&client_secret='+ kr.foursquare.Client_secret +
                    '&v=20160130',
            async: true,
            success: getVenueInfo,
            error: sendError
    });

    // give the response on specific venue to another call for
    // more detailed information
    function getVenueInfo(data, status) {
        console.log("In getVenueInfo: status = " + status);
        var venue = data.response.venues[0];
        //https://api.foursquare.com/v2/venues/VENUE_ID
        $.ajax({ // to get the detailed foursquare of the 'complete venue' based on ID
            url: fourSquareURL + '/v2/venues/' + venue.id,
            dataType: 'json',
            data: 'limit=1' +
                    '&' + loc +
                    '&query=' + spot.name +
                    '&client_id='+ kr.foursquare.Client_id +
                    '&client_secret='+ kr.foursquare.Client_secret +
                    '&v=20160130',
            async: true,
            success: formatShowData,
            error: sendError
        });
    }

    function formatShowData(data){
        var venue = data.response.venue;
        formattedData = 'FourSquare info: ' +
                        '<br>' + '<br>' + venue.name + '<br>' +
                        venue.contact.formattedPhone + '<br>' +
                        '- ' + venue.location.address + '<br>' +
                        '- ' + venue.location.city  + '<br>' +
                        '- ' + venue.location.country  + '<br>' +
                        'x-street: ' + venue.location.crossStreet + '<br>' +
                        'Check-ins: ' + venue.stats.checkinsCount.toString() +
                        '<br>' + venue.likes.summary + '<br>' + '<br>' +
                        '<span style="background-color:#' + venue.ratingColor +
                        ';color:black;padding:1%">' +
                        'Rating: ' + venue.rating.toString() +
                        '</span>' + '<br>' +
                        '<img src="' + venue.bestPhoto.prefix +
                        'cap300' + venue.bestPhoto.suffix + '">'
                        ;
        //spot.slideContent = formattedData;
        updateSlideContent(spot, formattedData);
    }
    function sendError(object, error, exception) {
        // if api not working (and local storage is cleared)
        // then content of each slide is set to error msg
        var ajax_error = "Sorry. 3rd party info unavailable.";
        updateSlideContent(spot, ajax_error);
    }
}

function updateSlideContent(spot, dataString) {
    // update the model
    spot.slideContent = dataString;
    // update the view
    var vmSpot = getSpot(spot.name);
    if (vmSpot) {
        console.log("in updateSlideContent: viewSpot ");
        vmSpot.slideContent = dataString;
    }
}

// MarkN's implementation of
/**
 * Generates a random number and returns it as a string for OAuthentication
 * @return {string}
 */
// function nonce_generate() {
//   return (Math.floor(Math.random() * 1e12).toString());
// }

// var yelp_url = YELP_BASE_URL + 'business/' + self.selected_place().Yelp.business_id;

//     var parameters = {
//       oauth_consumer_key: YELP_KEY,
//       oauth_token: YELP_TOKEN,
//       oauth_nonce: nonce_generate(),
//       oauth_timestamp: Math.floor(Date.now()/1000),
//       oauth_signature_method: 'HMAC-SHA1',
//       oauth_version : '1.0',
//       callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
//     };

//     var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
//     parameters.oauth_signature = encodedSignature;

//     var settings = {
//       url: yelp_url,
//       data: parameters,
//       cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
//       dataType: 'jsonp',
//       success: function(results) {
//         // Do stuff with results
//       },
//       error: function() {
//         // Do stuff on fail
//       }
//     };

//     // Send AJAX query via jQuery library.
//     $.ajax(settings);

/////////////////////////////////////MAP VIEWMODEL////////////////////////////////////

var map;
var vmSpots = [];
var infowindow;

var RedRoadsNGreenBusStops = [
  {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [
        { visibility: "off" }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      { "gamma": 0.65 },
      { "hue": "#ff9c30" },
      { "visibility": "on" },
      { "saturation": 99 },
      { "lightness": -12 }
    ]
  },{
    "featureType": "transit",
    "stylers": [
      { "hue": "#00ff33" },
      { "gamma": 0.60 },
      { "saturation": 5 },
      { "visibility": "on" },
      { "weight": 4.6 },
      { "lightness": -12 } //was -22
    ]
  }
];

var mapOptions = {
        center: {lat: 49.262387, lng: -123.069868},//49.262387, -123.069768
        // Commercial Broadway Station 49°15′45″N, 123°04′08″W
        zoom: 16,
        zoomControl: true,
        scrollwheel: false,
        draggable: true,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        styles: RedRoadsNGreenBusStops
    };

var icons = {
  asian: {
    icon: 'img/asian.png'
  },
  coffee: {
    icon: 'img/coffee.png'
  },
  food: {
    icon: 'img/food.png'
  },
  juice: {
    icon: 'img/juice.png'
  },
  pizza: {
    icon: 'img/pizza.png'
  }
};

// invoked by map <script> in index.html
function init() {
    map = new google.maps.Map(document.getElementById('map-div'), mapOptions );
    model = getModel(); // load data object either from localStorage or file
    // then build the slide content with ajax api calls, if necessary
    if ( (model.spots[0].slideContent === undefined) ||
         (model.spots[0].slideContent.slice(0,5) == "Sorry")) {
            model.spots.forEach( function (spot) {
                buildSlideContent(spot);
            });
    }

    viewModel.spotList(model.spots);
    viewModel.filterOn(!narrowScreen());

    infowindow = new google.maps.InfoWindow({});
    map.setZoom(model.zoomLevel);
    map.setCenter(model.center);

    //build array of eating spot objects based on the model
    model.spots.forEach( function(spot) {
        vmSpots.push(new Spot(spot));
    });

    // stay centred
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(model.center);
        viewModel.filterOn(!narrowScreen());
    });

    // when things settle down, store a copy of the model locally
    window.setTimeout( function() {
        localStorage.model = JSON.stringify(model);
    }, 3000);
}

// constructor
var Spot = function(data) {
  var that = this;
  this.name = data.name;
  this.location = data.location;
  this.category = data.category;
  this.slideContent = data.slideContent;
  this.marker = new google.maps.Marker({
        position: this.location,
        title: this.name,
        icon: icons[this.category].icon,
        map: map,
        opacity: 0.4
  });
  this.windowContent = buildWindowContent(this.marker);

  this.clickEvent = google.maps.event.addListener(this.marker, "click", function () {
        that.doOpening();
    });
  this.overEvent = google.maps.event.addListener(this.marker, "mouseover", function () {
        that.hiLightListItem();
  });
  this.outEvent = google.maps.event.addListener(this.marker, "mouseout", function () {
        that.loLightListItem();
  });
};

Spot.prototype.hiLightListItem = function () {
    var that = this;
    cleanUpScreen();
    $("li:contains(" + that.name + ")").toggleClass( "hilight under" );
};

Spot.prototype.loLightListItem = function () {
    var that = this;
    $("li:contains(" + that.name + ")").toggleClass("hilight under");
};

Spot.prototype.doBounce = function ()  {
    var that = this;
    cleanUpScreen();
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
};

Spot.prototype.stopBounce = function () {
    this.marker.setAnimation(null);
};

Spot.prototype.doOpening = function () {
    var that = this;
    cleanUpScreen();
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout( function() {
        that.openWindow();
        that.marker.setAnimation(null);
    }, 1000);
};

Spot.prototype.openWindow = function () {
    var that = this;
    viewModel.listCollapse();
    infowindow.setContent(this.windowContent);
    infowindow.open(map, this.marker);
    this.closeEvent = google.maps.event.addListener(infowindow, "closeclick", function () {
          cleanUpScreen();
          viewModel.listExpand();
          google.maps.event.removeListener(that.closeEvent);
    });
};

Spot.prototype.hideMarker = function () { this.marker.setMap(null); };
Spot.prototype.showMarker = function () { this.marker.setMap(map); };



////////////////////////////////////KO VIEWMODEL//////////////////////////////////

var ViewModel = function () {
    var self = this;

    // Data
    self.listOn = ko.observable(true);
    self.burgerMenu = ko.observable(false);
    self.spotList = ko.observableArray();
    self.slideOn = ko.observable(false);
    self.slideContent = ko.observable();
    self.filterOn = ko.observable(true);
    self.filterSlot = ko.observable();
    self.isSelected = ko.observable(false);

    // Behaviours

    self.bounceMarker = function() {
        var spot = getSpot(this.name);
        spot.doBounce();
    };

    self.unbounceMarker = function () {
        var spot = getSpot(this.name);
        spot.stopBounce();
    };

    self.spotPick = function() {
        var spot = getSpot(this.name);
        spot.doOpening();
    };

    self.setFilterSelected = function() {
        this.isSelected(true);
        cleanUpScreen();
        self.listExpand();
    };

    self.filterSlot.subscribe(function(data) {
        self.listExpand();
        self.spotList(filterList(data, vmSpots));
        resetMarkers(self.spotList());
    });

    self.onEnter = function (data, event) {
        if (event.keyCode === 13) {
            if (infowindow.anchor) {
                  self.openAPIslide(infowindow.anchor.title);
            }
            else {
                if (self.spotList().length === 1) {
                    self.spotList()[0].doOpening();
                }
            }
        }
        else {
            if (infowindow) infowindow.close(); //for any other keypress
            self.slideOff();
            self.listExpand();
        }
        return true; // necessary to reflect the text in the slot
    };

    self.listCollapse = function () {
        //disable for big screen; enable for small
        // var mediaquery = window.matchMedia( "(max-width: 549px)" );
        // if (mediaquery.matches) {
        //     self.listOn(false);
        //     self.burgerMenu(true);
        // }

        if (narrowScreen()) {
          self.listOn(false);
          self.burgerMenu(true);
        }
    };

    self.listExpand = function () {
        cleanUpScreen();
        self.burgerMenu(false);
        self.listOn(true);
    };

    self.openAPIslide = function (spotName) {
        var spot = getSpot(spotName);
        if (!(spot.slideContent)) {
            dubSlideContents();
        }
        viewModel.slideContent(spot.slideContent);
        viewModel.slideOn(true);
    };

    self.slideOff = function () {
        this.slideOn(false);
    };
};

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

//---------------------------------HELPER FUNCTIONS------------------------------
//

function filterList(userText, modelArray) {
//test array against a regular expression
     var result=[],
         re = new RegExp(userText, ['i']);
     modelArray.forEach( function(element, index, array) {
        if (re.test(element.name)) result.push(element);
     });
     return result;
}

function getSpot(name) {
// returns the view-model object with the given name
    for (var i = 0; i < vmSpots.length; i++) {
      if ( vmSpots[i].name == name ) return vmSpots[i];
    }
}

function resetMarkers(spots) {
// edit the set of displayed markers based on the filtered spotList
    vmSpots.forEach(function(spot) {
        spot.hideMarker();
    });
    spots.forEach(function(item) {
        getSpot(item.name).showMarker();
    });
}

function itchwindow() {
// called in the click event listener of infoWindow
    viewModel.openAPIslide(infowindow.anchor.title);
}

function cleanUpScreen() {
// get rid of old over-lays and lingering effects
    infowindow.close();
    map.setZoom(model.zoomLevel);
    map.setCenter(model.center);
    viewModel.slideOff();
    // reset the hilight and under classes on the spot-list
    $("ul.spot-list li").removeClass("hilight under");
}

function dubSlideContents() {
    if (model.spots[0].slideContent) {
        model.spots.forEach(function(spot, index) {
            vmSpots[index].slideContent = spot.slideContent;
            // in the event that api call fails, we want to re-copy the
            // model locally, to display error message
            localStorage.model = JSON.stringify(model);
        });
    }
}

function narrowScreen() {
  var mediaquery = window.matchMedia( "(max-width: 549px)" );
  if (mediaquery.matches) return true;
}



//===================THE END===================












































































//from https://developer.foursquare.com/overview/auth#userless
//https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=CLIENT_ID&client_secret=CLIENT_SECRET&v=YYYYMMDD

//foursquare.com/v/broadway-station-sushi/4aae9cb7f964a5209b6220e3
var kr = {
    foursquare: {
        Owner: "KR Decker",
        Client_id: "ZVLKTKSGULFEQ3XMWWI3AL1A2KXYBEKD1LKSURUZDGZY41JX",
        Client_secret: "TMT203DHWOPR3R4RSM1HE4RMOKEWLGTT0FLMZMUZ1OJHMAK1"
    },
    yelp: {
        Consumer_Key:    "XrxJOUgGNKq9ZuWhBX1LDw",
        Consumer_Secret: "zr2I76nT8l0O-trkupYE00B9BTA",
        Token:   "-_F8aOxonR6q5SqvURwwgLIdU-qteS-B",
        Token_Secret:    "GF7uRcPWCpzlHcRP3DiJWjvcXJE"
    },
    streetview: {
        key: "AIzaSyAP631z6WqMoptoaGherhJVBGyN1uPHPt4"
    }
};


//}());
