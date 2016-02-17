'use strict';
(function() {
  function Photo(data) {
    this._data = data;
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
    image.src = this._data.url;
    var replaceImg = this.pictureElement.querySelector('img');
      // успешная загрузка картинки
    image.onload = function() {
      clearTimeout(imageLoadTimeout);
      this.pictureElement.replaceChild(image, replaceImg);
    }.bind(this);
      // ошибка при загрузке
    image.onerror = function() {
      this.pictureElement.classList.add('picture-load-failure');
    }.bind(this);
      // ошибка по истечению таймаута
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      this.pictureElement.classList.add('picture-load-failure');
    }.bind(this), IMAGE_TIMEOUT);
  };
  window.Photo = Photo;
})();
