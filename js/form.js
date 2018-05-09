'use strict';

(function () {
  var PALACE_ROOM_NUMBER = 100;
  var SUCCESS_MESSAGE_TIMEOUT = 3000;
  var mainForm = document.querySelector('.ad-form');
  var submitForm = mainForm.querySelector('.ad-form__submit');
  var fieldsets = document.querySelectorAll('.ad-form fieldset');
  var resetPageButton = document.querySelector('.ad-form__reset');
  var priceInput = mainForm.querySelector('#price');
  var addressInput = document.querySelector('#address');
  var roomPriceMap = {
    'bungalo': {
      min: '0',
      placeholder: '0'
    },
    'flat': {
      min: '1000',
      placeholder: '1 000'
    },
    'house': {
      min: '5000',
      placeholder: '5 000'
    },
    'palace': {
      min: '10000',
      placeholder: '10 000'
    }
  };

  // Функция, деактивирующая поля формы
  var disableFormFieldsets = function () {
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].setAttribute('disabled', 'disabled');
    }
  };

  var onRoomTypeChange = function (evt) {
    var roomType = evt.target.value;

    priceInput.min = roomPriceMap[roomType].min;
    priceInput.placeholder = roomPriceMap[roomType].placeholder;
  };

  var onTimeInputsChange = function (evt) {
    var selector = (evt.currentTarget.id === 'timein') ? '#timeout' : '#timein';
    mainForm.querySelector(selector).value = evt.currentTarget.value;
  };

  var validateRoomNumber = function () {
    var capacityEl = mainForm.querySelector('#capacity');
    var roomNumberEl = mainForm.querySelector('#room_number');
    var capacityValue = parseInt(capacityEl.value, 10);
    var roomNumberValue = parseInt(roomNumberEl.value, 10);
    var validityMessage = '';

    if (capacityValue > roomNumberValue) {
      validityMessage = 'Количество гостей не может быть больше количества комнат';
    }
    if (capacityValue === 0 && roomNumberValue !== PALACE_ROOM_NUMBER) {
      validityMessage = 'Этот вариант подходит только для тех помещений, в которых 100 комнат';
    }
    capacityEl.setCustomValidity(validityMessage);
  };

  var checkAllInputs = function () {
    var mainFormInputs = mainForm.querySelectorAll('input, select');
    for (var i = 0; i < mainFormInputs.length; i++) {
      var borderStyle = mainFormInputs[i].validity.valid ? '' : '1px solid red';
      mainFormInputs[i].style.border = borderStyle;
    }
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

    mainForm.reset();
    for (var i = 0; i < similarObjectsPins.length; i++) {
      similarObjectsPins[i].remove();
    }
    if (document.contains(mapCard)) {
      mapCard.remove();
    }
    priceInput.min = roomPriceMap['flat'].min;
    priceInput.placeholder = roomPriceMap['flat'].placeholder;
    window.map.fadeMap();
    window.filter.resetFilters();
    clearValidationStyle();
    disableFormFieldsets();
    mainForm.classList.add('ad-form--disabled');
  };

  var onSuccessFormSubmit = function () {
    var successEl = document.querySelector('.success');
    successEl.classList.remove('hidden');
    resetPage();
    setTimeout(function () {
      successEl.classList.add('hidden');
    }, SUCCESS_MESSAGE_TIMEOUT);
  };

  var onMainFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.uploadData(new FormData(mainForm), onSuccessFormSubmit, window.util.showErrors);
  };

  var onSubmitButtonClick = function () {
    validateRoomNumber();
    checkAllInputs();
  };

  var onRoomNumberChange = function () {
    validateRoomNumber();
  };

  var onCapacityChange = function () {
    validateRoomNumber();
  };

  var onResetPageButtonClick = function (evt) {
    evt.preventDefault();
    resetPage();
  };

  var setAddress = function (address) {
    addressInput.value = address;
  };

  var activateForm = function () {
    mainForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].removeAttribute('disabled');
    }
  };

  disableFormFieldsets();
  submitForm.addEventListener('click', onSubmitButtonClick);
  mainForm.querySelector('#room_number').addEventListener('change', onRoomNumberChange);
  mainForm.querySelector('#capacity').addEventListener('change', onCapacityChange);
  mainForm.querySelector('#timein').addEventListener('change', onTimeInputsChange);
  mainForm.querySelector('#timeout').addEventListener('change', onTimeInputsChange);
  mainForm.querySelector('#type').addEventListener('change', onRoomTypeChange);
  resetPageButton.addEventListener('click', onResetPageButtonClick);
  mainForm.addEventListener('submit', onMainFormSubmit);

  window.form = {
    activateForm: activateForm,
    setAddress: setAddress
  };
})();
