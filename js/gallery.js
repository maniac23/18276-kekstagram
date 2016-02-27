'use strict';
/**
 * @author Mikhail Tukai
*/
define(function() {
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
  Gallery.prototype.render = function() {
    this.show();
    this.setCurrentPicture(this.currentPicture);
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
   * @param {number} i - индекс фото в массиве pictures
   */
  Gallery.prototype.setCurrentPicture = function(i) {
    this.photo.src = this.pictures[i].url;
    this.likes.querySelector('.likes-count').textContent = this.pictures[i].likes;
    this.comments.querySelector('.comments-count').textContent = this.pictures[i].comments;
    if (this._data.liked === true) {
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
    this.hide();
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
    if (!this._data.liked === true) {
      this.likesCount.classList.add('likes-count-liked');
      this._data.likes++;
      this.likes.querySelector('.likes-count').textContent = this._data.likes;
      this._data.liked = true;
    } else {
      this.likesCount.classList.remove('likes-count-liked');
      this._data.likes--;
      this.likes.querySelector('.likes-count').textContent = this._data.likes;
      this._data.liked = false;
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
      this.hide();
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
      this.currentPicture++;
    }
  };
    /**
   * Метод для показа предыдущей фото
   * @method
   */
  Gallery.prototype.setPreviousPicture = function() {
    if (this.currentPicture > 0) {
      this.currentPicture--;
    }
  };

  return Gallery;
});
