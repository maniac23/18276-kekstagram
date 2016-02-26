'use strict';
define(function() {
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButtton = document.querySelector('.gallery-overlay-close');
    this.photo = document.querySelector('.gallery-overlay-image');
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onLikeClick = this._onLikeClick.bind(this);
    this.likes = document.querySelector('.gallery-overlay-controls-like');
    this.likesCount = document.querySelector('.likes-count');
    this.comments = document.querySelector('.gallery-overlay-controls-comments');
    this.pictures = [];
    this.currentPicture = 0;
  };

  Gallery.prototype.render = function() {
    this.show();
    this.setCurrentPicture(this.currentPicture);
  };
  // показ галереи
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this.setCurrentPicture(0);
    this._closeButtton.addEventListener('click', this._onCloseClick);
    this.photo.addEventListener('click', this._onPhotoClick);
    window.addEventListener('keydown', this._onKeyDown);
    this.likes.addEventListener('click', this._onLikeClick);
  };

  // убирание галереи
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._closeButtton.removeEventListener('click', this._onCloseClick);
    this.photo.removeEventListener('click', this._onPhotoClick);
    window.removeEventListener('keydown', this._onKeyDown);
    this.likes.removeEventListener('click', this._onLikeClick);
  };

  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
    this.picturesCount = pictures.length;
  };

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
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  Gallery.prototype._onPhotoClick = function() {
    this.setNextPicture();
    this.setCurrentPicture(this.currentPicture);

  };
// клики по лайкам
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

  Gallery.prototype.setData = function(data) {
    this._data = data;
    this.currentPicture = this.getPictureNumber(data.url);
  };

  Gallery.prototype.getPictureNumber = function(url) {
    for (var i = 0; i < this.pictures.length; i++) {
      if (url === this.pictures[i].url) {
        this.currentPicture = i;
        return i;
      }
    }
  };

  Gallery.prototype.setNextPicture = function() {
    if (this.currentPicture < this.picturesCount - 1) {
      this.currentPicture++;
    }
  };

  Gallery.prototype.setPreviousPicture = function() {
    if (this.currentPicture > 0) {
      this.currentPicture--;
    }
  };

  return Gallery;
});
