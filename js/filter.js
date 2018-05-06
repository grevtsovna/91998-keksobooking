'use strict';

(function () {
  var filterObjects = function (objects) {
    return function () {
      if (window.lastTimeout) {
        clearTimeout(window.lastTimeout);
      }
      window.lastTimeout = setTimeout(function () {
        var filterFormEl = document.querySelector('.map__filters');
        var filterSelects = filterFormEl.querySelectorAll('select');
        var featuresInputs = filterFormEl.querySelectorAll('.map__features input');
        var pricesMap = {
          low: {
            min: 0,
            max: 10000
          },
          middle: {
            min: 10000,
            max: 50000
          },
          high: {
            min: 50000,
            max: Infinity
          }
        };

        var filterData = {};
        filterData.features = [];

        Array.from(filterSelects).forEach(function (item) {
          if (item.value !== 'any') {
            filterData[item.name] = item.value;
          }
        });

        Array.from(featuresInputs).forEach(function (item) {
          if (item.checked) {
            filterData.features.push(item.value);
          }
        });

        var filterByType = function (item) {
          var isFilterActive = typeof filterData['housing-type'] !== 'undefined';
          return isFilterActive ? item.offer.type === filterData['housing-type'] : true;
        };

        var filterByPrice = function (item) {
          var isFilterActive = typeof filterData['housing-price'] !== 'undefined';
          if (!isFilterActive) {
            return true;
          } else {
            var filterMinPrice = pricesMap[filterData['housing-price']].min;
            var filterMaxPrice = pricesMap[filterData['housing-price']].max;
            return item.offer.price <= filterMaxPrice && item.offer.price >= filterMinPrice;
          }
        };

        var filterByNumericValue = function (filterName, offerNameField) {
          return function (item) {
            var isFilterActive = typeof filterData[filterName] !== 'undefined';
            var filterValue = parseInt(filterData[filterName], 10);
            return isFilterActive ? filterValue === item.offer[offerNameField] : true;
          };
        };

        var filterByFeatures = function (item) {
          var isFilterActive = filterData.features.length > 0;
          if (!isFilterActive) {
            return true;
          } else {
            for (var i = 0; i < filterData.features.length; i++) {
              if (item.offer.features.indexOf(filterData.features[i]) === -1) {
                return false;
              }
            }
            return true;
          }
        };

        var filteredObjects = objects.filter(filterByType);
        filteredObjects = filteredObjects.filter(filterByPrice);
        filteredObjects = filteredObjects.filter(filterByNumericValue('housing-rooms', 'rooms'));
        filteredObjects = filteredObjects.filter(filterByNumericValue('housing-guests', 'guests'));
        filteredObjects = filteredObjects.filter(filterByFeatures);

        window.map.closePopupCard();
        window.map.removeMapData();
        window.map.showMapData(filteredObjects);
      }, 500);
    };
  };
  window.filter = {
    filterObjects: filterObjects
  };
})();
