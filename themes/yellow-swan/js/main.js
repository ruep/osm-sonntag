(function () {
    'use strict';

    var conf = {};

    // Init functions, called on DOMContentLoaded event
    conf.init = function () {
        conf.map.init($('#map-canvas'));
        conf.menu.init();
    };

    /***
        OpenStreetMap Leaflet implementation geo:47.78936,13.05980?z=19
    ***/

    var mymap = L.map('mapid').setView([47.78936, 13.05980], 15);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mgehling.map-spn9n2kc',
	    accessToken: 'pk.eyJ1IjoibWdlaGxpbmciLCJhIjoiY2ltbno0ZTRuMDAwY3Z0a3A1NG5jeDNsayJ9.hytgxA1ndaWul04CmYVj-w'
	}).addTo(mymap);

    var marker = L.marker([47.78936, 13.05980]).addTo(mymap);
    /***
        Google Maps implementation
    ***/
    conf.map = {
        marker: 'themes/yellow-swan/img/marker-default.png'
    };

    // Google Maps configs
    conf.map.init = function ($element) {
        conf.map.element = $element;

        conf.map.geocoder = new google.maps.Geocoder();

        conf.map.latlng = new google.maps.LatLng(0, 0);

        conf.map.options = {
            zoom: 16,
            center: conf.map.latlng,
            scrollwheel: false,
            streetViewControl: true,
            labels: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        conf.map.canvas = new google.maps.Map(conf.map.element.get(0), conf.map.options);
        conf.map.canvas.setCenter(conf.map.latlng);

        conf.map.createMarker();
    };

    conf.map.createMarker = function () {
        
        conf.map.address = conf.map.element.attr('data-address');

        conf.map.geocoder.geocode({ 'address': conf.map.address}, function (results, status) {

            if (status === google.maps.GeocoderStatus.OK) {

                conf.map.canvas.setCenter(results[0].geometry.location);

                new google.maps.Marker({
                    map: conf.map.canvas,
                    position: results[0].geometry.location,
                    icon: conf.map.marker
                });
            } else {
                if (window.console) {
                    console.log('Google Maps was not loaded: ', status);
                }
            }
        });
    };

    /***
        Create animated scroll for menu links
    ***/
    conf.menu = {
        itemsSelector: '.nav-link[href^="#"]',
        animationSpeed: 400
    };

    conf.menu.init = function () {
        conf.menu.menuItems = $(conf.menu.itemsSelector);
        conf.menu.document = $('html, body');

        conf.menu.menuItems.on('click.animateScroll', function (event) {
            event.preventDefault();

            conf.menu.animateTo(event.target);
        });
    };

    conf.menu.animateTo = function (link) {

        var $link = $(link),
            href = $link.attr('href'),
            offSetTop = $(href).offset().top;
        
        conf.menu.document.finish().animate({scrollTop : offSetTop}, conf.menu.animationSpeed, function () {
            location.hash = href;
        });
    };

    conf.init();
}());