'use strict';

window.mapModule = (function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var MAP_MAIN_PIN_SIZE = 65;
  var MAP_MAIN_PIN_ACTIVE_HEIGHT = 87;
  var draggablePin = document.querySelector('.map__pin--main');
  var templateElement = document.querySelector('template');
  var mapEl = document.querySelector('.map');

  // Функция, возвращающая массив объектов со случайными данными
  var generateObjects = function (quantity, data) {
    var objects = [];
    var preparedAvatars = window.util.getShuffledArrayOfCertainLength(quantity, data.avatars);
    var preparedTitles = window.util.getShuffledArrayOfCertainLength(quantity, data.titles);

    for (var i = 0; i < quantity; i++) {
      var object = {};
      var randInt = window.util.getRandomInt(1, data.features.length);

      object.author = {};
      object.author.avatar = preparedAvatars[i];

      object.offer = {};
      var offer = object.offer;
      offer.title = preparedTitles[i];

      object.location = {};
      object.location.x = window.util.getRandomInt(300, 900);
      object.location.y = window.util.getRandomInt(150, 500);

      offer.address = object.location.x + ', ' + object.location.y;
      offer.price = window.util.getRandomInt(1000, 1000000);
      offer.type = window.util.getRandomArrayElement(data.types);
      offer.rooms = window.util.getRandomInt(1, 5);
      offer.guests = window.util.getRandomInt(1, 15);
      offer.checkin = window.util.getRandomArrayElement(data.times);
      offer.checkout = window.util.getRandomArrayElement(data.times);
      offer.features = window.util.getShuffledArrayOfCertainLength(randInt, data.features);

      offer.description = '';
      offer.photos = window.util.shuffleArray(data.photos);

      objects.push(object);
    }

    return objects;
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

  // Обработчик клика по перетаскиваемому пину
  var onDraggablePinClick = function (evt) {
    var objects = generateObjects(8, window.util.generateData());
    showMapData(objects);
    window.formModule.activateForm();
    window.formModule.setAddress(getAddress());
    evt.currentTarget.removeEventListener('mouseup', onDraggablePinClick);
  };

  var onResetButtonClick = function () {
    draggablePin.addEventListener('mouseup', onDraggablePinClick);
    mapEl.classList.add('map--faded');
    window.formModule.setAddress(getAddress());
  };

  window.formModule.resetPageButton.addEventListener('click', onResetButtonClick);
  draggablePin.addEventListener('mouseup', onDraggablePinClick);
  window.formModule.setAddress(getAddress());
})();
