var renderToCanvas = function (width, height, renderFunction) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    renderFunction(buffer.getContext('2d'));
    return buffer;
};

var drawOffScreenMap =  function (ctx) {
    for(x = 0; x < viewDimension; x += unitSize) {
        xTile = x /unitSize;  

        for(y = 0; y < viewDimension; y += unitSize) {
            yTile = y / unitSize;

            drawTile(xTile, yTile);
        }
    }
};


var getOffScreenTiles = function () {
    var offBlocks = new Array();
    var renderH = tileH;
    var renderW = tileW;

    blockCount = 0; 

    for (v=0; v<tileColorDict.length; v++) {
        offBlocks[v] = new Array();
        
        for (j = 0; j <= maxLevel; j++) {
            if(j > 0) {
                renderH = tileH*(j+1);
            }

            offBlocks[v][j] = {
                'image': renderToCanvas(renderW, renderH, drawOffScreenTiles)
            };
        }
    }
    return offBlocks;
}

var drawOffScreenTiles =  function (ctx) {
    var xpos = 0 - (tileW * blockCount);
    var ypos = 0;

    blockCount++;

    //draw an offscreen block...
    //...for each block type
    for (c=0; c < tileColorDict.length; c++) {

        tileHOffset    = tileH/2;
        tileWOffset    = tileW/2;
        tileHOffsetLvl = tileH/2;       

        //...for each possible level
        for(i = 0; i <= maxLevel; i++) {
    
            tileHOffsetLvl = (tileHOffset * (i-1));

            sideColor = c;
            tileColor = c;
         
             if(i >= 1) {
                ypos += (tileH/2) * i;
                ctx.fillStyle = sideColorDict[sideColor]; 
                //draw tile framing according to height/level
                ctx.beginPath();    
                    ctx.moveTo(xpos, ypos - tileHOffsetLvl);
                    ctx.lineTo(xpos, ypos + tileHOffset);
                    ctx.lineTo(xpos+tileWOffset, ypos + tileH);
                    ctx.lineTo(xpos+tileW, ypos + tileHOffset);
                    ctx.lineTo(xpos+tileW, ypos - tileHOffsetLvl);
                    ctx.moveTo(xpos+tileWOffset, ypos - tileHOffsetLvl);
                    ctx.lineTo(xpos+tileWOffset, ypos + tileH);
                    ctx.fill();
                    ctx.stroke();
                ctx.closePath();
                
             }
            
            ypos -= (i * level_step);

            //draw top tiles
            ctx.fillStyle = tileColorDict[tileColor];
            ctx.beginPath();
                ctx.moveTo(xpos, ypos+tileHOffset);
                ctx.lineTo(xpos+tileWOffset, ypos);
                ctx.lineTo(xpos+tileW, ypos+tileHOffset);
                ctx.lineTo(xpos+tileWOffset, ypos+tileH);
                ctx.lineTo(xpos, ypos+tileHOffset);
                ctx.fill();
            ctx.stroke();

            xpos += tileW;
            // ypos -= level_step;
        }
    }
};

var drawTile = function  (xTile, yTile) {        
    //change tile colors depending on tile state
    if(tileData[xTile][yTile].isSelected){
         tileData[xTile][yTile].tileImgIndex = 2;
     } else if (tileData[xTile][yTile].hasFocus) {
         tileData[xTile][yTile].tileImgIndex = 3;
    }

    xpos = tileData[xTile][yTile].posX;

    //draw tile framing according to height/level
    if (tileData[xTile][yTile].isLand && tileData[xTile][yTile].level >= 1) {  
        ypos = tileData[xTile][yTile].posY - (tileData[xTile][yTile].level * level_step);
        ctx.drawImage(offBlocksArray[tileData[xTile][yTile].tileImgIndex][tileData[xTile][yTile].level].image, xpos, ypos);
    } else {
     	ypos = tileData[xTile][yTile].posY;
        ctx.drawImage(offBlocksArray[tileData[xTile][yTile].tileImgIndex][tileData[xTile][yTile].level].image, xpos,  ypos);
    }
};

var drawOffScreenBlocks = function (ctx) {
	for (i = 0; i <= 2; i++) {
		tileHOffset    = (tileH/2);
		tileWOffset    = tileW/2;
		tileHOffsetLvl = (tileH/2) * (i-1);
		xpos = (50*i);
		ypos = tileH;

		if(i === 0) {
			sideColor = 0;
			tileColor = 0;
		} else {
			sideColor = 1;
			tileColor = 1;
		}
	 
		 if(i >= 1) {
		 	ctx.fillStyle = sideColorDict[sideColor]; 
			//draw tile framing according to height/level
		    ctx.beginPath();	
		        ctx.moveTo(xpos, ypos - tileHOffsetLvl);
		        ctx.lineTo(xpos, ypos + tileHOffset);
		        ctx.lineTo(xpos+tileWOffset, ypos + tileH);
		        ctx.lineTo(xpos+tileW, ypos + tileHOffset);
		        ctx.lineTo(xpos+tileW, ypos - tileHOffsetLvl);
		        ctx.lineTo(xpos+tileWOffset, ypos - tileHOffsetLvl);
		        ctx.moveTo(xpos+tileWOffset, ypos - tileHOffsetLvl);
		        ctx.lineTo(xpos+tileWOffset, ypos + tileH);
		        ctx.fill();
		    ctx.closePath();
		    ctx.stroke();
		 }
		
		ypos = ypos - (i * level_step);

		//draw ground tiles
		// ctx.drawImage(tileImg[tileData[xTile][yTile].tileImgIndex], xpos, ypos);

		ctx.fillStyle = tileColorDict[tileColor];

		//draw top tiles
		ctx.beginPath();
			ctx.moveTo(xpos, ypos+tileH/2);
			ctx.lineTo(xpos+tileW/2, ypos);
			ctx.lineTo(xpos+tileW, ypos+tileH/2);
			ctx.lineTo(xpos+tileW/2, ypos+tileH);
			ctx.lineTo(xpos, ypos+tileH/2);
			ctx.fill();
		ctx.stroke();
	}
};

var drawMouseHighlight = function () {
    ctx.fillStyle = 'rgba(255, 255, 120, 0.7)';
    ctx.beginPath();
    ctx.moveTo(xpos, ypos + tileH/2);
    ctx.lineTo(xpos+tileW/2, ypos);
    ctx.lineTo(xpos+tileW, ypos+tileH/2);
    ctx.lineTo(xpos+tileW/2, ypos+tileH);
    ctx.lineTo(xpos, ypos+tileH/2);
    ctx.fill();
};