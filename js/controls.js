function mouseCheck (e){
    var x = e.pageX;
    var y = e.pageY;

    ymouse = (2*(y-canvas.offsetTop-mapYOffset)-x+canvas.offsetLeft+mapXOffset)/2;
    xmouse = x+ymouse-mapXOffset-(tileW+2)-canvas.offsetLeft;
    
    xmouse = xmouse + tileH/2;
    // ymouse = ymouse - tileH/2;

    ymouse = Math.round(ymouse/tileH); 
    xmouse = Math.round(xmouse/tileH);
    // console.log('mouseX',xmouse,'mouseY', ymouse);
}

//mouse rollover logic 
function mouseRollOver () {
    for(x = 0; x < mapDimension/unitSize; x++) {
        for(y = 0; y < mapDimension/unitSize; y++) {
            xpos = tileData[x][y].posX;

            if(tileData[x][y].isLand) {
                ypos = tileData[x][y].posY - (tileData[x][y].level * level_step);
            } else {
                ypos = tileData[x][y].posY;
            }
            

            if((tileData[x][y].xId) === xmouse && (tileData[x][y].yId) === ymouse){ 
                if(!(lastFocusedTileX === tileData[x][y].xId && lastFocusedTileY === tileData[x][y].yId)) {
                    newFocus = 1;
                    if(!tileData[x][y].isSelected){
                        tileData[x][y].hasFocus = 1;

                        objFocusedTile = tileData[x][y];
                    }

                    if(lastFocusedTileX !== -1 && lastFocusedTileY !== -1) {
                       tileData[lastFocusedTileX][lastFocusedTileY].hasFocus = 0; 
                       //reset tile color to original value
                       tileData[lastFocusedTileX][lastFocusedTileY].tileImgIndex = tileData[lastFocusedTileX][lastFocusedTileY].tileImgIndexOrg;
                    }
                    
                    lastFocusedTileX = tileData[x][y].xId;
                    lastFocusedTileY = tileData[x][y].yId;   

                    mapStateChanged = 1; 
                } else {
                    newFocus = 0;
                }                     
            }
        }
    }
}

function mouseClick (e) {
    if(xmouse >= 0 && xmouse <= (mapDimension/unitSize-1) && ymouse >= 0 && ymouse <= (mapDimension/unitSize-1)) {

        if(tileData[xmouse][ymouse].isSelected) {
            tileData[xmouse][ymouse].tileImgIndex = tileData[xmouse][ymouse].tileImgIndexOrg; 
            tileData[xmouse][ymouse].isSelected = 0;
        } else {
            if(objSelectedTile) {
                tileData[objSelectedTile.xId][objSelectedTile.yId].tileImgIndex = tileData[objSelectedTile.xId][objSelectedTile.yId].tileImgIndexOrg; 
                tileData[objSelectedTile.xId][objSelectedTile.yId].isSelected = 0;  
            }
            tileData[xmouse][ymouse].isSelected = 1;
            objSelectedTile = tileData[xmouse][ymouse];
        }        

        //set redraw flag
        mapStateChanged = 1;
        console.log('X', xmouse, 'Y', ymouse, 'Level', tileData[xmouse][ymouse].level, 'isLand', tileData[xmouse][ymouse].isLand, 'TileObject', tileData[xmouse][ymouse]);
    }

    e.preventDefault();
}

var clickbuttonRotateLeft = function () {
    //reset tile hover if we have one
    if(objFocusedTile) {
        objFocusedTile.hasFocus = 0;
        objFocusedTile.tileImgIndex = objFocusedTile.tileImgIndexOrg;
    }

    //shift array
    tileData = arrayRotate('l',tileData);

    mapStateChanged = 1;
};

var clickbuttonRotateRight = function () {
    //reset tile hover if we have one
    if(objFocusedTile) {
        objFocusedTile.hasFocus = 0;
        objFocusedTile.tileImgIndex = objFocusedTile.tileImgIndexOrg;
    }

    //shift array
    tileData = arrayRotate('r', tileData);

    mapStateChanged = 1;
};

