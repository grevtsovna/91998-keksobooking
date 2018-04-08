'use strict';

var generateData = function () {
  var data = {};
  data.avatars = [];
  data.titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  data.types = ['palace', 'flat', 'house', 'bungalo'];
  data.times = ['12:00', '13:00', '14:00'];
  data.features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  data.photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  for (var i = 0; i < 8; i++) {
    data.avatars[i] = 'img/avatars/user0' + (i + 1) + '.png';
  }

  return data;
};

// Функция, возвращающая случайное целое число в интервале [min, max]
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция, возвращающая случайный элемент массива
var getRandomArrayElement = function (array) {
  return array[window.getRandomInt(0, array.length - 1)];
};

// Функция, перемешивающая массив
var shuffleArray = function (array) {
  var shuffledArray = array.slice();
  var counter = shuffledArray.length;

  while (counter > 0) {
    var index = Math.floor(Math.random() * counter);
    counter--;

    var swap = shuffledArray[counter];
    shuffledArray[counter] = shuffledArray[index];
    shuffledArray[index] = swap;
  }

  return shuffledArray;
};

// Функция, подготавливающая данные
var prepareData = function (quanity, array) {
  var preparedArr = array.slice();

  if (quanity > preparedArr.length) {
    var diff = Math.ceil((quanity - preparedArr.length) / preparedArr.length);
    var preparedArrCopy = preparedArr.slice();
    for (var i = 0; i < diff; i++) {
      preparedArr = preparedArr.concat(preparedArrCopy);
    }
  }

  return shuffleArray(preparedArr);
};

var generateObjects = function (quanity, data) {
  var objects = [];
  var preparedAvatars = prepareData(quanity, data.avatars);
  var preparedTitles = prepareData(quanity, data.titles);
  for (var i = 0; i < quanity; i++) {
    objects[i] = {};
    var object = objects[i];

    object.author = {};
    object.author.avatar = preparedAvatars[i];

    object.offer = {};
    var offer = object.offer;
    offer.title = preparedTitles[i];

    object.location = {};
    object.location.x = getRandomInt(300, 900);
    object.location.y = getRandomInt(150, 500);

    offer.address = object.location.x + ', ' + object.location.y;
    offer.price = getRandomInt(1000, 1000000);
    offer.type = getRandomArrayElement(data.types);
    offer.rooms = getRandomInt(1, 5);
    offer.guests = getRandomInt(1, 15);
    offer.checkin = getRandomArrayElement(data.times);
    offer.checkout = getRandomArrayElement(data.times);

    var features = [];
    var featuresLength = getRandomInt(1, data.features.length);
    for (var j = 0; j < featuresLength; j++) {
      features[j] = getRandomArrayElement(data.features);
    }
    offer.features = features;

    offer.description = '';
    offer.photos = shuffleArray(data.photos);
  }

  return objects;
};

var objects = generateObjects(8, generateData());

var mapEl = document.querySelector('.map');
mapEl.classList.remove('map--faded');
