'use strict';

(function () {
  var MAP_MAIN_PIN_SIZE = 65;
  var MAP_MAIN_PIN_ACTIVE_HEIGHT = 87;
  var MAX_TOP_MAIN_PIN_POSITION = 150 - MAP_MAIN_PIN_ACTIVE_HEIGHT;
  var MAX_BOTTOM_MAIN_PIN_POSITION = 500 - MAP_MAIN_PIN_ACTIVE_HEIGHT;
  var DEFAULT_DRAGGABLE_PIN_Z_INDEX = '1';
  var ACTIVE_DRAGGABLE_PIN_Z_INDEX = '10';
  var draggablePin = document.querySelector('.map__pin--main');
  var draggablePinStartPosition = {
    left: draggablePin.style.left,
    top: draggablePin.style.top
  };

  var getAddress = function () {
    var offsetX = MAP_MAIN_PIN_SIZE / 2;
    var offsetY;

    if (window.map.wrapper.classList.contains('map--faded')) {
      offsetY = MAP_MAIN_PIN_SIZE / 2;
    } else {
      offsetY = MAP_MAIN_PIN_ACTIVE_HEIGHT;
    }
    var coordinateX = parseFloat(draggablePin.style.left) + offsetX;
    var coordinateY = parseFloat(draggablePin.style.top) + offsetY;

    return Math.round(coordinateX) + ', ' + Math.round(coordinateY);
  };

  var onDraggablePinMouseUp = function (evt) {
    var onSuccessLoad = function (objects) {
      window.map.showData(objects);
      window.filter.addEvents(objects);
    };
    window.backend.loadData(onSuccessLoad, window.util.showErrors);
    window.form.activate();
    evt.currentTarget.removeEventListener('mouseup', onDraggablePinMouseUp);
  };

  var onDraggablePinMouseDown = function (evt) {
    var pin = evt.currentTarget;
    var pinsContainerParameters = window.map.getPinsContainerParameters();
    var start = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (evtMove) {
      var shift = {
        x: start.x - evtMove.clientX,
        y: start.y - evtMove.clientY
      };
      var newCoordinates = {
        x: pin.offsetLeft - shift.x,
        y: pin.offsetTop - shift.y
      };
      var cursorCoordinates = {
        x: evtMove.clientX + pageXOffset,
        y: evtMove.clientY + pageYOffset
      };

      start.x = evtMove.clientX;
      start.y = evtMove.clientY;
      pin.style.top = newCoordinates.y + 'px';
      pin.style.left = newCoordinates.x + 'px';

      // Ограничения площади перетаскивания пина
      if (newCoordinates.y < MAX_TOP_MAIN_PIN_POSITION ||
          cursorCoordinates.y < MAX_TOP_MAIN_PIN_POSITION) {
        pin.style.top = MAX_TOP_MAIN_PIN_POSITION + 'px';
      }
      if (newCoordinates.y > MAX_BOTTOM_MAIN_PIN_POSITION ||
          cursorCoordinates.y > MAX_BOTTOM_MAIN_PIN_POSITION + MAP_MAIN_PIN_ACTIVE_HEIGHT) {
        pin.style.top = MAX_BOTTOM_MAIN_PIN_POSITION + 'px';
      }
      if (newCoordinates.x < 0 ||
          cursorCoordinates.x < pinsContainerParameters.pinsContainerCoordinates.left) {
        pin.style.left = '0';
      }
      if (newCoordinates.x > (pinsContainerParameters.pinsContainerWidth - MAP_MAIN_PIN_SIZE) ||
          cursorCoordinates.x > pinsContainerParameters.pinsContainerCoordinates.right) {
        pin.style.left = pinsContainerParameters.pinsContainerWidth - MAP_MAIN_PIN_SIZE + 'px';
      }

      window.form.setAddress(getAddress());
    };

    var onMouseUp = function () {
      window.form.setAddress(getAddress());
      pin.style.zIndex = DEFAULT_DRAGGABLE_PIN_Z_INDEX;
      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    pin.style.zIndex = ACTIVE_DRAGGABLE_PIN_Z_INDEX;
  };

  var resetDraggablePin = function () {
    draggablePin.addEventListener('mouseup', onDraggablePinMouseUp);
    draggablePin.style.left = draggablePinStartPosition.left;
    draggablePin.style.top = draggablePinStartPosition.top;
    window.form.setAddress(getAddress());
  };

  draggablePin.addEventListener('mousedown', onDraggablePinMouseDown);
  draggablePin.addEventListener('mouseup', onDraggablePinMouseUp);
  window.form.setAddress(getAddress());

  window.pin = {
    resetDraggablePin: resetDraggablePin
  };
})();
