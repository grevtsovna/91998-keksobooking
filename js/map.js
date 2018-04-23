'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var MAP_MAIN_PIN_SIZE = 65;
  var MAP_MAIN_PIN_ACTIVE_HEIGHT = 87;
  var templateElement = document.querySelector('template');

  // Функция, возвращающая массив объектов со случайными данными
  var generateObjects = function (quanity, data) {
    var objects = [];
    var preparedAvatars = window.util.prepareData(quanity, data.avatars);
    var preparedTitles = window.util.prepareData(quanity, data.titles);
    var features = [];
    var featuresLength = window.util.getRandomInt(1, data.features.length);
    var prepearedFeatures = window.util.prepareData(featuresLength, data.features);

    for (var i = 0; i < quanity; i++) {
      objects[i] = {};
      var object = objects[i];

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

      for (var j = 0; j < featuresLength; j++) {
        features[j] = prepearedFeatures[j];
      }

      offer.features = features;
      offer.description = '';
      offer.photos = window.util.shuffleArray(data.photos);
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

  var renderMapCard = function (object) {
    var mapCardElement = templateElement.content.querySelector('.map__card').cloneNode(true);
    var offer = object.offer;
    var type;
    var features = mapCardElement.querySelectorAll('.popup__feature');

    switch (offer.type) {
      case 'flat' :
        type = 'Квартира';
        break;
      case 'bungalo' :
        type = 'Бунгало';
        break;
      case 'house' :
        type = 'Дом';
        break;
      default :
        type = 'Неизвестный тип жилья';
    }

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
    var mapEl = document.querySelector('.map');
    var fragment = document.createDocumentFragment();
    var mapPinsElement = document.querySelector('.map__pins');

    mapEl.classList.remove('map--faded');

    for (var i = 0; i < objects.length; i++) {
      var mapPin = renderMapPin(objects[i]);
      mapPin.id = i;
      mapPin.addEventListener('click', onMapPinClick(objects[i]));
      fragment.appendChild(mapPin);
    }

    mapPinsElement.appendChild(fragment);
  };
  // Функция, записывающая координаты метки в поле адреса
  var setAddress = function () {
    var mainPin = document.querySelector('.map__pin--main');
    var offsetX = MAP_MAIN_PIN_SIZE / 2;
    var offsetY;

    if (document.querySelector('.map').classList.contains('map--faded')) {
      offsetY = MAP_MAIN_PIN_SIZE / 2;
    } else {
      offsetY = MAP_MAIN_PIN_ACTIVE_HEIGHT;
    }
    var coordX = parseFloat(mainPin.style.left) + offsetX;
    var coordY = parseFloat(mainPin.style.top) + offsetY;

    document.querySelector('#address').value = coordX + ', ' + coordY;
  };

  // Обработчик клика по перетаскиваемому пину
  var onDraggablePinClick = function (evt) {
    var objects = generateObjects(8, window.util.generateData());
    showMapData(objects);
    window.util.activateForm();
    setAddress();
    evt.currentTarget.removeEventListener('mouseup', onDraggablePinClick);
  };

  window.util.draggablePin.addEventListener('mouseup', onDraggablePinClick);
  setAddress();
})();

(function () {
  var PALACE_ROOM_NUMBER = 100;

  var mainForm = window.util.mainForm;
  var submitForm = mainForm.querySelector('.ad-form__submit');
  var resetPageButton = mainForm.querySelector('.ad-form__reset');

  // Функция, деактивирующая поля формы
  var disableFormFieldsets = function () {
    for (var i = 0; i < window.util.fieldsets.length; i++) {
      window.util.fieldsets[i].setAttribute('disabled', 'disabled');
    }
  };

  var onRoomTypeChange = function (evt) {
    var priceInput = mainForm.querySelector('#price');

    switch (evt.target.value) {
      case 'bungalo':
        priceInput.min = '0';
        priceInput.placeholder = '0';
        break;
      case 'flat':
        priceInput.min = '1000';
        priceInput.placeholder = '1 000';
        break;
      case 'house':
        priceInput.min = '5000';
        priceInput.placeholder = '5 000';
        break;
      case 'palace':
        priceInput.min = '10000';
        priceInput.placeholder = '10 000';
    }
  };

  var onTimeInputsChange = function (evt) {
    if (evt.currentTarget.id === 'timein') {
      mainForm.querySelector('#timeout').value = evt.currentTarget.value;
    } else {
      mainForm.querySelector('#timein').value = evt.currentTarget.value;
    }
  };

  var validateRoomNumber = function () {
    var capacityEl = mainForm.querySelector('#capacity');
    var roomNumberEl = mainForm.querySelector('#room_number');
    var capacityValue = parseInt(capacityEl.value, 10);
    var roomNumberValue = parseInt(roomNumberEl.value, 10);

    if (capacityValue > roomNumberValue) {
      capacityEl.setCustomValidity('Количество гостей не может быть больше количества комнат');
    } else if (capacityValue === 0 && roomNumberValue !== PALACE_ROOM_NUMBER) {
      capacityEl.setCustomValidity('Этот вариант подходит только для тех помещений, в которых 100 комнат');
    } else {
      capacityEl.setCustomValidity('');
    }
  };

  var checkAllInputs = function () {
    var mainFormInputs = mainForm.querySelectorAll('input, select');
    for (var i = 0; i < mainFormInputs.length; i++) {
      if (mainFormInputs[i].validity.valid) {
        mainFormInputs[i].style.border = '';
      } else {
        mainFormInputs[i].style.border = '1px solid red';
      }
    }
  };

  var validateForm = function () {
    validateRoomNumber();
    checkAllInputs();
  };

  var clearValidationStyle = function () {
    var mainFormInputs = mainForm.querySelectorAll('input, select');
    for (var i = 0; i < mainFormInputs.length; i++) {
      mainFormInputs[i].style.border = '';
    }
  };

  var resetPage = function () {
    var similarObjectsPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var mapCard = document.querySelector('.map__card');

    for (var i = 0; i < similarObjectsPins.length; i++) {
      similarObjectsPins[i].remove();
    }
    if (document.contains(mapCard)) {
      mapCard.remove();
    }
    clearValidationStyle();
    disableFormFieldsets();
    mainForm.classList.add('ad-form--disabled');
    for (i = 0; i < window.util.fieldsets.length; i++) {
      window.util.fieldsets[i].removeAttribute('disabled');
    }
    window.util.draggablePin.addEventListener('mouseup', onDraggablePinClick);
    setAddress();
  };

  var onSubmitButtonClick = function () {
    validateForm();
  };

  var onRoomNumberChange = function () {
    validateRoomNumber();
  };

  var onCapacityChange = function () {
    validateRoomNumber();
  };

  var onResetPageButtonClick = function () {
    resetPage();
  };


  submitForm.addEventListener('click', onSubmitButtonClick);
  mainForm.querySelector('#room_number').addEventListener('change', onRoomNumberChange);
  mainForm.querySelector('#capacity').addEventListener('change', onCapacityChange);
  mainForm.querySelector('#timein').addEventListener('change', onTimeInputsChange);
  mainForm.querySelector('#timeout').addEventListener('change', onTimeInputsChange);
  mainForm.querySelector('#type').addEventListener('change', onRoomTypeChange);
  resetPageButton.addEventListener('click', onResetPageButtonClick);

  disableFormFieldsets();
})();
