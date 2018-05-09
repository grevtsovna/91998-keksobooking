'use strict';

(function () {
  var filterFormEl = document.querySelector('.map__filters');
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
  var compareTypes = function (expectedType, actualType) {
    return expectedType !== 'any' ? actualType === expectedType : true;
  };

  var comparePrices = function (expectedPrice, actualPrice) {
    if (expectedPrice === 'any') {
      return true;
    }

    var filterMinPrice = pricesMap[expectedPrice].min;
    var filterMaxPrice = pricesMap[expectedPrice].max;
    return actualPrice <= filterMaxPrice && actualPrice >= filterMinPrice;
  };

  var compareNumericValues = function (expectedValue, actualValue) {
    if (expectedValue === 'any') {
      return true;
    }

    var filterValue = parseInt(expectedValue, 10);
    return filterValue === actualValue;
  };

  var compareFeatures = function (expectedFeatures, actualFeatures) {
    return expectedFeatures.every(function (feature) {
      return actualFeatures.indexOf(feature) !== -1;
    });
  };

  var compareWithFilter = function (filter) {
    return function (object) {
      var offer = object.offer;
      return (
        compareTypes(filter['housing-type'], offer.type) &&
        comparePrices(filter['housing-price'], offer.price) &&
        compareNumericValues(filter['housing-rooms'], offer.rooms) &&
        compareNumericValues(filter['housing-guests'], offer.guests) &&
        compareFeatures(filter['features'], offer.features)
      );
    };
  };

  // фунция, фильтрующая объекты недвижимости
  var filterObjects = function (objects) {
    var filterSelects = filterFormEl.querySelectorAll('select');
    var checkedFeatureInputs = filterFormEl.querySelectorAll('.map__features input:checked');
    var checkedFeatures = Array.from(checkedFeatureInputs).map(function (item) {
      return item.value;
    });

    var filterData = Array.from(filterSelects).reduce(function (acc, val) {
      acc[val.name] = val.value;
      return acc;
    }, {});

    filterData.features = checkedFeatures;

    return objects.filter(compareWithFilter(filterData));
  };

  var resetFilters = function() {
    filterFormEl.reset();
  };

  window.filter = {
    filterObjects: filterObjects,
    resetFilters: resetFilters
  };
})();
