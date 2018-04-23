'use strict';

window.formModule = (function () {
  var PALACE_ROOM_NUMBER = 100;
  var mainForm = document.querySelector('.ad-form');
  var submitForm = mainForm.querySelector('.ad-form__submit');
  var fieldsets = document.querySelectorAll('.ad-form fieldset');
  var resetPageButton = document.querySelector('.ad-form__reset');

  // Функция, деактивирующая поля формы
  var disableFormFieldsets = function () {
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].setAttribute('disabled', 'disabled');
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

    mainForm.reset();
    for (var i = 0; i < similarObjectsPins.length; i++) {
      similarObjectsPins[i].remove();
    }
    if (document.contains(mapCard)) {
      mapCard.remove();
    }
    clearValidationStyle();
    disableFormFieldsets();
    mainForm.classList.add('ad-form--disabled');
    for (i = 0; i < fieldsets.length; i++) {
      fieldsets[i].removeAttribute('disabled');
    }
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

  var onResetPageButtonClick = function (evt) {
    evt.preventDefault();
    resetPage();
  };


  submitForm.addEventListener('click', onSubmitButtonClick);
  mainForm.querySelector('#room_number').addEventListener('change', onRoomNumberChange);
  mainForm.querySelector('#capacity').addEventListener('change', onCapacityChange);
  mainForm.querySelector('#timein').addEventListener('change', onTimeInputsChange);
  mainForm.querySelector('#timeout').addEventListener('change', onTimeInputsChange);
  mainForm.querySelector('#type').addEventListener('change', onRoomTypeChange);
  resetPageButton.addEventListener('click', onResetPageButtonClick);

  // disableFormFieldsets();

  return {
    mainForm: document.querySelector('.ad-form'),
    resetPageButton: resetPageButton,

    // Функция, активирующая форму
    activateForm: function () {
      mainForm.classList.remove('ad-form--disabled');
      for (var i = 0; i < fieldsets.length; i++) {
        fieldsets[i].removeAttribute('disabled');
      }
    }
  };
})();
