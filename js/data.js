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

  return {
    generateData: generateData
  };
})();
