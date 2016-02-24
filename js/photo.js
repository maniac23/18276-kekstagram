'use strict';
(function() {
  function Photo(data) {
    this._data = data;
    this.onPhotoClick = this.onPhotoClick.bind(this);
  }

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
      // успешная загрузка картинки
    image.addEventListener('load', function() {
      clearTimeout(imageLoadTimeout);
      this.pictureElement.replaceChild(image, replaceImg);
    }.bind(this));
      // ошибка при загрузке
    image.addEventListener('error', function() {
      this.pictureElement.classList.add('picture-load-failure');
    }.bind(this));
    image.src = this._data.url;
      // ошибка по истечению таймаута
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      this.pictureElement.classList.add('picture-load-failure');
    }.bind(this), IMAGE_TIMEOUT);

    this.pictureElement.addEventListener('click', this.onPhotoClick);
  };

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
  window.Photo = Photo;
})();
