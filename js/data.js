'use strict';

(function () {

  var loadObjects = function () {
    var onSuccess = function (objects) {
      window.rendering.showMapData(objects);
    };

    window.backend.loadData(onSuccess, window.util.showErrors);
  };

  window.data = {
    loadObjects: loadObjects
  };
})();
