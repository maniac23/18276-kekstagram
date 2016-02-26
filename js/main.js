'use strict';
/**
 * @author Mikhail Tukai
 */
define([
  'photo',
  'gallery',
  'upload'
], function(Photo, Gallery) {
  /**
   * основной контейнер
   * @type {Element}
   */
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  /**
   * Фильтр по умолчанию
   * @type {string}
   */
  var activeFilter = 'filter-popular';
  /**
   * скрываем по умолчанию блок с фильтрами
   */
  filters.classList.add('hidden');
  /**
    * Массив отфильтрованных фотографий
    * @type {Photo[]}
    */
  var filteredPictures = [];
  /**
   * Массив отрисованных фотографий
   * @type {Photo[]}
   */
  var renderedPictures = [];
  /**
   * Массив объектов загруженных фотографий
   * @type {Photo[]}
   */
  var loadedPictures;
  var currentPage = 0;
  var PAGE_SIZE = 12;
  /**
   * Таймаут для строла
   */
  var scrollTimeout;
  /**
   * @type (Gallery)
   */
  var gallery = new Gallery();
  /**
   * обработчик скролла
   */
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
  /** проверяем загружены ли все картинки
   * и положение последней картинки из списка,
   * если разрешение позволяет и не все картинки загружены,
   * то возвращаем true
   * @returns {boolean}
   */
  function drawNextPAge() {
    return ((PAGE_SIZE * (currentPage + 1)) < filteredPictures.length) && (container.getBoundingClientRect().bottom - container.lastChild.getBoundingClientRect().height <= window.innerHeight);
  }

  /**
   * обработка данных, отрисовка картинок
   * @param {number} pageNumber - номер страницы отображения
   * @param {boolean} replace - если true, то удаляет все существующие DOM-элементы с фотографиями
   */
  function drawPictures(pageNumber, replace) {
    if (replace) {
      currentPage = 0;
      var el;
      while ((el = renderedPictures.shift())) {
        container.removeChild(el.pictureElement);
        el.onClick = null;
        el.remove();
      }
    }
    var newPictureFragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var picturesPerPage = filteredPictures.slice(from, to);

    renderedPictures = renderedPictures.concat(picturesPerPage.map(function(picture) {
      var photoElement = new Photo(picture);
      photoElement.setData(picture);
      photoElement.render();
      newPictureFragment.appendChild(photoElement.pictureElement);

      photoElement.onClick = function() {
        gallery.setData(photoElement.getData());
        gallery.render();
      };
      return photoElement;
    }));

    container.appendChild(newPictureFragment);
    // если разрешение экрана позволяет, то дорисовываем еще
    while (drawNextPAge()) {
      drawPictures(++currentPage);
    }
  }

  filters.classList.remove('hidden');
  /**
   * функция загрузки фото по AJAX
   */
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
  /**
   * Функция для фильтрации отрисованных картинок
   * @param id - id устанавливаемого фильтра
   * @param force - установка фильтра при загрузке по JSON
   */
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
    gallery.setPictures(filteredPictures);
    drawPictures(0, true);
    activeFilter = filterId;
  }
/**
 * Обработчик клика по фильтрам
 */
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });
})();
