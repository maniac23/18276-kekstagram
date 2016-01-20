var getMessage = function(a, b){ // функция для подсчета статистики по разным типам изображений
	if(typeof(a)=='boolean'){
		if(a== true){
			return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";			 
		}
		else {
			return "Переданное GIF-изображение не анимировано";
		}
	}
	else if(typeof(a)=='number'){
		return "Переданное SVG-изображение содержит " + a + " объектов и " + b * 4 + " аттрибутов";	
	}
	else if(typeof(a) =='object'){
		if(typeof(b) == 'object'){
			square = 0;
			for(var i=0; i<a.length; i++){
				square += a[i]*b[i];
			}
			return  "Общая площадь артефактов сжатия: " + square + " пикселей";
		}
		else {
			 sum=0;
			for(var x=0; x<a.length; x++){
				sum+=a[x];
			}
			return "Количество красных точек во всех строчках изображения: "+ sum;
		}
	}
}	