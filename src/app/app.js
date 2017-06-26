/**
 * @author Guillermo Constantino <guilleconstantino@gmail.com>
 */

var app = angular.module("MyApp", ['angular-loading-bar', ]);


var DEFAULT_CHANNEL_NUMBER = 0;
var DEFAULT_OFFSET = 10;
var DEFAULT_HEIGHT_FOR_SCROLL = 100;
var DEFAULT_TIMEFRAME_BETWEEN_AUTOLOAD = 2000;


app.controller("ChannelsControl", function($rootScope, $scope, $http, $location) {

  /**
   * Save the state of the selected channel
   * @param {Object} channel
   * @fires ArticlesControl#channelSelected
   */
  $scope.selectChannel = function(channel) {
    $scope.selectedChannel = channel;
    $rootScope.$broadcast('channelSelected', channel);
  }

  var url = 'https://ws.zooom.no/v1/channels?callback=JSON_CALLBACK';

  $http.jsonp(url)
    .success(function(data){

      $scope.channels = data.items;

      // Set properly bg style
      data.items.map(setChannelStyle);

      // Select channel from path
      var pathSelected = $location.path().slice(1);
      data.items.forEach(function checkIfChannelHasBeenSelected(el, n) {
        if (el.channel.urlSafeName == pathSelected) {
          $scope.selectChannel(el);
          $scope.selectedChannelNumber = n;
        }
      });

      // Otherwise select first channel
      if ($scope.channels.length && !$scope.selectedChannel) {
        var defaultChannel = $scope.channels[DEFAULT_CHANNEL_NUMBER];
        $scope.selectChannel(defaultChannel);

      }

      // Use jQuery to create a dynamic menu (js/menu.js)
      displaySlickMenu();

    })
    .error(function(){
      alert("Error retrieving data from server");
    });

});



app.controller("ArticlesControl", function($window, $scope, $filter, $http, $location, $sce) {

  $scope.currentOffset = 0;
  $scope.articles = [];

  /**
   * Retrieve articles from server.
   * @param {string} urlSafeTitle - url title. Example: "havornreiret"
   * @param {integer} offset - Allows to get more articles
   */
  $scope._getArticles = function(urlSafeTitle, offset) {
    if (urlSafeTitle) {
      $scope.currentUrlSafeTitle = urlSafeTitle;
      $scope.currentOffset += offset;

      var url = 'https://ws.zooom.no/v1/articles/' + urlSafeTitle + '?limit=10&offset=' + $scope.currentOffset + '&callback=JSON_CALLBACK';

      $http.jsonp(url)
        .success(function(data){

          // Add extra attributes to article
          data.items.map(setArticleExtraAttributes);
          // Process html data
          var link = '<a href="#" class="read-more">Les mer</a>';
          data.items.map(function(element) {
            element.html = $sce.trustAsHtml(element.contents.preamble + link);
          });

          // Reset the array or just push new elements to the end
          if (offset == 0) {
            $scope.articles = data.items;
          } else {
            data.items.forEach(function(element) {
              $scope.articles.push(element);
            });
          }

          // Show articles in reverse chronological order
          $scope.articles = $filter('orderBy')($scope.articles, '-date', false);
        })
        .error(function(){
          alert("Error retrieving data from server 2");
        });;
    }
  }

  /**
   * Open a new section
   * @param {string} urlSafeTitle - url title. Example: "havornreiret"
   */
  $scope.openNewArticles = function(urlSafeTitle) {
    $scope.currentOffset = 0;
    $scope._getArticles(urlSafeTitle, 0);
  }

  /**
   * Allows to retrieve articles using the same urlSafeTitle
   */
  $scope.getMoreArticles = function() {
    $scope._getArticles($scope.currentUrlSafeTitle, DEFAULT_OFFSET);
  }

  /**
   * Observe a new value from ChannelsControl.selectChannel, and open the new section
   */
  $scope.$on('channelSelected', function (event, arg) {
    $scope.openNewArticles(arg.channel.urlSafeName);
  });

  /**
   * Check if it should retrieve more articles
   */
  $window.onscroll = function() {
    if($(window).scrollTop() + $(window).height() > $(document).height() - DEFAULT_HEIGHT_FOR_SCROLL) {
      if (isTimeForAutoload()) {
        $scope.getMoreArticles();
      }

    }
  };

});

if (!navigator.onLine) {
  alert("No internet connection");
}
