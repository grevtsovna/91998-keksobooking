'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var ERROR_MESSAGE_TIMEOUT = 5000;

  var getElementCoordinates = function (element) {
    var coordinates = element.getBoundingClientRect();

    return {
      top: coordinates.top - pageYOffset,
      left: coordinates.left - pageXOffset,
      right: coordinates.left - pageXOffset + element.offsetWidth
    };
  };

  var showErrors = function (error) {
    var errorElement = document.createElement('div');
    errorElement.style.cssText = 'position: fixed; top: 0; left: 0; background: #ed5d50; color: #fff; padding: 10px; width: 100%; z-index: 100;';
    errorElement.textContent = error;
    document.querySelector('body').appendChild(errorElement);
    setTimeout(function () {
      errorElement.remove();
    }, ERROR_MESSAGE_TIMEOUT);
  };

  var debounce = function (debouncedFunction, debouncePeriod) {
    var lastTimeout;
    return function () {
      var _receivedArguments = arguments;
      var callFunc = function () {
        debouncedFunction.apply(null, _receivedArguments);
      };
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(callFunc, debouncePeriod);
    };
  };

  var checkImage = function (file) {
    var fileName = file.name.toLowerCase();
    return FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });
  };

  window.util = {
    getElementCoordinates: getElementCoordinates,
    showErrors: showErrors,
    debounce: debounce,
    checkImage: checkImage
  };
})();
