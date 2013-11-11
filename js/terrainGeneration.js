function terrainGeneration(){
	// Set these variables to adjust how the map is generated
		var roughness,
		genPerspective, sunX = 300, sunY = 300,
		generate         = document.getElementById('generate'),	
		btnSaveMap       = document.getElementById('savemap');

	// Setup the map array for use
	function create2DArray(d1, d2) {
		var x = new Array(d1),
		i = 0,
		j = 0;
		
		for (i = 0; i < d1; i += 1) {
			x[i] = new Array(d2);
		}
	  
		for (i=0; i < d1; i += 1) {
			for (j = 0; j < d2; j += 1) {
				x[i][j] = 0;
			}
		}

		return x;
	}			
	
	function gen () {
		var elTerDimension 	   = document.getElementById('terdim'),
			elRoughness        = document.getElementById('roughness'),
			elUnitsize         = document.getElementById('unitsize'),
			selMapType         = document.getElementById('maptype'),
			elSunX             = document.getElementById("sunx"),
			elSunY             = document.getElementById("suny");			
			
		roughness      = parseInt(elRoughness.value);
		mapDimension   = parseInt(elTerDimension.value);
		unitSize       = parseInt(elUnitsize.value);
		// mapType        = parseInt(selMapType.options[selMapType.selectedIndex].value);
		mapType        = 3;
		
		if(roughness < 0 || isNaN(roughness)){
			roughness = 1;
		}
		
		if(mapDimension < 0 || isNaN(mapDimension)){
			mapDimension = 128;
		}
		
		if(unitSize < 1 || isNaN(unitSize)){
			unitSize = 1;
		}
				
		mapCanvas.width  = mapDimension/4;
		mapCanvas.height = mapDimension/4;
		
		mapData = create2DArray(mapDimension+1, mapDimension+1);
		
		startDisplacement();
		
		// newMap = 1;
		mapStateChanged = 1;
		newMapGenerated = 1;
		//call draw function from CityController.js after generation of Heightmap
		// draw();
	}

	generate.onclick = gen;
	gen();

	// Save the current heightmap into a new window. Found info on http://www.nihilogic.dk/labs/canvas2image/
	btnSaveMap.onclick = function(){
		var strDataURI = mapCanvas.toDataURL();
		window.open(strDataURI);
	}
	
	// Random function to offset the center
	function displace(num){
		var max = num / (mapDimension + mapDimension) * roughness;       
		return (Math.random(1.0)- 0.5) * max;  
	}
	
	// Normalize the value to make sure its within bounds
	function normalize(value){
		if( value > 1){
			value = 1;
		}else if(value < 0){
			value = 0;
		}
		return value;
	}
	
	// Round to nearest pixel
	function round(n)
	{
		if (n-(parseInt(n)) >= 0.5){
			return parseInt(n)+1;
		}else{
			return parseInt(n);
		}
	}
	
	// Workhorse of the terrain generation.
	function midpointDisplacment(dimension){
		var newDimension = dimension / 2, 
			top, topRight, topLeft, bottom, bottomLeft, bottomRight, right, left, center,
			i, j;
		
		if (newDimension > unitSize){
			for(i = newDimension; i <= mapDimension; i += newDimension){
				for(j = newDimension; j <= mapDimension; j += newDimension){
					x = i - (newDimension / 2);
					y = j - (newDimension / 2);
					
					topLeft = mapData[i - newDimension][j - newDimension]; 
					topRight = mapData[i][j - newDimension];
					bottomLeft = mapData[i - newDimension][j];
					bottomRight = mapData[i][j];
					
					// Center				
					mapData[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(dimension);
					mapData[x][y] = normalize(mapData[x][y]);
					center = mapData[x][y];	
					
					// Top
					if(j - (newDimension * 2) + (newDimension / 2) > 0){
						mapData[x][j - newDimension] = (topLeft + topRight + center + mapData[x][j - dimension + (newDimension / 2)]) / 4 + displace(dimension);;
					}else{
						mapData[x][j - newDimension] = (topLeft + topRight + center) / 3+ displace(dimension);
					}
					
					mapData[x][j - newDimension] = normalize(mapData[x][j - newDimension]);
			
					// Bottom
					if(j + (newDimension / 2) < mapDimension){
						mapData[x][j] = (bottomLeft + bottomRight + center + mapData[x][j + (newDimension / 2)]) / 4+ displace(dimension);
					}else{
						mapData[x][j] = (bottomLeft + bottomRight + center) / 3+ displace(dimension);
					}
					
					mapData[x][j] = normalize(mapData[x][j]);

					
					//Right
					if(i + (newDimension / 2) < mapDimension){
						mapData[i][y] = (topRight + bottomRight + center + mapData[i + (newDimension / 2)][y]) / 4+ displace(dimension);
					}else{
						mapData[i][y] = (topRight + bottomRight + center) / 3+ displace(dimension);
					}
					
					mapData[i][y] = normalize(mapData[i][y]);
					
					// Left
					if(i - (newDimension * 2) + (newDimension / 2) > 0){
						mapData[i - newDimension][y] = (topLeft + bottomLeft + center + mapData[i - dimension + (newDimension / 2)][y]) / 4 + displace(dimension);;
					}else{
						mapData[i - newDimension][y] = (topLeft + bottomLeft + center) / 3+ displace(dimension);
					}
					
					mapData[i - newDimension][y] = normalize(mapData[i - newDimension][y]);
				}
			}
			midpointDisplacment(newDimension);
		}
	}			
	
	// Draw the map
	// function drawMap(size, canvasId, mapData, mapType) {
	// 	var canvas = document.getElementById(canvasId),
	// 		ctx = canvas.getContext("2d"),
	// 		canvasData = ctx.getImageData(0, 0, mapDimension, mapDimension),
	// 		x = 0,
	// 		y = 0,
	// 		r = 0, g = 0, b = 0, gamma = 500,
	// 		colorFill = 0;

	// 	//shrink mini map sample
	// 	ctx.save()
	// 	ctx.translate(0,0);
 //  		ctx.scale(0.25,0.25);

	// 	for(x = 0; x <= size; x += unitSize){
	// 		for(y = 0; y <= size; y += unitSize){
	// 			switch(mapType){
	// 				case 2: // Standard
	// 					colorFill = Math.floor(mapData[x][y] * 250);
	// 					ctx.fillStyle = "rgb(" + colorFill + "," +  colorFill + "," + colorFill +")";
	// 					break;
	// 				case 3: // 10 shades
	// 					if(mapData[x][y] <= 0){
	// 						colorFill  = 0;
	// 					}else if(mapData[x][y] > 0 && mapData[x][y] <= 0.1){
	// 						colorFill = 20;
	// 					}else if(mapData[x][y] > 0.1 && mapData[x][y] <= 0.2){
	// 						colorFill = 40;
	// 					}else if(mapData[x][y] > 0.2 && mapData[x][y] <= 0.3){
	// 						colorFill = 60;
	// 					}else if(mapData[x][y] > 0.3 && mapData[x][y] <= 0.4){
	// 						colorFill = 80;
	// 					}else if(mapData[x][y] > 0.4 && mapData[x][y] <= 0.5){
	// 						colorFill = 100;
	// 					}else if(mapData[x][y] > 0.5 && mapData[x][y] <= 0.6){
	// 						colorFill = 120;
	// 					}else if(mapData[x][y] > 0.6 && mapData[x][y] <= 0.7){
	// 						colorFill = 140;
	// 					}else if(mapData[x][y] > 0.7 && mapData[x][y] <= 0.8){
	// 						colorFill = 160;
	// 					}else if(mapData[x][y] > 0.8 && mapData[x][y] <= 0.9){
	// 						colorFill = 180;
	// 					}else if(mapData[x][y] > 0.9 && mapData[x][y] <= 1){
	// 						colorFill = 200;
	// 					}else if(mapData[x][y] >= 1){
	// 						colorFill = 210;
	// 					}
						
	// 					ctx.fillStyle = "rgb(" + colorFill + "," +  colorFill + "," + colorFill +")";
	// 					break;
	// 				case 4: // 2 shades
	// 					if(mapData[x][y] <= 0.5){
	// 						mapData[x][y] = 0;
	// 					}else if(mapData[x][y] > 0.5){
	// 						mapData[x][y] = 220;
	// 					}
						
	// 					colorFill = mapData[x][y];
	// 					ctx.fillStyle = "rgb(" + colorFill + "," +  colorFill + "," + colorFill +")";
	// 					break;
	// 			}

	// 			ctx.fillRect (x, y, unitSize, unitSize);
	// 		}
	// 	}
	    
	// 	ctx.restore();
	// }
	
	// Starts off the map generation, seeds the first 4 corners
	function startDisplacement(){
		var x = mapDimension,
			y = mapDimension,
			tr, tl, t, br, bl, b, r, l, center;
		
		// top left
		mapData[0][0] = Math.random(1.0);
		tl = mapData[0][0];
		
		// bottom left
		mapData[0][mapDimension] = Math.random(1.0);
		bl = mapData[0][mapDimension];
		
		// top right
		mapData[mapDimension][0] = Math.random(1.0);
		tr = mapData[mapDimension][0];
		
		// bottom right
		mapData[mapDimension][mapDimension] = Math.random(1.0);
		br = mapData[mapDimension][mapDimension]
		
		// Center
		mapData[mapDimension / 2][mapDimension / 2] = mapData[0][0] + mapData[0][mapDimension] + mapData[mapDimension][0] + mapData[mapDimension][mapDimension] / 4;
		mapData[mapDimension / 2][mapDimension / 2] = normalize(mapData[mapDimension / 2][mapDimension / 2]);
		center = mapData[mapDimension / 2][mapDimension / 2];
		
		mapData[mapDimension / 2][mapDimension] = bl + br + center / 3;
		mapData[mapDimension / 2][0] = tl + tr + center / 3;
		mapData[mapDimension][mapDimension / 2] = tr + br + center / 3;
		mapData[0][mapDimension / 2] = tl + bl + center / 3;
		
		// Call displacment 
		midpointDisplacment(mapDimension);
		
		// Draw everything after the terrain vals are generated
		drawMap(mapDimension, "terrainCanvas", mapData, mapType);
						
		btnSaveMap.style.display = "block";
	}
};

// Draw the map
function drawMap(size, canvasId, mapData, mapType) {
	var canvas = document.getElementById(canvasId),
		ctx = canvas.getContext("2d"),
		canvasData = ctx.getImageData(0, 0, mapDimension, mapDimension),
		x = 0,
		y = 0,
		r = 0, g = 0, b = 0, gamma = 500,
		colorFill = 0;

	//shrink mini map sample
	ctx.save()
	ctx.translate(0,0);
		ctx.scale(0.25,0.25);

	for(x = 0; x <= size; x += unitSize){
		for(y = 0; y <= size; y += unitSize){
			switch(mapType){
				case 2: // Standard
					colorFill = Math.floor(mapData[x][y] * 250);
					ctx.fillStyle = "rgb(" + colorFill + "," +  colorFill + "," + colorFill +")";
					break;
				case 3: // 10 shades
					if(mapData[x][y] <= 0){
						colorFill  = 0;
					}else if(mapData[x][y] > 0 && mapData[x][y] <= 0.1){
						colorFill = 20;
					}else if(mapData[x][y] > 0.1 && mapData[x][y] <= 0.2){
						colorFill = 40;
					}else if(mapData[x][y] > 0.2 && mapData[x][y] <= 0.3){
						colorFill = 60;
					}else if(mapData[x][y] > 0.3 && mapData[x][y] <= 0.4){
						colorFill = 80;
					}else if(mapData[x][y] > 0.4 && mapData[x][y] <= 0.5){
						colorFill = 100;
					}else if(mapData[x][y] > 0.5 && mapData[x][y] <= 0.6){
						colorFill = 120;
					}else if(mapData[x][y] > 0.6 && mapData[x][y] <= 0.7){
						colorFill = 140;
					}else if(mapData[x][y] > 0.7 && mapData[x][y] <= 0.8){
						colorFill = 160;
					}else if(mapData[x][y] > 0.8 && mapData[x][y] <= 0.9){
						colorFill = 180;
					}else if(mapData[x][y] > 0.9 && mapData[x][y] <= 1){
						colorFill = 200;
					}else if(mapData[x][y] >= 1){
						colorFill = 210;
					}
					
					ctx.fillStyle = "rgb(" + colorFill + "," +  colorFill + "," + colorFill +")";
					break;
				case 4: // 2 shades
					if(mapData[x][y] <= 0.5){
						mapData[x][y] = 0;
					}else if(mapData[x][y] > 0.5){
						mapData[x][y] = 220;
					}
					
					colorFill = mapData[x][y];
					ctx.fillStyle = "rgb(" + colorFill + "," +  colorFill + "," + colorFill +")";
					break;
			}

			ctx.fillRect (x, y, unitSize, unitSize);
		}
	}
    
	ctx.restore();
}