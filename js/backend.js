'use strict';

window.backendModule = (function () {
  var loadData = function (url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      }
    });

    xhr.responseType = 'json';
    xhr.timeout = 5000;
    xhr.open('GET', url);
    xhr.send();
  };

  return {
    loadData: loadData
  };
})();
