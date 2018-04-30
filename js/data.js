'use strict';

window.dataModule = (function () {
  // Функция, генерирующая объект с данными
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

  return {
    generateData: generateDataб
    generateObjects: generateObjects
  };
})();
