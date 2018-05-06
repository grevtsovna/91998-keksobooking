'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var templateElement = document.querySelector('template');
  var mapEl = document.querySelector('.map');
  var filterElements = document.querySelectorAll('.map__filters select, .map__filters input');
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
      openedPopup.remove();
    }
  };

  var onPopupCloseClick = function () {
    closePopupCard();
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
    for (var i = 0; i < features.length; i++) {
      features[i].style.display = 'none';
    }

    // Отображаем нужные "удобства"
    for (i = 0; i < offer.features.length; i++) {
      var featureClass = '.popup__feature--' + offer.features[i];
      mapCardElement.querySelector(featureClass).style.display = 'inline-block';
    }

    if (offer.features.length === 0) {
      mapCardElement.querySelector('.popup__features').remove();
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

    if (offer.photos.length === 0) {
      mapCardElement.querySelector('.popup__photos').remove();
    }

    mapCardElement.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);

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
    var mapPinsElement = document.querySelector('.map__pins');
    mapEl.classList.remove('map--faded');

    limitedObjects.forEach(function (object) {
      var mapPin = renderMapPin(object);
      mapPin.addEventListener('click', onMapPinClick(object));
      fragment.appendChild(mapPin);
    });

    mapPinsElement.appendChild(fragment);
  };

  var removeMapData = function () {
    var pins = document.querySelectorAll('.map__pins .map__pin:not(.map__pin--main)');
    Array.from(pins).forEach(function (item) {
      item.remove();
    });
  };

  var fadeMap = function () {
    window.map.mapEl.classList.add('map--faded');
    window.pin.resetDraggablePin();
  };

  var addFilterEvents = function (objects) {
    Array.from(filterElements).forEach(function (item) {
      item.addEventListener('change', window.filter.filterObjects(objects));
    });
  };

  window.map = {
    mapEl: mapEl,
    showMapData: showMapData,
    fadeMap: fadeMap,
    removeMapData: removeMapData,
    addFilterEvents: addFilterEvents,
    closePopupCard: closePopupCard
  };
})();
