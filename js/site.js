$(document).ready(function(){
	ymaps.ready(init);
	var checkPoints = [];
	
	function drawPointsOnMap(arr = checkPoints, map = myMap){ //Рисуем точки маршрута и линию на карте
		cleanArr = [];
		arr.forEach(function(item, i, arr){
	    	var point = new ymaps.GeoObject({
            // Описание геометрии.
	            geometry: {
	                type: "Point",
	                coordinates: [item[0], item[1]]
	            },
	            // Свойства.
	            properties: {
	                // Контент метки.
	                balloonContent: item[2],
	                preset: 'islands#circleIcon',
	                myID:cleanArr.length
	            }
	        }, {
	            // Опции.
	            // Иконка метки будет растягиваться под размер ее содержимого.
	            preset: 'islands#blackStretchyIcon',
	            // Метку можно перемещать.
	            draggable: true
	        });
	    	// Разрешаем перетаскивание геообъекта только вдоль горизонтальной оси.
			point.events.add("dragend", function (event) {
				var coors = point.geometry.getCoordinates();
			    item[0] = coors[0];
			    item[1] = coors[1];
			    map.geoObjects.removeAll();
	    		drawPointsOnMap(checkPoints, map);
			});


	    	cleanArr.push([item[0], item[1]]);
	        
	        map.geoObjects.add(point);
	        

	    });
	    var myPolyline = new ymaps.Polyline(cleanArr,{},{strokeWidth: 4});
	    map.geoObjects.add(myPolyline);

	}

	function drawPointsListItems(arr = checkPoints){
		var finalString = "";
		arr.forEach(function(item, i, arr){
			finalString += "<li data-point-id='"+i+"'>"+item[2]+"<span class='del-point'>x</span></li>";
		});
		return finalString;
	}
	
	

	function init() {
		var pointContainer = $("#points-container");
	    // Создаем карту.
	    var myMap = new ymaps.Map("map", {
	            center: [55.72, 37.64],
	            zoom: 10
	        }, {
	            searchControlProvider: 'yandex#search'
	        });
	    //Опции сортировки для функции sortable() списка точек маршрута
	    var sortableOptions = {
			cancel: "span",
			update: function( event, ui ) {
				var newOrder = [];
				$("#points-container li").each(function(i){
					var oldID = $(this).attr("data-point-id");				
					newOrder.push([checkPoints[oldID][0],checkPoints[oldID][1],checkPoints[oldID][2]]);		    				
				});
				checkPoints = newOrder;
				reloadPoints();
				
			}
		}
	    function reloadPoints(arr = checkPoints, map = myMap){
	    	//очищаем карту от обьектов
	    	myMap.geoObjects.removeAll();
	    	//Наносим точки на карту, выводим список, вешаем на него сортировку
	    	drawPointsOnMap(checkPoints, myMap);
		    pointContainer.html(drawPointsListItems(checkPoints));
	    	pointContainer.sortable(sortableOptions);
	    }

	    
	    //reloadPoints();


	    
	    
	    $('#pointName').keydown(function (e) { //событие добавления в массив точек маршрута.
	    	var errorText = "";
	    	
	    	if(e.keyCode == 13){
	    		$('.error-container').val("");
	    		if($(this).val() == ""){
		    		errorText += "Ошибка! название точки не может быть пустым!";
		    	}
		    	if(errorText == ""){
		    		$('.error-container').val("");
			    	var name = $(this).val();
			    	var coords = myMap.getCenter();	
			    	checkPoints.push([coords[0],coords[1],name]);
			    	
			    	
			    	//Наносим точки на карту, выводим список, вешаем на него сортировку
				    reloadPoints();

				    //вешаем событие удаления на спан 
			    	$(".del-point").on("click", function(){
				    	
				    	delID = $(this).parent().attr("data-point-id");
				    	checkPoints.splice(delID,1);
				    	
				    	//Наносим точки на карту, выводим список, вешаем на него сортировку
					    reloadPoints();

				    });		    	
			    	$('#pointName').val("");
		    	}		    
			}
			
			$('.error-container').text(errorText);
			
	    });

	    

	    //центруем прицел
	    $('#map .pointer').css("left",parseInt($('#map ymaps').width())/2-parseInt($('#map .pointer').width())/2);
	    $('#map .pointer').css("top",parseInt($('#map ymaps').height())/2-parseInt($('#map .pointer').height())/2);
	    $('#pointName').focus();
	    

	    
	}

});
