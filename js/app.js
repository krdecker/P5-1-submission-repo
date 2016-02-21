
////////////////////////////////////MODEL/////////////////////////////////////

// eats data: an array of places to eat
// around Commercial-Broadway Station
// East Van
// British Columbia

// basic data, loaded if more detailed model not found in localStorage
var EatsModel = {
    zoomLevel: 18,
    center: {lat: 49.262387, lng: -123.069768},//49.262387, -123.069768
    spots: [
        {
            name: "Uncle Fatih's Pizza",
            location: {lat: 49.262487, lng: -123.070000} //was .262517 .070177
        },
        {
            name: "Buddha's Orient Express",
            location: {lat: 49.262719, lng: -123.069289}
        },
        {
            name: "Booster Juice",
            location: {lat: 49.262641, lng: -123.069438}
        },
        {
            name: "Starbucks Coffee",
            location: {lat: 49.261874, lng: -123.070176}
        },
        {
            name: "Blenz Coffee",
            location: {lat: 49.262534, lng: -123.069529}
        },
        {
            name: "Megabite Pizza",
            location: {lat: 49.262779, lng: -123.069317}
        },
        {
            name: "Broadway Station Sushi",
            location: {lat: 49.262084, lng: -123.070962}
        }
    ]
};

var model = {};

function getModel() {
    if (localStorage.model) {
        return JSON.parse(localStorage.model);
    } else {
        return EatsModel;
    };
};

function buildWindowContent(marker) {
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=200x150&location=' +
                            marker.position.toString() + '';
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
            //success: ,
            error: sendError
    }).success(function(response){
          getVenueInfo(response);
        });
    function getVenueInfo(data) {
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
            //success: ,
            error: sendError
    }).success(function(response){
          formatShowData(response);
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
        spot.slideContent = formattedData;
        console.log(spot.slideContent);
    }
    function sendError(object, error, exception) {
        ajax_error = "Web call failed: " + error ;
        spot.slideContent = ajax_error;
    }
}

/////////////////////////////////////MAP VIEWMODEL////////////////////////////////////

var map;
var eatingSpots = [];
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
        center: {lat: 49.262387, lng: -123.069768},//49.262387, -123.069768
        // Commercial Broadway Station 49°15′45″N, 123°04′08″W
        zoom: 16,
        zoomControl: true,
        scrollwheel: false,
        draggable: true,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        styles: RedRoadsNGreenBusStops
    };

function NoMap() {
    alert("Google Map is unavailable just now.\n" +
        "(you may want to check your internet connection) \n");
}

// invoked by map <script> in index.html
function init() {
    map = new google.maps.Map(document.getElementById('map-div'), mapOptions );
    model = getModel(); // load data object either from localStorage or file
    // then build the slide content with ajax api calls, if necessary
    if (!(model.spots[0].slideContent)) {
        model.spots.forEach( function (spot) {
            buildSlideContent(spot);
        });
    };
    localStorage.model = JSON.stringify(model);
    viewModel.spotList(model.spots);
    infowindow = new google.maps.InfoWindow({});
    map.setZoom(model.zoomLevel);
    map.setCenter(model.center);
    model.spots.forEach( function(spot) {
        eatingSpots.push(new Spot(spot));
    });
    // stay centred
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(model.center);
    });
}

// constructor
var Spot = function(data) {
  var that = this;
  this.name = data.name;
  this.location = data.location;
  this.slideContent = data.slideContent;
  this.marker = new google.maps.Marker({
        position: this.location,
        title: this.name,
        map: map,
        opacity: 0.4
  });
  this.windowContent = buildWindowContent(this.marker);
  this.clickEvent = google.maps.event.addListener(this.marker, "click", function () {
        that.doOpening();
    });
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
    viewModel.listCollapse();
    infowindow.setContent(this.windowContent);
    infowindow.open(map, this.marker);
}

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
    self.filterSlot = ko.observable();
    self.isSelected = ko.observable(false);

    // Behaviours
    self.spotPick = function () {
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
        self.spotList(filterList(data, eatingSpots));
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
        self.listOn(false);
        self.burgerMenu(true);
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
        };
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
//test array against a regular expression
function filterList(userText, modelArray) {
     var result=[],
         re = new RegExp(userText, ['i']);

     modelArray.forEach( function(element, index, array) {
        if (re.test(element.name)) result.push(element);
     });

     return result;
}
function getSpot(name) {
    var result;
    eatingSpots.forEach( function(spot) {
       if (spot.name == name) result = spot;
    });
    return result;
}
function resetMarkers(spots) {
    eatingSpots.forEach( function(spot) {
        spot.hideMarker();
    });
    for (var i in spots) {
        getSpot(spots[i].name).showMarker();
    }
}
function itchwindow() {
    viewModel.openAPIslide(infowindow.anchor.title);
}
function cleanUpScreen() {
    infowindow.close();
    map.setZoom(model.zoomLevel);
    map.setCenter(model.center);
    viewModel.slideOff();
}
function dubSlideContents() {
    if (model.spots[0].slideContent) {
        for (var i in model.spots) {
            eatingSpots[i].slideContent = model.spots[i].slideContent;
            localStorage.model = JSON.stringify(model);
        }
    }
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
    }
};