var clickbuttonMoveSouth = function () {
    //reset tile hover if we have one
    if(objFocusedTile) {
        objFocusedTile.hasFocus = 0;
        objFocusedTile.tileImgIndex = objFocusedTile.tileImgIndexOrg;
    }

    //shift array
    tileData = arrayMove('s', tileData);

    mapStateChanged = 1;
};

var clickbuttonMoveNorth = function () {
    //reset tile hover if we have one
    if(objFocusedTile) {
        objFocusedTile.hasFocus = 0;
        objFocusedTile.tileImgIndex = objFocusedTile.tileImgIndexOrg;
    }

    //shift array
    tileData = arrayMove('n', tileData);

    mapStateChanged = 1;
};

var clickbuttonMoveWest = function () {
    //reset tile hover if we have one
    if(objFocusedTile) {
        objFocusedTile.hasFocus = 0;
        objFocusedTile.tileImgIndex = objFocusedTile.tileImgIndexOrg;
    }

    //shift array
    tileData = arrayMove('w', tileData);

    mapStateChanged = 1;
};

var clickbuttonMoveEast = function () {
    //reset tile hover if we have one
    if(objFocusedTile) {
        objFocusedTile.hasFocus = 0;
        objFocusedTile.tileImgIndex = objFocusedTile.tileImgIndexOrg;
    }

    //shift array
    tileData = arrayMove('e', tileData);

    mapStateChanged = 1;
};


var clickbuttonFlattenTerrain = function () {
    console.log('clickbutton FlattenTerrain');

    if(objSelectedTile) {
        var newLevel = tileData[objSelectedTile.xId][objSelectedTile.yId].level;

        if(objSelectedTile.isLand) {
             newLevel -= 1;
        } else {
            newLevel += 1;
        }

        //changed from water to land and the other way
        if(newLevel < 0 ) {  
            newLevel = 0;

            if (objSelectedTile.isLand) {
                tileData[objSelectedTile.xId][objSelectedTile.yId].isLand = 0;
                tileData[objSelectedTile.xId][objSelectedTile.yId].tileImgIndexOrg = 0;
            } else {
                    tileData[objSelectedTile.xId][objSelectedTile.yId].isLand = 1;
                    tileData[objSelectedTile.xId][objSelectedTile.yId].tileImgIndexOrg = 1;
            }  
        } else if (newLevel >= 0 && objSelectedTile.isLand ) { 
            tileData[objSelectedTile.xId][objSelectedTile.yId].level = newLevel;
        } else if (newLevel >= 0 && !objSelectedTile.isLand && newLevel <= maxLevel) {
            tileData[objSelectedTile.xId][objSelectedTile.yId].level += 1;
        } else {
            console.log('Info: no change, max level reached');
        }

        mapStateChanged = 1;   
    } else {
        console.log('Info: no tile selected');
    }
};

var clickbuttonRiseTerrain = function () {
    console.log('clickbutton RiseTerrain');

    if(objSelectedTile) {
        var newLevel = tileData[objSelectedTile.xId][objSelectedTile.yId].level;

        if( objSelectedTile.isLand ) {
             newLevel += 1;
             if(newLevel > maxLevel){
                newLevel = maxLevel;
                console.log('Info: no change, max level reached');
             }
        } else if( !objSelectedTile.isLand ){
            if(newLevel - 1 < 0) {
                newLevel = 0;
                tileData[objSelectedTile.xId][objSelectedTile.yId].isLand = 1;
                tileData[objSelectedTile.xId][objSelectedTile.yId].tileImgIndexOrg = 1;
            } else if (newLevel - 1 ===  0) {
                newLevel = 0;
            } else {
                newLevel -= 1;
            } 
        } else {
            console.log('Info: no change, max level reached');
        }

        tileData[objSelectedTile.xId][objSelectedTile.yId].level = newLevel;
    
        mapStateChanged = 1;   
    } else {
        console.log('Info: no tile selected');
    }
};