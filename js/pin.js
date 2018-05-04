'use strict';

(function () {
  var MAP_MAIN_PIN_SIZE = 65;
  var MAP_MAIN_PIN_ACTIVE_HEIGHT = 87;
  var MAX_TOP_MAIN_PIN_POSITION = 150;
  var MAX_BOTTOM_MAIN_PIN_POSITION = 500;
  var draggablePin = document.querySelector('.map__pin--main');
  var draggablePinStartPosition = {
    left: draggablePin.style.left,
    top: draggablePin.style.top
  };

  var getAddress = function () {
    var mainPin = document.querySelector('.map__pin--main');
    var offsetX = MAP_MAIN_PIN_SIZE / 2;
    var offsetY;

    if (window.rendering.mapEl.classList.contains('map--faded')) {
      offsetY = MAP_MAIN_PIN_SIZE / 2;
    } else {
      offsetY = MAP_MAIN_PIN_ACTIVE_HEIGHT;
    }
    var coordX = parseFloat(mainPin.style.left) + offsetX;
    var coordY = parseFloat(mainPin.style.top) + offsetY;

    return coordX + ', ' + coordY;
  };

  var onDraggablePinMouseUp = function (evt) {
    window.data.loadObjects();
    window.form.activateForm();
    evt.currentTarget.removeEventListener('mouseup', onDraggablePinMouseUp);
  };

  var onDraggablePinMouseDown = function (evt) {
    var pin = evt.currentTarget;
    var pinContainer = document.querySelector('.map__pins');
    var pinContainerWidth = pinContainer.offsetWidth;
    var pinContainerCoords = window.util.getElementCoords(pinContainer);
    var start = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (evtMove) {
      var shift = {
        x: start.x - evtMove.clientX,
        y: start.y - evtMove.clientY
      };
      var newCoords = {
        x: pin.offsetLeft - shift.x,
        y: pin.offsetTop - shift.y
      };
      var cursorCoords = {
        x: evtMove.clientX + pageXOffset,
        y: evtMove.clientY + pageYOffset
      };

      start.x = evtMove.clientX;
      start.y = evtMove.clientY;
      pin.style.top = newCoords.y + 'px';
      pin.style.left = newCoords.x + 'px';

      // Ограничения площади перетаскивания пина
      if (newCoords.y < MAX_TOP_MAIN_PIN_POSITION || cursorCoords.y < MAX_TOP_MAIN_PIN_POSITION) {
        pin.style.top = MAX_TOP_MAIN_PIN_POSITION + 'px';
      }
      if (newCoords.y > MAX_BOTTOM_MAIN_PIN_POSITION || cursorCoords.y > MAX_BOTTOM_MAIN_PIN_POSITION) {
        pin.style.top = MAX_BOTTOM_MAIN_PIN_POSITION + 'px';
      }
      if (newCoords.x < 0 || cursorCoords.x < pinContainerCoords.left) {
        pin.style.left = '0';
      }
      if (newCoords.x > (pinContainerWidth - MAP_MAIN_PIN_SIZE) || cursorCoords.x > pinContainerCoords.right) {
        pin.style.left = pinContainerWidth - MAP_MAIN_PIN_SIZE + 'px';
      }

      window.form.setAddress(getAddress());
    };
    var onMouseUp = function () {
      window.form.setAddress(getAddress());
      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var fadeMap = function () {
    draggablePin.addEventListener('mouseup', onDraggablePinMouseUp);
    draggablePin.style.left = draggablePinStartPosition.left;
    draggablePin.style.top = draggablePinStartPosition.top;
    window.rendering.mapEl.classList.add('map--faded');
    window.form.setAddress(getAddress());
  };

  draggablePin.addEventListener('mousedown', onDraggablePinMouseDown);
  draggablePin.addEventListener('mouseup', onDraggablePinMouseUp);
  window.form.setAddress(getAddress());

  window.pin = {
    fadeMap: fadeMap
  };
})();
