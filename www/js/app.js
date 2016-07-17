// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('homePage', {
        url: '/',
        templateUrl: 'index.html'
      });

    $urlRouterProvider.otherwise('/');

  })


  .controller('HomeCtrl', function ($scope, $http) {
    var autocomplete;

    var uberClientID = 'WffoDdDVenbVGpKBQvIR8U0WXV9kVppo';
    var uberServerToken = 'fZuWxpEbJJIjryfMfaupBDXYxUB1ebV09vBY5lhf';
    var googleAPIKey = 'AIzaSyDxZN7Mqb17tRIJvvq3D5_fB8zdzP9dRzg';
    $scope.prices = this;

    $scope.initAutocomplete = function () {
      // Create the autocomplete object, restricting the search to geographical
      // location types.
      autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('autocomplete')),
        {types: ['geocode']});
      autocomplete.addListener('place_changed', $scope.addressSelected);

    };

    $scope.addressSelected = function () {
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
        + document.getElementById('autocomplete').value
        + '&key='+googleAPIKey;
      console.log(url);

      $http.get(url)
        .success(function (data) {
          console.log("Data found");
          console.log(data);
          $scope.destLatitude = data.results[0].geometry.location.lat;
          $scope.destLongitude = data.results[0].geometry.location.lng;
        })

    };

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    $scope.geolocate = function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          $scope.startLat = position.coords.latitude;
          $scope.startLong = position.coords.longitude;
          console.log("Starting position found!")
        });
      }
    };

    var prices = this;

    $scope.getPrice = function () {
      var url = 'https://api.uber.com/v1/estimates/price?';
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);
          console.log(data);
          prices.data = data.prices;
          console.log(prices.data);
          $scope.$apply();
        }
      };
      xhr.open('GET', url+'start_latitude='+$scope.startLat+'&start_longitude='+$scope.startLong
        +'&end_latitude='+$scope.destLatitude+'&end_longitude='+$scope.destLongitude+'&seat_count=1');
      xhr.setRequestHeader("Authorization", "Token " + uberServerToken);
      xhr.withCredentials = false;
      xhr.send();

    }

  });
