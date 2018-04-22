'use strict';

window.util = (function () {
  return {
    // Функция, генерирующая объект с данными
    generateData: function () {
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
    },

    // Функция, возвращающая случайное целое число в интервале [min, max]
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Функция, возвращающая случайный элемент массива
    getRandomArrayElement: function (array) {
      return array[window.getRandomInt(0, array.length - 1)];
    },

    // Функция, перемешивающая массив
    shuffleArray: function (array) {
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
    },

    // Функция, подготавливающая данные
    prepareData: function (quanity, array) {
      var preparedArr = array.slice();

      if (quanity > preparedArr.length) {
        var diff = Math.ceil((quanity - preparedArr.length) / preparedArr.length);
        var preparedArrCopy = preparedArr.slice();
        for (var i = 0; i < diff; i++) {
          preparedArr = preparedArr.concat(preparedArrCopy);
        }
      }

      return this.shuffleArray(preparedArr);
    }
  };
})();
