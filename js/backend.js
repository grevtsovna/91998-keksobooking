'use strict';

(function () {
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var TIMEOUT = 5000;
  var STATUS_OK = 200;

  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Что-то пошло не так. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения, попробуйте еще раз позднее');
    });
    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания ответа от сервера, попробуйте еще раз позднее');
    });
    xhr.timeout = TIMEOUT;

    return xhr;
  };

  var loadData = function (onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  var uploadData = function (data, onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  var showErrors = function (error) {
    var errorEl = document.createElement('div');
    errorEl.style.cssText = 'position: fixed; top: 0; left: 0; background: #ed5d50; color: #fff; padding: 10px; width: 100%';
    errorEl.textContent = error;
    document.querySelector('body').appendChild(errorEl);
    setTimeout(function () {
      errorEl.remove();
    }, 5000);
  };

  window.backend = {
    loadData: loadData,
    uploadData: uploadData,
    showErrors: showErrors
  };
})();
