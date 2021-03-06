'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27;
  var templateElement = document.querySelector('template');
  var mapEl = document.querySelector('.map');
  var mapFiltersEl = document.querySelector('.map__filters');
  var filterElements = mapFiltersEl.querySelectorAll('select, input');
  var mapPinsElement = document.querySelector('.map__pins');
  var offerTypeMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

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

  var closePopupCard = function () {
    var openedPopup = document.querySelector('.map__card.popup');
    if (document.body.contains(openedPopup)) {
      document.removeEventListener('keydown', onDocumentKeydown);
      openedPopup.remove();
    }
  };

  var onPopupCloseClick = function () {
    closePopupCard();
  };

  var onDocumentKeydown = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopupCard();
    }
  };

  var renderMapCard = function (object) {
    var mapCardElement = templateElement.content.querySelector('.map__card').cloneNode(true);
    var offer = object.offer;
    var type = offerTypeMap[offer.type];
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
    Array.from(features).forEach(function (feature) {
      feature.style.display = 'none';
    });

    // Отображаем нужные "удобства"
    offer.features.forEach(function (feature) {
      var featureClass = '.popup__feature--' + feature;
      mapCardElement.querySelector(featureClass).style.display = 'inline-block';
    });

    if (offer.features.length === 0) {
      mapCardElement.querySelector('.popup__features').remove();
    }

    offer.photos.forEach(function (item, i) {
      if (i === 0) {
        mapCardElement.querySelector('.popup__photos img').src = item;
        return;
      }

      var photo = document.createElement('img');
      photo.src = item;
      photo.alt = 'Фотография жилья';
      photo.width = 45;
      photo.height = 40;
      photo.classList.add('popup__photo');

      mapCardElement.querySelector('.popup__photos').appendChild(photo);
    });

    if (offer.photos.length === 0) {
      mapCardElement.querySelector('.popup__photos').remove();
    }

    mapCardElement.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);
    window.document.addEventListener('keydown', onDocumentKeydown);

    return mapCardElement;
  };

  var onMapPinClick = function (object) {
    return function () {
      closePopupCard();
      var mapCard = renderMapCard(object);
      document.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', mapCard);
    };
  };

  var showMapData = function (objects) {
    var limitedObjects = objects.slice(0, 5);
    var fragment = document.createDocumentFragment();
    mapEl.classList.remove('map--faded');

    limitedObjects.forEach(function (object) {
      var mapPin = renderMapPin(object);
      mapPin.addEventListener('click', onMapPinClick(object));
      fragment.appendChild(mapPin);
    });

    mapPinsElement.appendChild(fragment);
  };

  var removeMapData = function () {
    var pins = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    Array.from(pins).forEach(function (item) {
      item.remove();
    });
  };

  var fadeMap = function () {
    window.map.mapEl.classList.add('map--faded');
    window.pin.resetDraggablePin();
  };

  var runFilter = function (objects) {
    return function () {
      var filteredObjects = window.filter.filterObjects(objects);
      removeMapData();
      closePopupCard();
      showMapData(filteredObjects);
    };
  };

  var addFilterEvents = function (objects) {
    var debouncedFilterObject = window.util.debounce(runFilter(objects), 500);
    Array.from(filterElements).forEach(function (item) {
      item.addEventListener('change', debouncedFilterObject);
    });
  };

  window.map = {
    mapEl: mapEl,
    showMapData: showMapData,
    fadeMap: fadeMap,
    addFilterEvents: addFilterEvents
  };
})();
