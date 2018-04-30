'use strict';

window.mapModule = (function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var MAP_MAIN_PIN_SIZE = 65;
  var MAP_MAIN_PIN_ACTIVE_HEIGHT = 87;
  var MAX_TOP_MAIN_PIN_POSITION = 150;
  var MAX_BOTTOM_MAIN_PIN_POSITION = 500;
  var draggablePin = document.querySelector('.map__pin--main');
  var draggablePinStartPosition = {
    left: draggablePin.style.left,
    top: draggablePin.style.top
  };
  var templateElement = document.querySelector('template');
  var mapEl = document.querySelector('.map');

  var renderMapPin = function (object) {
    var mapPinTemplate = templateElement.content.querySelector('.map__pin');
    var mapPinElement = mapPinTemplate.cloneNode(true);
    var mapPinImageElement = mapPinElement.querySelector('img');
    var coordX = object.location.x - MAP_PIN_WIDTH / 2;
    var coordY = object.location.y - MAP_PIN_HEIGHT;

    mapPinElement.style.left = coordX + 'px';
    mapPinElement.style.top = coordY + 'px';
    mapPinImageElement.src = object.author.avatar;
    mapPinImageElement.alt = object.offer.title;

    return mapPinElement;
  };

  var onPopupCloseClick = function () {
    document.querySelector('.map__card.popup').remove();
  };

  var getOfferType = function (offerType) {
    var type = '';

    switch (offerType) {
      case 'flat' :
        type = 'Квартира';
        break;
      case 'bungalo' :
        type = 'Бунгало';
        break;
      case 'house' :
        type = 'Дом';
        break;
      case 'palace' :
        type = 'Дворец';
        break;
      default :
        type = 'Неизвестный тип жилья';
    }

    return type;
  };

  var renderMapCard = function (object) {
    var mapCardElement = templateElement.content.querySelector('.map__card').cloneNode(true);
    var offer = object.offer;
    var type = getOfferType(offer.type);
    var features = mapCardElement.querySelectorAll('.popup__feature');

    mapCardElement.querySelector('.popup__title').textContent = offer.title;
    mapCardElement.querySelector('.popup__text--address').textContent = offer.address;
    mapCardElement.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
    mapCardElement.querySelector('.popup__type').textContent = type;
    mapCardElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
    mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
    mapCardElement.querySelector('.popup__description').textContent = offer.description;
    mapCardElement.querySelector('.popup__avatar').src = object.author.avatar;

    // Скрываем все "удобства"
    for (var i = 0; i < features.length; i++) {
      features[i].style.display = 'none';
    }

    // Отображаем нужные "удобства"
    for (i = 0; i < offer.features.length; i++) {
      var featureClass = '.popup__feature--' + offer.features[i];
      mapCardElement.querySelector(featureClass).style.display = 'inline-block';
    }

    for (i = 0; i < offer.photos.length; i++) {
      if (i === 0) {
        mapCardElement.querySelector('.popup__photos img').src = offer.photos[i];
        continue;
      }

      var photo = document.createElement('img');
      photo.src = offer.photos[i];
      photo.alt = 'Фотография жилья';
      photo.width = 45;
      photo.height = 40;
      photo.classList.add('popup__photo');

      mapCardElement.querySelector('.popup__photos').appendChild(photo);
    }

    mapCardElement.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);

    return mapCardElement;
  };

  var onMapPinClick = function (object) {
    return function () {
      var openedPopup = document.querySelector('.map__card.popup');
      if (document.body.contains(openedPopup)) {
        openedPopup.remove();
      }
      var mapCard = renderMapCard(object);
      document.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', mapCard);
    };
  };

  var showMapData = function (objects) {
    var fragment = document.createDocumentFragment();
    var mapPinsElement = document.querySelector('.map__pins');

    mapEl.classList.remove('map--faded');

    for (var i = 0; i < objects.length; i++) {
      var mapPin = renderMapPin(objects[i]);
      mapPin.addEventListener('click', onMapPinClick(objects[i]));
      fragment.appendChild(mapPin);
    }

    mapPinsElement.appendChild(fragment);
  };

  var getAddress = function () {
    var mainPin = document.querySelector('.map__pin--main');
    var offsetX = MAP_MAIN_PIN_SIZE / 2;
    var offsetY;

    if (mapEl.classList.contains('map--faded')) {
      offsetY = MAP_MAIN_PIN_SIZE / 2;
    } else {
      offsetY = MAP_MAIN_PIN_ACTIVE_HEIGHT;
    }
    var coordX = parseFloat(mainPin.style.left) + offsetX;
    var coordY = parseFloat(mainPin.style.top) + offsetY;

    return coordX + ', ' + coordY;
  };

  var onDraggablePinMouseUp = function (evt) {
    var objects = window.dataModule.generateObjects(8, window.dataModule.generateData());
    showMapData(objects);
    window.formModule.activateForm();
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

      window.formModule.setAddress(getAddress());
    };
    var onMouseUp = function () {
      window.formModule.setAddress(getAddress());
      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var fadeMap = function () {
    draggablePin.addEventListener('mouseup', onDraggablePinMouseUp);
    draggablePin.style.left = draggablePinStartPosition.left;
    draggablePin.style.top = draggablePinStartPosition.top;
    mapEl.classList.add('map--faded');
    window.formModule.setAddress(getAddress());
  };

  draggablePin.addEventListener('mousedown', onDraggablePinMouseDown);
  draggablePin.addEventListener('mouseup', onDraggablePinMouseUp);
  window.formModule.setAddress(getAddress());

  return {
    fadeMap: fadeMap
  };
})();
