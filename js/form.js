'use strict';

(function () {
  var PALACE_ROOM_NUMBER = 100;
  var SUCCESS_MESSAGE_TIMEOUT = 3000;
  var DEFAULT_AVATAR = 'img/muffin-grey.svg';
  var mainForm = document.querySelector('.ad-form');
  var submitForm = mainForm.querySelector('.ad-form__submit');
  var fieldsets = mainForm.querySelectorAll('fieldset');
  var resetPageButton = mainForm.querySelector('.ad-form__reset');
  var priceInput = mainForm.querySelector('#price');
  var addressInput = mainForm.querySelector('#address');
  var mainFormInputs = mainForm.querySelectorAll('input, select');
  var capacityElement = mainForm.querySelector('#capacity');
  var roomNumberElement = mainForm.querySelector('#room_number');
  var timeOutElement = mainForm.querySelector('#timeout');
  var timeInElement = mainForm.querySelector('#timein');
  var imagesContainer = mainForm.querySelector('.ad-form__photo-container');
  var avatarElement = mainForm.querySelector('.ad-form-header__preview img');
  var imagesWrapper = mainForm.querySelector('.ad-form__photo-container');
  var draggedItem = null;
  var draggedFromElement = null;
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
    var inputElement = (evt.currentTarget.id === 'timein') ? timeOutElement : timeInElement;
    inputElement.value = evt.currentTarget.value;
  };

  var validateRoomNumber = function () {
    var capacityValue = parseInt(capacityElement.value, 10);
    var roomNumberValue = parseInt(roomNumberElement.value, 10);
    var validityMessage = '';

    if (capacityValue > roomNumberValue) {
      validityMessage = 'Количество гостей не может быть больше количества комнат';
    }
    if (capacityValue === 0 && roomNumberValue !== PALACE_ROOM_NUMBER) {
      validityMessage = 'Этот вариант подходит только для тех помещений, в которых 100 комнат';
    }
    capacityElement.setCustomValidity(validityMessage);
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
    window.map.fade();
    window.filter.reset();
    resetImages();
    resetAvatar();
    clearValidationStyle();
    disableFormFieldsets();
    mainForm.classList.add('ad-form--disabled');
  };

  var onSuccessFormSubmit = function () {
    var successElement = document.querySelector('.success');
    successElement.classList.remove('hidden');
    resetPage();
    setTimeout(function () {
      successElement.classList.add('hidden');
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

  var onAvatarChange = function (evt) {
    var file = evt.target.files[0];
    if (!window.util.checkImage(file)) {
      window.util.showErrors('Пожалуйста, выберете изображение!');
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', function () {
        avatarElement.src = reader.result;
      });
    }
  };

  var createImageElement = function (imageData) {
    var wrapper = document.createElement('div');
    var image = document.createElement('img');
    wrapper.classList.add('ad-form__photo');
    image.style.maxWidth = '100%';
    image.style.cursor = 'move';
    image.src = imageData;
    image.addEventListener('dragstart', onImageDragstart);
    wrapper.addEventListener('dragover', onImageDragover);
    wrapper.addEventListener('drop', onImageDrop);
    wrapper.appendChild(image);

    return wrapper;
  };

  var removeImages = function () {
    var images = imagesWrapper.querySelectorAll('.ad-form__photo');

    Array.from(images).forEach(function (image) {
      image.remove();
    });
  };

  var onImagesChange = function (evt) {
    var files = evt.target.files;
    removeImages();

    Array.from(files).forEach(function (file) {
      if (window.util.checkImage(file)) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          var image = createImageElement(reader.result);
          imagesContainer.appendChild(image);
        });
        reader.readAsDataURL(file);
      }
    });
  };

  var resetImages = function () {
    var emptyImageWrapper = document.createElement('div');
    removeImages();
    imagesWrapper.querySelector('#images').value = '';
    emptyImageWrapper.classList.add('ad-form__photo');
    imagesContainer.appendChild(emptyImageWrapper);
  };

  var resetAvatar = function () {
    avatarElement.src = DEFAULT_AVATAR;
  };

  var onImageDragstart = function (evt) {
    draggedItem = evt.target;
    draggedFromElement = evt.currentTarget.parentNode;
  };

  var onImageDragover = function (evt) {
    evt.preventDefault();
    return false;
  };

  var onImageDrop = function (evt) {
    evt.currentTarget.appendChild(draggedItem);
    draggedFromElement.appendChild(evt.currentTarget.querySelector('img'));
  };

  disableFormFieldsets();
  submitForm.addEventListener('click', onSubmitButtonClick);
  mainForm.querySelector('#room_number').addEventListener('change', onRoomNumberChange);
  mainForm.querySelector('#capacity').addEventListener('change', onCapacityChange);
  mainForm.querySelector('#timein').addEventListener('change', onTimeInputsChange);
  mainForm.querySelector('#timeout').addEventListener('change', onTimeInputsChange);
  mainForm.querySelector('#type').addEventListener('change', onRoomTypeChange);
  mainForm.querySelector('#avatar').addEventListener('change', onAvatarChange);
  mainForm.querySelector('#images').addEventListener('change', onImagesChange);
  resetPageButton.addEventListener('click', onResetPageButtonClick);
  mainForm.addEventListener('submit', onMainFormSubmit);

  window.form = {
    activate: activateForm,
    setAddress: setAddress
  };
})();
