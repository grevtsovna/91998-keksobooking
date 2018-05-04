'use strict';

window.formModule = (function () {
  var PALACE_ROOM_NUMBER = 100;
  var mainForm = document.querySelector('.ad-form');
  var addressInput = mainForm.querySelector('[name=address]');
  var submitForm = mainForm.querySelector('.ad-form__submit');
  var fieldsets = document.querySelectorAll('.ad-form fieldset');
  var resetPageButton = document.querySelector('.ad-form__reset');
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
    var priceInput = mainForm.querySelector('#price');
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
    var isValid = true;
    var mainFormInputs = mainForm.querySelectorAll('input, select');
    for (var i = 0; i < mainFormInputs.length; i++) {
      if (mainFormInputs[i].validity.valid) {
        mainFormInputs[i].style.border = '';
      } else {
        mainFormInputs[i].style.border = '1px solid red';
        isValid = false;
      }
    }

    return isValid;
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
    window.pinModule.fadeMap();
    addressInput.setAttribute('disabled', 'disabled');
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
    }, 3000);
  };

  var onMainFormSubmit = function (evt) {
    evt.preventDefault();
    addressInput.removeAttribute('disabled');
    window.backendModule.uploadData(new FormData(mainForm), onSuccessFormSubmit, window.backendModule.showErrors);
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
    document.querySelector('#address').value = address;
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

  return {
    // Функция, активирующая форму
    activateForm: function () {
      mainForm.classList.remove('ad-form--disabled');
      for (var i = 0; i < fieldsets.length; i++) {
        fieldsets[i].removeAttribute('disabled');
      }
    },
    setAddress: setAddress
  };
})();
