function getTileLevel (mapColorValue) {
    var level;

    //check heightmap values and assign levels 
    if (mapColorValue <= 0) {
        level = -4;
    } else if (mapColorValue > 0   && mapColorValue <= 0.1) {
        level = -3;
    } else if (mapColorValue > 0.1 && mapColorValue <= 0.2) {
        level = -2;
    } else if (mapColorValue > 0.2 && mapColorValue <= 0.3) {
        level = -1;
    } else if (mapColorValue > 0.3 && mapColorValue <= 0.4) {
        level = -1;
    } else if (mapColorValue > 0.4 && mapColorValue <= 0.5) {
        level = -1;
    } else if (mapColorValue > 0.5 && mapColorValue <= 0.6) {
        level = 0;
    } else if (mapColorValue > 0.6 && mapColorValue <= 0.7) {
        level = 1;
    } else if (mapColorValue > 0.7 && mapColorValue <= 0.8) {
        level = 2;
    } else if (mapColorValue > 0.8 && mapColorValue <= 0.9) {
        level = 2;
    } else if (mapColorValue > 0.9 && mapColorValue <= 1) {
        level = 3;
    } else if (mapColorValue >= 1) {
        level = 3;
    }

    return level;
}   

//generate tile array
var populateMapArray = function () {
    for(x = 0; x < mapDimension/unitSize; x++) {
        xTile = x;
       
        tileData[xTile] = new Array(); 

        for(y = 0; y < mapDimension/unitSize; y ++) {
            yTile = y;
            var xpos = (x - y)*tileH + unitSize + mapXOffset;
            var ypos = (x + y)*tileH/2 + unitSize + mapYOffset;
            var level;

            //build Tile Data Map
            tileData[xTile][yTile] = new Array();

            //get tile level from heightmap
            level = getTileLevel( mapData[x*unitSize][y*unitSize] );

            //set up/down direction and tile side color, tile base image
            if (level >= 0) {
                sideColorIndex = 1;
                tileImgIndex = 1;
                dir = 1;
            } else {
                sideColorIndex = 0;
                level *= -1;
                tileImgIndex = 0;
                dir = 0;
            }

            tileData[x][y] = {
                'mapX': x,
                'mapY': y,
                'posX': xpos,
                'posY': ypos,
                'level': level,
                'tileImgIndex': tileImgIndex,
                'tileImgIndexOrg' : tileImgIndex,
                'sideColorIndex': sideColorIndex, 
                'isLand': dir,
                'hasFocus': 0,
                'isSelected': 0,
                'xId': x,
                'yId': y
            };

            // if(y <= viewDimension/unitSize-1 && x <= viewDimension/unitSize-1){
            //     tilesInViewData[xTile] = new Array();
            //     tilesInViewData[xTile][yTile] = new Array();
            //     tilesInViewData[x][y] = tileData[x][y];
            // }
        }
    }
    // console.log(tilesInViewData.length, tileData.length);
};

var arrayRotate = function (dir, arr) {

    var source  = arr,
        temp    = cloneObj(arr),
        posX,
        posY,
        xId,
        yId;

    (dir == 'r') ? dirRight = 1 : dirRight = 0;

    for (j = 0; j < source[0].length; j++) {
        for (i = 0; i < source.length; i++) {
            //cache position and isoCoords
            posX = temp[j][i].posX;
            posY = temp[j][i].posY;
            xId = temp[j][i].xId;
            yId = temp[j][i].yId;

            if(dirRight) {
                temp[j][i] = source[i][source.length - j - 1];
            } else {
                temp[j][i] = source[source.length - i - 1][j];
            }

            //restore position and isoCoords
            temp[j][i].posX = posX;
            temp[j][i].posY = posY;
            temp[j][i].xId = xId;
            temp[j][i].yId = yId;
        }
    }
    
    return temp;
};

var arrayMove = function (dir, arr) {

    var source  = arr,
        temp    = cloneObj(arr),
        posX,
        posY,
        xId,
        yId,
        length = (viewDimension/unitSize)-1,
        edge = 0;

        movedDir = 0;

    //have to move it, move it
    //understanding this in a few weeks will be lots of fun
    switch(dir)
    {
        case 'n': //north
           for (j = 0; j < source[0].length; j++) {
                for (i = 0; i < source.length; i++) {
                    if((temp[j][i].mapX == 0 && temp[j][i].xId == 0) || (temp[j][i].mapY == 0 && temp[j][i].yId == 0) ){
                        console.log('End of Map - North edge');
                        edge = 1;
                        break;
                    }
                }
            }
            if (edge) {break;}
            // console.log('n');
            var cache = source[source.length -1];
            temp.pop();
            temp.unshift(cache);
            temp = arrayRotate('l',temp);
            var cache = temp[temp.length -1];
            temp.pop();
            temp.unshift(cache);
            temp = arrayRotate('r',temp);
            movedDir = 'n';
            break;
        case 'w': //west
           for (j = 0; j < source[0].length; j++) {
                for (i = 0; i < source.length; i++) {
                    if(temp[j][i].mapX == 0 && temp[j][i].xId == 0){
                        console.log('End of Map - West edge');
                        edge = 1;
                        break;
                    }
                }
            }
            if (edge) {break;}
            // console.log('w');
            temp = arrayRotate('r',temp);
            var cache = temp[temp.length -1];
            temp.pop();
            temp.unshift(cache);
            temp = arrayRotate('l',temp);
            var cache = temp[temp.length -1];
            temp.pop();
            temp.unshift(cache);
            movedDir = 'w';
            break;
        case 'e': //east
           for (j = 0; j < source[0].length; j++) {
                for (i = 0; i < source.length; i++) {
                    if((temp[j][i].mapX == 0 && temp[j][i].xId == 0) || (temp[j][i].mapY == 0 && temp[j][i].yId == 0) ){
                        console.log('End of Map - East edge');
                        edge = 1;
                        break;
                    }
                }
            }
            // console.log('e');
            if (edge) {break;}
            temp = arrayRotate('l',temp);
            var cache = temp[temp.length -1];
            temp.pop();
            temp.unshift(cache);
            temp = arrayRotate('r',temp);
            var cache = temp[0];
            temp.shift();
            temp.push(cache);
            movedDir = 'e';
            break;
        case 's': //south
            // console.log('s');
            var cache = temp[0];
            temp.shift();
            temp.push(cache);
            temp = arrayRotate('r',temp);
            var cache = temp[temp.length -1];
            temp.pop();
            temp.unshift(cache);
            temp = arrayRotate('l',temp);
            movedDir = 's';
            break;
        default:
            break;
    }

    //reset screen coordinates etc
    for (j = 0; j < source[0].length; j++) {
        for (i = 0; i < source.length; i++) {
            temp[j][i].posX = source[j][i].posX;
            temp[j][i].posY = source[j][i].posY;
            temp[j][i].xId = source[j][i].xId;
            temp[j][i].yId = source[j][i].yId;
        }
    }

    return temp;
};