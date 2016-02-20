'use strict';
/* global Photo: true, Gallery: true */
(function() {
	// основной контейнер
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var activeFilter = 'filter-popular';
  filters.classList.add('hidden');
  var filteredPictures = [];
  var loadedPictures;
  var currentPage = 0;
  var PAGE_SIZE = 12;
  var scrollTimeout;
  var gallery = new Gallery();

// обработчик скролла
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      var picturesCoordinates = container.getBoundingClientRect();
      var viewport = window.innerHeight;
      if (picturesCoordinates.bottom <= viewport) {
        if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
          drawPictures(++currentPage);
        }
      }
    }, 100);
  });

  getPictures();
  /* проверяем загружены ли все картинки и положение последней картинки из списка,
  если разрешение позволяет и не все картинки загружены, то возвращаем true */
  function drawNextPAge() {
    return ((PAGE_SIZE * (currentPage + 1)) < filteredPictures.length) && (container.getBoundingClientRect().bottom - container.lastChild.getBoundingClientRect().height <= window.innerHeight);
  }

  // обработка данных
  function drawPictures(pageNumber, replace) {
    if (replace) {
      var pictures = document.querySelectorAll('.picture');
      Array.prototype.forEach.call(pictures, function(picture) {
        picture.removeEventListener('click', _onClick);
        container.removeChild(picture);
      });
    }
    var newPictureFragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var picturesPerPage = filteredPictures.slice(from, to);

    picturesPerPage.forEach(function(picture) {
      var photoElement = new Photo(picture);
      photoElement.render();
      newPictureFragment.appendChild(photoElement.pictureElement);
      photoElement.pictureElement.addEventListener('click', _onClick);
    });
    container.appendChild(newPictureFragment);
    // если разрешение экрана позволяет, то дорисовываем еще
    while (drawNextPAge()) {
      drawPictures(++currentPage);
    }
  }
  function _onClick(evt) {
    evt.preventDefault();
    gallery.show();
  }

  filters.classList.remove('hidden');

// загрузка фото по AJAX
  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open('GET', 'https://o0.github.io/assets/json/pictures.json');

    xhr.onloadstart = function() {
      container.classList.add('pictures-loading');
    };
    xhr.onerror = function() {
      container.classList.add('pictures-failure');
    };
    xhr.ontimeout = function() {
      container.classList.add('pictures-failure');
    };
    xhr.onload = function(e) {
      container.classList.remove('pictures-loading');
      var rawData = e.target.response;
      loadedPictures = JSON.parse(rawData);
      drawPictures(currentPage);
      setActiveFilter(activeFilter, true);
    };
    xhr.send();
  }

// обработка фильтров
  function setActiveFilter(filterId, force) {
    if (activeFilter === filterId && !force) {
      return;
    }
    filteredPictures = loadedPictures.slice(0);

    switch (filterId) {

      case 'filter-popular' :
        break;

      case 'filter-new' :
        filteredPictures = filteredPictures.filter(function(element) {
          var twoWeeksAgo = new Date() - 14 * 24 * 60 * 60 * 1000;
          return Date.parse(element.date) > twoWeeksAgo;
        }).sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;

      case 'filter-discussed' :
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }
    currentPage = 0;
    drawPictures(0, true);
    activeFilter = filterId;
  }
// делегирование события переключения фильтров
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });
})();




