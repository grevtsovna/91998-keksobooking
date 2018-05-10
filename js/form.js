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
  var mainFormInputs = mainForm.querySelectorAll('input, select');
  var capacityEl = mainForm.querySelector('#capacity');
  var roomNumberEl = mainForm.querySelector('#room_number');
  var timeOutEl = mainForm.querySelector('#timeout');
  var timeInEl = mainForm.querySelector('#timein');
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
    Array.from(fieldsets).forEach(function (fieldset) {
      fieldset.setAttribute('disabled', 'disabled');
    });
  };

  var onRoomTypeChange = function (evt) {
    var roomType = evt.target.value;

    priceInput.min = roomPriceMap[roomType].min;
    priceInput.placeholder = roomPriceMap[roomType].placeholder;
  };

  var onTimeInputsChange = function (evt) {
    var inputEl = (evt.currentTarget.id === 'timein') ? timeOutEl : timeInEl;
    inputEl.value = evt.currentTarget.value;
  };

  var validateRoomNumber = function () {
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
    Array.from(mainFormInputs).forEach(function (input) {
      var borderStyle = input.validity.valid ? '' : '1px solid red';
      input.style.border = borderStyle;
    });
  };

  var clearValidationStyle = function () {
    Array.from(mainFormInputs).forEach(function (input) {
      input.style.border = '';
    });
  };

  var resetPage = function () {
    var similarObjectsPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var mapCard = document.querySelector('.map__card');

    mainForm.reset();
    Array.from(similarObjectsPins).forEach(function (pin) {
      pin.remove();
    });
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
    Array.from(fieldsets).forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });
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
