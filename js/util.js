'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var getElementCoords = function (element) {
    var coords = element.getBoundingClientRect();

    return {
      top: coords.top - pageYOffset,
      left: coords.left - pageXOffset,
      right: coords.left - pageXOffset + element.offsetWidth
    };
  };

  var showErrors = function (error) {
    var errorEl = document.createElement('div');
    errorEl.style.cssText = 'position: fixed; top: 0; left: 0; background: #ed5d50; color: #fff; padding: 10px; width: 100%; z-index: 100;';
    errorEl.textContent = error;
    document.querySelector('body').appendChild(errorEl);
    setTimeout(function () {
      errorEl.remove();
    }, 5000);
  };

  var debounce = function (func, debouncePeriod) {
    var lastTimeout;
    return function () {
      var _args = arguments;
      var callFunc = function () {
        func.apply(null, _args);
      };
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(callFunc, debouncePeriod);
    };
  };

  var chekImage = function (file) {
    var fileName = file.name.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  window.util = {
    getElementCoords: getElementCoords,
    showErrors: showErrors,
    debounce: debounce,
    checkImage: chekImage
  };
})();
