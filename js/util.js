'use strict';

(function () {
  // Функция, возвращающая случайное целое число в интервале [min, max]
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Функция, возвращающая случайный элемент массива
  var getRandomArrayElement = function (array) {
    return array[getRandomInt(0, array.length - 1)];
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
  var getShuffledArrayOfCertainLength = function (quantity, array) {
    var preparedArr = shuffleArray(array.slice());

    if (quantity > preparedArr.length) {
      var diff = Math.ceil((quantity - preparedArr.length) / preparedArr.length);
      var preparedArrCopy = preparedArr.slice();
      for (var i = 0; i < diff; i++) {
        preparedArr = preparedArr.concat(preparedArrCopy);
      }
    }

    return preparedArr.slice(0, quantity + 1);
  };

  var getElementCoords = function (element) {
    var coords = element.getBoundingClientRect();

    return {
      top: coords.top - pageYOffset,
      left: coords.left - pageXOffset,
      right: coords.left - pageXOffset + element.offsetWidth
    };
  };

  window.util = {
    getRandomInt: getRandomInt,
    getRandomArrayElement: getRandomArrayElement,
    shuffleArray: shuffleArray,
    getShuffledArrayOfCertainLength: getShuffledArrayOfCertainLength,
    getElementCoords: getElementCoords
  };
})();
