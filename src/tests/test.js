
var channelsExample = {
  "items": [{
    "channel": {
      "urlSafeName": "havornreiret",
      "name": "Havørnreiret"
    },
    "cover_image": "https:\/\/wsvipr.startsiden.no\/images\/41\/55\/41551.jpg",
  }, {
    "channel": {
      "urlSafeName": "hegrekolonien",
      "name": "Hegrekolonien"
    },
    "cover_image": "https:\/\/wsvipr.startsiden.no\/images\/42\/93\/42931.jpg"
  }, {
    "channel": {
      "name": "Tjeldparet",
      "urlSafeName": "tjeldparet"
    },
    "cover_image": "https:\/\/abcnyheter.drpublish.aptoma.no\/out\/images\/article\/\/2016\/05\/18\/195217598\/1\/stor\/2757814.jpg"
  }]
}

describe('ChannelsControl', function () {

  beforeEach(module('MyApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('select channel', function () {
    it('select different from default', inject(function($http) {

      var $scope = {};
    	var controller = $controller('ChannelsControl', { $scope: $scope });
      var result = {
        "channel": {
          "urlSafeName": "hegrekolonien",
          "name": "Hegrekolonien"
        },
        "cover_image": "https:\/\/wsvipr.startsiden.no\/images\/42\/93\/42931.jpg"
      };
      $scope.selectChannel(channelsExample.items[1]);
    	expect(channelsExample.items[1].channel.name).toBe("Hegrekolonien");
      expect(channelsExample.items[1].channel.urlSafeName).toBe("hegrekolonien");

    }));
  });

});


describe('ArticlesControl', function () {

  beforeEach(module('MyApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('select article', function () {
    it('select different articles', inject(function($rootScope, $controller) {
      var scope = $rootScope.$new();
      var controller = $controller('ArticlesControl', { $scope: scope });
      scope.openNewArticles("asd");

      expect(scope.currentOffset).toBe(0);

      scope.openNewArticles("example2");
      expect(scope.currentOffset).toBe(0);
      expect(scope.currentUrlSafeTitle).toBe("example2");
    }));

    it('scroll same article', inject(function($rootScope, $controller) {
      var scope = $rootScope.$new();
      var controller = $controller('ArticlesControl', { $scope: scope });
      scope.openNewArticles("example");

      expect(scope.currentOffset).toBe(0);

      scope.getMoreArticles();
      expect(scope.currentOffset).toBe(10);
      expect(scope.currentUrlSafeTitle).toBe("example");

      scope.getMoreArticles();
      expect(scope.currentOffset).toBe(20);
      expect(scope.currentUrlSafeTitle).toBe("example");
    }));

    it('scroll article and then change', inject(function($rootScope, $controller) {
      var scope = $rootScope.$new();
      var controller = $controller('ArticlesControl', { $scope: scope });
      scope.openNewArticles("example");
      scope.getMoreArticles();
      scope.getMoreArticles();

      expect(scope.currentOffset).toBe(20);
      expect(scope.currentUrlSafeTitle).toBe("example");

      scope.openNewArticles("example2");
      expect(scope.currentOffset).toBe(0);
      expect(scope.currentUrlSafeTitle).toBe("example2");

    }));
  });

});
