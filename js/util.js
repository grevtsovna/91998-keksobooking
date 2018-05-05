'use strict';

(function () {

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
    errorEl.style.cssText = 'position: fixed; top: 0; left: 0; background: #ed5d50; color: #fff; padding: 10px; width: 100%';
    errorEl.textContent = error;
    document.querySelector('body').appendChild(errorEl);
    setTimeout(function () {
      errorEl.remove();
    }, 5000);
  };

  window.util = {
    getElementCoords: getElementCoords,
    showErrors: showErrors
  };
})();
