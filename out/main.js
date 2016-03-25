/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	/**
	 * @author Mikhail Tukai
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(1),
	  __webpack_require__(2),
	  __webpack_require__(3)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Photo, Gallery) {
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
	  var activeFilter = localStorage.getItem('filter') || 'filter-popular';
	  setCheckedFilter(activeFilter);
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
	        location.hash = '#photo' + '/' + picture.url;
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
	   * @param filterId {string} - id устанавливаемого фильтра
	   * @param force {boolean} - установка фильтра при загрузке по JSON
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
	    /**
	     * Записываем выбранный фильтр в LocalStorage
	     */
	    localStorage.setItem('filter', filterId);
	  }

	  /**
	   * Устанавливает checked: true для активного фильтра
	   * @param {strung} filterId - id активного фильтра
	  */
	  function setCheckedFilter(filterId) {
	    var filterRadio = document.getElementById(filterId);
	    filterRadio.checked = true;
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
	  function galleryFromHash() {
	    var matchedHash = location.hash.match(/#photo\/(\S+)/);
	    if (Array.isArray(matchedHash)) {
	      gallery.render(matchedHash[1]);
	    } else {
	      gallery.hide();
	    }
	  }
	  window.addEventListener('hashchange', function() {
	    galleryFromHash();
	  });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	  /**
	   * Констуктор фото в общем списке
	   * @param {data} - полученные данные фото
	   * @constructor
	   */
	  function Photo(data) {
	    this._data = data;
	    this.onPhotoClick = this.onPhotoClick.bind(this);
	  }
	  /**
	   * Отрисовка DOM-элемента по шаблону для фотографии в списке
	   * @method
	   * @override
	   */
	  Photo.prototype.render = function() {
	    var template = document.querySelector('#picture-template');
	    var image = new Image('182', '182');
	    var imageLoadTimeout;
	    if ('content' in template) {
	      this.pictureElement = template.content.children[0].cloneNode(true);
	    } else {
	      this.pictureElement = template.children[0].cloneNode(true);
	    }
	    this.pictureElement.querySelector('.picture-likes').textContent = this._data.likes;
	    this.pictureElement.querySelector('.picture-comments').textContent = this._data.comments;
	    var replaceImg = this.pictureElement.querySelector('img');
	    /**
	     * успешная загрузка картинки
	     */
	    image.addEventListener('load', function() {
	      clearTimeout(imageLoadTimeout);
	      this.pictureElement.replaceChild(image, replaceImg);
	    }.bind(this));
	    /**
	     * ошибка при загрузке
	     */
	    image.addEventListener('error', function() {
	      this.pictureElement.classList.add('picture-load-failure');
	    }.bind(this));
	    image.src = this._data.url;
	    /**
	     * ошибка по истечению таймаута
	     */
	    var IMAGE_TIMEOUT = 10000;
	    imageLoadTimeout = setTimeout(function() {
	      image.src = '';
	      this.pictureElement.classList.add('picture-load-failure');
	    }.bind(this), IMAGE_TIMEOUT);

	    this.pictureElement.addEventListener('click', this.onPhotoClick);
	  };
	  /**
	   * Обработчик клика по фотографии в общем списке фотографий
	   * @method
	   * @listens click
	   * @param evt
	   * @override
	   */
	  Photo.prototype.onPhotoClick = function(evt) {
	    evt.preventDefault();
	    if (this.pictureElement.classList.contains('picture') &&
	      !this.pictureElement.classList.contains('picture-load-failure')) {
	      if (typeof this.onClick === 'function') {
	        this.onClick();
	      }
	    }
	  };

	  Photo.prototype.hide = function() {
	    this.pictureElement.removeEventListener('click', this._onPhotoClick);
	  };
	   /**
	   * Метод удаления обработчиков событий с DOM-элемента фотографии и удаления элемента из DOM-дерева
	   * @method
	   * @override
	   */
	  Photo.prototype.remove = function() {
	    this.pictureElement.removeEventListener('click', this._onPhotoClick);
	  };

	  Photo.prototype.setData = function(data) {
	    this._data = data;
	  };

	  Photo.prototype.getData = function() {
	    return this._data;
	  };

	  Photo.prototype.onClick = null;
	  return Photo;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	/**
	 * @author Mikhail Tukai
	*/
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	  /**
	   * Конструктор галереи
	   * @constructor
	  */
	  var Gallery = function() {
	    /**
	     * Галерея
	     * @type {HTMLElement}
	     */
	    this.element = document.querySelector('.gallery-overlay');
	    /**
	     * Кнопка закрытия галереи
	     * @type {HTMLElement}
	     * @private
	     */
	    this._closeButtton = document.querySelector('.gallery-overlay-close');
	    /**
	     * Контейнер для фотографии
	     * @type {HTMLElement}
	     */
	    this.photo = document.querySelector('.gallery-overlay-image');
	    /**
	     * Подписка на событие клика по фото
	     * @type {function(this:Gallery)}
	     * @private
	     */
	    this._onPhotoClick = this._onPhotoClick.bind(this);
	    /**
	     * Подписка на клавиатурыне события
	     * @type {function(this:Gallery)}
	     * @private
	     */
	    this._onKeyDown = this._onKeyDown.bind(this);
	    /**
	     * Подписка на событие нажатия кнопки закрытия галереи
	     * @type {function(this:Gallery)}
	     * @private
	     */
	    this._onCloseClick = this._onCloseClick.bind(this);
	    /**
	     * Подписка на событие лайка фотографии
	     * @type {function(this:Gallery)}
	     * @private
	     */
	    this._onLikeClick = this._onLikeClick.bind(this);
	    /**
	     * Контейнер для лайков
	     * @type {HTMLElement}
	     */
	    this.likes = document.querySelector('.gallery-overlay-controls-like');
	    /**
	     * Количество лайков
	     * @type {HTMLElement}
	     */
	    this.likesCount = document.querySelector('.likes-count');
	    /**
	     * Контейнер для комментариев
	     * @type {HTMLElement}
	     */
	    this.comments = document.querySelector('.gallery-overlay-controls-comments');
	    /**
	     * массив загруженых фото
	     * @type {Array}
	     */
	    this.pictures = [];
	    /**
	     * Текущая фотография
	     * @type {number}
	     */
	    this.currentPicture = 0;
	  };
	  /**
	   * Метод для отрисовки элементов галереи
	   * @method
	   */
	  Gallery.prototype.render = function(path) {
	    this.show();
	    this.setCurrentPicture(path);
	  };
	  /**
	   * Метод для показа галереи
	   * @method
	   */
	  Gallery.prototype.show = function() {
	    this.element.classList.remove('invisible');
	    this.setCurrentPicture(0);
	    this._closeButtton.addEventListener('click', this._onCloseClick);
	    this.photo.addEventListener('click', this._onPhotoClick);
	    window.addEventListener('keydown', this._onKeyDown);
	    this.likes.addEventListener('click', this._onLikeClick);
	  };

	  /**
	   * Метод для скрытия галереи
	   * @method
	   */
	  Gallery.prototype.hide = function() {
	    this.element.classList.add('invisible');
	    this._closeButtton.removeEventListener('click', this._onCloseClick);
	    this.photo.removeEventListener('click', this._onPhotoClick);
	    window.removeEventListener('keydown', this._onKeyDown);
	    this.likes.removeEventListener('click', this._onLikeClick);
	  };
	  /** Метод для сохранения массива фото в объекте
	   * @method
	   * @param {Photo[]} pictures - массив фото
	   */
	  Gallery.prototype.setPictures = function(pictures) {
	    this.pictures = pictures;
	    this.picturesCount = pictures.length;
	  };
	  /**
	   * Метод для установки показываемой фотографии
	   * @method
	   * @param {number|string} i - индекс фото в массиве pictures или путь до фото
	   */
	  Gallery.prototype.setCurrentPicture = function(i) {
	    var picture;
	    if (typeof i === 'number') {
	      picture = this.pictures[i];
	    } else {
	      picture = this.pictures[this.getPictureNumber(i)];
	    }
	    this.photo.src = picture.url;
	    this.likes.querySelector('.likes-count').textContent = picture.likes;
	    this.comments.querySelector('.comments-count').textContent = picture.comments;
	    if (picture.liked === true) {
	      this.likesCount.classList.add('likes-count-liked');
	    } else {
	      this.likesCount.classList.remove('likes-count-liked');
	    }
	  };
	  /**
	   * Обработчик события нажатия кнопки закрытия галереи
	   * @method
	   * @listens click
	   * @private
	   */
	  Gallery.prototype._onCloseClick = function() {
	    location.hash = '';
	  };
	  /**
	   * Метод события нажатия на октрытое фото в галерее
	   * @method
	   * @listens click
	   * @private
	   */
	  Gallery.prototype._onPhotoClick = function() {
	    this.setNextPicture();
	    this.setCurrentPicture(this.currentPicture);

	  };
	  /**
	   * Метод для лайков на фотографии
	   * @method
	   * @private
	   */
	  Gallery.prototype._onLikeClick = function() {
	    var openedPicture = this.pictures[this.currentPicture];
	    if (!openedPicture.liked === true) {
	      this.likesCount.classList.add('likes-count-liked');
	      openedPicture.likes++;
	      this.likes.querySelector('.likes-count').textContent = openedPicture.likes;
	      openedPicture.liked = true;
	    } else {
	      this.likesCount.classList.remove('likes-count-liked');
	      openedPicture.likes--;
	      this.likes.querySelector('.likes-count').textContent = openedPicture.likes;
	      openedPicture.liked = false;
	    }
	  };
	  /**
	   * Метод события нажатия на клавишу клавиатуры
	   * @method
	   * @listens keydown
	   * @param {Event} evt - событие нажатия клавиши
	   * @private
	   */
	  Gallery.prototype._onKeyDown = function(evt) {
	    if (evt.keyCode === 27) {
	      location.hash = '';
	    } else {
	      if (evt.keyCode === 39) {
	        this.setNextPicture();
	      }
	      if (evt.keyCode === 37) {
	        this.setPreviousPicture();
	      }
	      this.setCurrentPicture(this.currentPicture);
	    }
	  };
	  /**
	   * Метод устанавливает объект-фотографию из JSON
	   * @method
	   * @param {object} data
	   */
	  Gallery.prototype.setData = function(data) {
	    this._data = data;
	    this.currentPicture = this.getPictureNumber(data.url);
	  };
	  /**
	   * Метод возвращает номер фотографии в массиве
	   * @method
	   * @param {string} url - имя фотографии
	   * @returns {number}
	   */
	  Gallery.prototype.getPictureNumber = function(url) {
	    for (var i = 0; i < this.pictures.length; i++) {
	      if (url === this.pictures[i].url) {
	        this.currentPicture = i;
	        return i;
	      }
	    }
	  };
	  /**
	   * Метод для показа следующей фото
	   * @method
	   */
	  Gallery.prototype.setNextPicture = function() {
	    if (this.currentPicture < this.picturesCount - 1) {
	      var newPictureUrl = this.pictures[this.currentPicture++].url;
	      this.setHash(newPictureUrl);
	    }
	  };
	    /**
	   * Метод для показа предыдущей фото
	   * @method
	   */
	  Gallery.prototype.setPreviousPicture = function() {
	    if (this.currentPicture > 0) {
	      this.setHash(this.pictures[this.currentPicture--].url);
	    }
	  };
	  Gallery.prototype.setHash = function(hash) {
	    location.hash = hash ? 'photo/' + hash : '';
	  };

	  return Gallery;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
	/**
	 * @fileoverview
	 * @author Igor Alexeenko (o0)
	 */

	'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(4)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Resizer) {
	  /** @enum {string} */
	  var FileType = {
	    'GIF': '',
	    'JPEG': '',
	    'PNG': '',
	    'SVG+XML': ''
	  };

	  /** @enum {number} */
	  var Action = {
	    ERROR: 0,
	    UPLOADING: 1,
	    CUSTOM: 2
	  };

	  /**
	   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
	   * из ключей FileType.
	   * @type {RegExp}
	   */
	  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

	  /**
	   * @type {Object.<string, string>}
	   */
	  var filterMap;

	  /**
	   * Объект, который занимается кадрированием изображения.
	   * @type {Resizer}
	   */
	  var currentResizer;

	  /**
	   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
	   * изображением.
	   */
	  function cleanupResizer() {
	    if (currentResizer) {
	      currentResizer.remove();
	      currentResizer = null;
	    }
	  }

	  /**
	   * Ставит одну из трех случайных картинок на фон формы загрузки.
	   */
	  function updateBackground() {
	    var images = [
	      'img/logo-background-1.jpg',
	      'img/logo-background-2.jpg',
	      'img/logo-background-3.jpg'
	    ];

	    var backgroundElement = document.querySelector('.upload');
	    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
	    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
	  }

	  /**
	   * Проверяет, валидны ли данные, в форме кадрирования.
	   * @return {boolean}
	   */
	  function resizeFormIsValid() {
	    var isValid = true;
	  // проверяем не пустые ли поля
	    if (sideX.value.length === 0 || sideY.value.length === 0 || side.value.length === 0) {
	      isValid = false;
	      return isValid;
	    }
	    for (var i = 0; i < resizeForm.elements.length; i++) {
	      isValid = resizeForm.elements[i].validity.valid;
	      if (!isValid) {
	        break;
	      }
	    }
	    if (isValid) {
	      resizeBtn.removeAttribute('disabled');
	      return true;
	    } else {
	      resizeBtn.setAttribute('disabled', '');
	    }

	  }

	  /**
	   * Форма загрузки изображения.
	   * @type {HTMLFormElement}
	   */
	  var uploadForm = document.forms['upload-select-image'];
	  /**
	   *  Получаем размеры смещения изображения
	   */
	  function setFormValues() {
	    var size = currentResizer.getConstraint();
	    sideX.value = Math.floor(size.x);
	    sideY.value = Math.floor(size.y);
	    side.value = Math.floor(size.side);
	  }
	  /**
	   * записываем значения в форму
	   */
	  window.addEventListener('resizerchange', setFormValues);

	  /**
	   * Форма кадрирования изображения.
	   * @type {HTMLFormElement}
	   */
	  var resizeForm = document.forms['upload-resize'];
	  var sideX = resizeForm['resize-x'];
	  var sideY = resizeForm['resize-y'];
	  var side = resizeForm['resize-size'];
	  var resizeBtn = resizeForm['resize-fwd'];
	  // делаем по умолчанию кнопку отправки неактивной
	  resizeBtn.setAttribute('disabled', '');
	  // минимальные значения
	  sideX.min = 0;
	  sideY.min = 0;
	  side.min = 1;
	  /**
	   * Функция для вычисленини максимально возможное значение
	   * поля сторона
	   * @param {number} x -  x-координата
	   * @param {number} y - y-координата
	   */
	  function setMaxSideValue(x, y) {
	    side.max = Math.min( parseInt((currentResizer._image.naturalWidth - x.value), 10), parseInt((currentResizer._image.naturalHeight - y.value), 10));
	  }
	  resizeForm.addEventListener('change', function() {
	    setMaxSideValue(sideX, sideY);
	    resizeFormIsValid();
	    // изменяем обрезку при изменении значений
	    currentResizer.setConstraint(Math.floor(sideX.value), Math.floor(sideY.value), Math.floor(side.value));
	  });

	  /**
	   * Форма добавления фильтра.
	   * @type {HTMLFormElement}
	   */
	  var filterForm = document.forms['upload-filter'];

	  /**
	   * @type {HTMLImageElement}
	   */
	  var filterImage = filterForm.querySelector('.filter-image-preview');

	  /**
	   * @type {HTMLElement}
	   */
	  var uploadMessage = document.querySelector('.upload-message');

	  /**
	   * @param {Action} action
	   * @param {string=} message
	   * @return {Element}
	   */
	  function showMessage(action, message) {
	    var isError = false;

	    switch (action) {
	      case Action.UPLOADING:
	        message = message || 'Кексограмим&hellip;';
	        break;

	      case Action.ERROR:
	        isError = true;
	        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
	        break;
	    }

	    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
	    uploadMessage.classList.remove('invisible');
	    uploadMessage.classList.toggle('upload-message-error', isError);
	    return uploadMessage;
	  }

	  function hideMessage() {
	    uploadMessage.classList.add('invisible');
	  }


	  /**
	   * Обработчик изменения изображения в форме загрузки. Если загруженный
	   * файл является изображением, считывается исходник картинки, создается
	   * Resizer с загруженной картинкой, добавляется в форму кадрирования
	   * и показывается форма кадрирования.
	   * @param {Event} evt
	   */
	  uploadForm.addEventListener('change', function(evt) {
	    var element = evt.target;
	    if (element.id === 'upload-file') {
	      // Проверка типа загружаемого файла, тип должен быть изображением
	      // одного из форматов: JPEG, PNG, GIF или SVG.
	      if (fileRegExp.test(element.files[0].type)) {
	        var fileReader = new FileReader();

	        showMessage(Action.UPLOADING);

	        fileReader.addEventListener('load', function() {
	          cleanupResizer();

	          currentResizer = new Resizer(fileReader.result);
	          currentResizer.setElement(resizeForm);
	          uploadMessage.classList.add('invisible');

	          uploadForm.classList.add('invisible');
	          resizeForm.classList.remove('invisible');

	          hideMessage();
	          // устанавливаем начальные значения
	          setTimeout(setFormValues, 100);
	        });

	        fileReader.readAsDataURL(element.files[0]);
	      } else {
	        // Показ сообщения об ошибке, если загружаемый файл, не является
	        // поддерживаемым изображением.
	        showMessage(Action.ERROR);
	      }
	    }
	  });

	  /**
	   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
	   * и обновляет фон.
	   * @param {Event} evt
	   */
	  resizeForm.addEventListener('reset', function(evt) {
	    evt.preventDefault();
	    cleanupResizer();
	    updateBackground();

	    resizeForm.classList.add('invisible');
	    uploadForm.classList.remove('invisible');
	  });

	  /**
	   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
	   * кропнутое изображение в форму добавления фильтра и показывает ее.
	   * @param {Event} evt
	   */
	  resizeForm.addEventListener('submit', function(evt) {
	    evt.preventDefault();

	    if (resizeFormIsValid()) {
	      filterImage.src = currentResizer.exportImage().src;

	      resizeForm.classList.add('invisible');
	      filterForm.classList.remove('invisible');
	    }
	  });

	  /**
	   * Сброс формы фильтра. Показывает форму кадрирования.
	   * @param {Event} evt
	   */
	  filterForm.addEventListener('reset', function(evt) {
	    evt.preventDefault();

	    filterForm.classList.add('invisible');
	    resizeForm.classList.remove('invisible');
	  });

	  /**
	   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
	   * записав сохраненный фильтр в cookie.
	   * @param {Event} evt
	   */
	  /* global docCookies */
	  var selectedFilter = '';
	  if (docCookies.getItem('filter')) {
	    selectedFilter = docCookies.getItem('filter');
	    var radioButtons = filterForm.querySelectorAll('input[type=radio]');
	    for (var i = 0; i < radioButtons.length; i++) {
	      if (radioButtons[i].value === selectedFilter) {
	        radioButtons[i].setAttribute('checked', '');
	        filterImage.className = 'filter-image-preview filter-' + selectedFilter;
	      }
	    }
	  } else {
	    selectedFilter = 'filter-none';
	  }

	  var today = new Date();
	  var birthday = new Date(today.getFullYear(), 6, 10);
	  var daysToExpire = Number(today) + Math.abs(today - birthday);

	  filterForm.addEventListener('submit', function(evt) {
	    evt.preventDefault();
	    docCookies.setItem('filter', selectedFilter, new Date(daysToExpire));

	    cleanupResizer();
	    updateBackground();

	    filterForm.classList.add('invisible');
	    uploadForm.classList.remove('invisible');
	  });

	  /**
	   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
	   * выбранному значению в форме.
	   */
	  filterForm.addEventListener('change', function() {
	    if (!filterMap) {
	      // Ленивая инициализация. Объект не создается до тех пор, пока
	      // не понадобится прочитать его в первый раз, а после этого запоминается
	      // навсегда.
	      filterMap = {
	        'none': 'filter-none',
	        'chrome': 'filter-chrome',
	        'sepia': 'filter-sepia'
	      };
	    }

	    selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
	      return item.checked;
	    })[0].value;

	    // Класс перезаписывается, а не обновляется через classList потому что нужно
	    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
	    // состояние или просто перезаписывать.
	    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
	  });

	  cleanupResizer();
	  updateBackground();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	  /**
	   * @constructor
	   * @param {string} image
	   */
	  var Resizer = function(image) {
	    // Изображение, с которым будет вестись работа.
	    this._image = new Image();
	    this._image.src = image;

	    // Холст.
	    this._container = document.createElement('canvas');
	    this._ctx = this._container.getContext('2d');

	    // Создаем холст только после загрузки изображения.
	    this._image.onload = function() {
	      // Размер холста равен размеру загруженного изображения. Это нужно
	      // для удобства работы с координатами.
	      this._container.width = this._image.naturalWidth;
	      this._container.height = this._image.naturalHeight;

	      /**
	       * Предлагаемый размер кадра в виде коэффициента относительно меньшей
	       * стороны изображения.
	       * @const
	       * @type {number}
	       */
	      var INITIAL_SIDE_RATIO = 0.75;
	      // Размер меньшей стороны изображения.
	      var side = Math.min(
	          this._container.width * INITIAL_SIDE_RATIO,
	          this._container.height * INITIAL_SIDE_RATIO);

	      // Изначально предлагаемое кадрирование — часть по центру с размером в 3/4
	      // от размера меньшей стороны.
	      this._resizeConstraint = new Square(
	          this._container.width / 2 - side / 2,
	          this._container.height / 2 - side / 2,
	          side);

	      // Отрисовка изначального состояния канваса.
	      this.redraw();
	    }.bind(this);

	    // Фиксирование контекста обработчиков.
	    this._onDragStart = this._onDragStart.bind(this);
	    this._onDragEnd = this._onDragEnd.bind(this);
	    this._onDrag = this._onDrag.bind(this);
	  };

	  Resizer.prototype = {
	    /**
	     * Родительский элемент канваса.
	     * @type {Element}
	     * @private
	     */
	    _element: null,

	    /**
	     * Положение курсора в момент перетаскивания. От положения курсора
	     * рассчитывается смещение на которое нужно переместить изображение
	     * за каждую итерацию перетаскивания.
	     * @type {Coordinate}
	     * @private
	     */
	    _cursorPosition: null,

	    /**
	     * Объект, хранящий итоговое кадрирование: сторона квадрата и смещение
	     * от верхнего левого угла исходного изображения.
	     * @type {Square}
	     * @private
	     */
	    _resizeConstraint: null,

	    /**
	     * Отрисовка канваса.
	     */
	    redraw: function() {
	      // Очистка изображения.
	      this._ctx.clearRect(0, 0, this._container.width, this._container.height);

	      // Параметры линии.
	      // NB! Такие параметры сохраняются на время всего процесса отрисовки
	      // canvas'a поэтому важно вовремя поменять их, если нужно начать отрисовку
	      // чего-либо с другой обводкой.

	      // Толщина линии.
	      this._ctx.lineWidth = 6;
	      // Цвет обводки.
	      this._ctx.strokeStyle = '#ffe753';
	      // Размер штрихов. Первый элемент массива задает длину штриха, второй
	      // расстояние между соседними штрихами.
	      this._ctx.setLineDash([15, 10]);
	      // Смещение первого штриха от начала линии.
	      this._ctx.lineDashOffset = 7;


	      // Сохранение состояния канваса.
	      // Подробней см. строку 132.
	      this._ctx.save();

	      // Установка начальной точки системы координат в центр холста.
	      this._ctx.translate(this._container.width / 2, this._container.height / 2);

	      var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
	      var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);
	      // Отрисовка изображения на холсте. Параметры задают изображение, которое
	      // нужно отрисовать и координаты его верхнего левого угла.
	      // Координаты задаются от центра холста.
	      this._ctx.drawImage(this._image, displX, displY);

	      //отрисовка затемненного фона
	      var cropRectBegin = this._resizeConstraint.side / 2;

	      this._ctx.beginPath();
	      this._ctx.moveTo(displX, displY);
	      this._ctx.lineTo(displX + this._container.width, displY);
	      this._ctx.lineTo(displX + this._container.width, displY + this._container.height);
	      this._ctx.lineTo(displX, displY + this._container.height);
	      this._ctx.lineTo(displX, displY);
	      this._ctx.closePath();
	      this._ctx.moveTo(-cropRectBegin - this._ctx.lineWidth, -cropRectBegin - this._ctx.lineWidth);
	      this._ctx.lineTo(-cropRectBegin - this._ctx.lineWidth, cropRectBegin - this._ctx.lineWidth / 2);
	      this._ctx.lineTo(cropRectBegin - this._ctx.lineWidth / 2, cropRectBegin - this._ctx.lineWidth / 2);
	      this._ctx.lineTo(cropRectBegin - this._ctx.lineWidth / 2, -cropRectBegin - this._ctx.lineWidth);
	      this._ctx.lineTo(-cropRectBegin - this._ctx.lineWidth, -cropRectBegin - this._ctx.lineWidth);
	      this._ctx.closePath();
	      this._ctx.fillStyle = 'rgba(0, 0, 0, .8)';
	      this._ctx.fill();

	      // Отрисовка прямоугольника, обозначающего область изображения после
	      // кадрирования. Координаты задаются от центра.
	      this._ctx.strokeRect(
	          (-this._resizeConstraint.side / 2) - this._ctx.lineWidth / 2,
	          (-this._resizeConstraint.side / 2) - this._ctx.lineWidth / 2,
	          this._resizeConstraint.side - this._ctx.lineWidth / 2,
	          this._resizeConstraint.side - this._ctx.lineWidth / 2);
	      //fiilText
	      this._ctx.font = '20px Open Sans';
	      this._ctx.fillStyle = '#fff';
	      this._ctx.textAlign = 'center';
	      this._ctx.fillText(this._image.naturalWidth + ' x ' + this._image.naturalHeight, 0, (-this._resizeConstraint.side / 2) - (this._ctx.lineWidth + this._ctx.lineWidth / 2));
	      // Восстановление состояния канваса, которое было до вызова ctx.save
	      // и последующего изменения системы координат. Нужно для того, чтобы
	      // следующий кадр рисовался с привычной системой координат, где точка
	      // 0 0 находится в левом верхнем углу холста, в противном случае
	      // некорректно сработает даже очистка холста или нужно будет использовать
	      // сложные рассчеты для координат прямоугольника, который нужно очистить.
	      this._ctx.restore();
	    },

	    /**
	     * Включение режима перемещения. Запоминается текущее положение курсора,
	     * устанавливается флаг, разрешающий перемещение и добавляются обработчики,
	     * позволяющие перерисовывать изображение по мере перетаскивания.
	     * @param {number} x
	     * @param {number} y
	     * @private
	     */
	    _enterDragMode: function(x, y) {
	      this._cursorPosition = new Coordinate(x, y);
	      document.body.addEventListener('mousemove', this._onDrag);
	      document.body.addEventListener('mouseup', this._onDragEnd);
	    },

	    /**
	     * Выключение режима перемещения.
	     * @private
	     */
	    _exitDragMode: function() {
	      this._cursorPosition = null;
	      document.body.removeEventListener('mousemove', this._onDrag);
	      document.body.removeEventListener('mouseup', this._onDragEnd);
	    },

	    /**
	     * Перемещение изображения относительно кадра.
	     * @param {number} x
	     * @param {number} y
	     * @private
	     */
	    updatePosition: function(x, y) {
	      this.moveConstraint(
	          this._cursorPosition.x - x,
	          this._cursorPosition.y - y);
	      this._cursorPosition = new Coordinate(x, y);
	    },

	    /**
	     * @param {MouseEvent} evt
	     * @private
	     */
	    _onDragStart: function(evt) {
	      this._enterDragMode(evt.clientX, evt.clientY);
	    },

	    /**
	     * Обработчик окончания перетаскивания.
	     * @private
	     */
	    _onDragEnd: function() {
	      this._exitDragMode();
	    },

	    /**
	     * Обработчик события перетаскивания.
	     * @param {MouseEvent} evt
	     * @private
	     */
	    _onDrag: function(evt) {
	      this.updatePosition(evt.clientX, evt.clientY);
	    },

	    /**
	     * Добавление элемента в DOM.
	     * @param {Element} element
	     */
	    setElement: function(element) {
	      if (this._element === element) {
	        return;
	      }

	      this._element = element;
	      this._element.insertBefore(this._container, this._element.firstChild);
	      // Обработчики начала и конца перетаскивания.
	      this._container.addEventListener('mousedown', this._onDragStart);
	    },

	    /**
	     * Возвращает кадрирование элемента.
	     * @return {Square}
	     */
	    getConstraint: function() {
	      return this._resizeConstraint;
	    },

	    /**
	     * Смещает кадрирование на значение указанное в параметрах.
	     * @param {number} deltaX
	     * @param {number} deltaY
	     * @param {number} deltaSide
	     */
	    moveConstraint: function(deltaX, deltaY, deltaSide) {
	      this.setConstraint(
	          this._resizeConstraint.x + (deltaX || 0),
	          this._resizeConstraint.y + (deltaY || 0),
	          this._resizeConstraint.side + (deltaSide || 0));
	    },

	    /**
	     * @param {number} x
	     * @param {number} y
	     * @param {number} side
	     */
	    setConstraint: function(x, y, side) {
	      if (typeof x !== 'undefined') {
	        this._resizeConstraint.x = x;
	      }

	      if (typeof y !== 'undefined') {
	        this._resizeConstraint.y = y;
	      }

	      if (typeof side !== 'undefined') {
	        this._resizeConstraint.side = side;
	      }

	      requestAnimationFrame(function() {
	        this.redraw();
	        window.dispatchEvent(new CustomEvent('resizerchange'));
	      }.bind(this));
	    },

	    /**
	     * Удаление. Убирает контейнер из родительского элемента, убирает
	     * все обработчики событий и убирает ссылки.
	     */
	    remove: function() {
	      this._element.removeChild(this._container);

	      this._container.removeEventListener('mousedown', this._onDragStart);
	      this._container = null;
	    },

	    /**
	     * Экспорт обрезанного изображения как HTMLImageElement и исходником
	     * картинки в src в формате dataURL.
	     * @return {Image}
	     */
	    exportImage: function() {
	      // Создаем Image, с размерами, указанными при кадрировании.
	      var imageToExport = new Image();

	      // Создается новый canvas, по размерам совпадающий с кадрированным
	      // изображением, в него добавляется изображение взятое из канваса
	      // с измененными координатами и сохраняется в dataURL, с помощью метода
	      // toDataURL. Полученный исходный код, записывается в src у ранее
	      // созданного изображения.
	      var temporaryCanvas = document.createElement('canvas');
	      var temporaryCtx = temporaryCanvas.getContext('2d');
	      temporaryCanvas.width = this._resizeConstraint.side;
	      temporaryCanvas.height = this._resizeConstraint.side;
	      temporaryCtx.drawImage(this._image,
	          -this._resizeConstraint.x,
	          -this._resizeConstraint.y);
	      imageToExport.src = temporaryCanvas.toDataURL('image/png');

	      return imageToExport;
	    }
	  };

	  /**
	   * Вспомогательный тип, описывающий квадрат.
	   * @constructor
	   * @param {number} x
	   * @param {number} y
	   * @param {number} side
	   * @private
	   */
	  var Square = function(x, y, side) {
	    this.x = x;
	    this.y = y;
	    this.side = side;
	  };

	  /**
	   * Вспомогательный тип, описывающий координату.
	   * @constructor
	   * @param {number} x
	   * @param {number} y
	   * @private
	   */
	  var Coordinate = function(x, y) {
	    this.x = x;
	    this.y = y;
	  };

	  return Resizer;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ]);