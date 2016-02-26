define(function() {
var multyplyArrays = function(a, b) { // функция для перемножения элементов двух массивов
  var result = 0;

  for(var i=0, l = a.length; i < l; i++){
    result += a[i] * b[i];
  }

  return result;
}

var sumArrays= function(a,b){    // функция для суммирования элементов массива
	var sum=0;

	for(var i=0; i<a.length; i++){
		sum+=a[i];
	}
	return sum;
}

var getMessage = function(a, b) { // функция для подсчета статистики по разным типам изображений
	if (typeof(a)=='boolean') {
		if (a) {
			return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
		}
		else {
			return "Переданное GIF-изображение не анимировано";
		}
	}
	else if (typeof(a)=='number') {
		return "Переданное SVG-изображение содержит " + a + " объектов и " + b * 4 + " аттрибутов";
	}
	else if (typeof(a) =='object') {
		if (typeof(b) == 'object') {
			return  "Общая площадь артефактов сжатия: " + multyplyArrays(a, b) + " пикселей";
		}
		else {
			return "Количество красных точек во всех строчках изображения: "+ sumArrays(a,b);
		}
	}
}
});

