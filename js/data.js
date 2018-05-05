'use strict';

(function () {

  var loadObjects = function () {
    var onSuccess = function (objects) {
      window.rendering.showMapData(objects);
    };

    window.backend.loadData(onSuccess, window.backend.showErrors);
  };

  window.data = {
    loadObjects: loadObjects
  };
})();
