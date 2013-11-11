"use strict"
//game
document.write('<script type="text/javascript" src="js/controls.js"></script>');
document.write('<script type="text/javascript" src="js/render.js"></script>');
document.write('<script type="text/javascript" src="js/CityModel.js"></script>');
document.write('<script type="text/javascript" src="js/terrainGeneration.js"></script>');

//utils
document.write('<script type="text/javascript" src="js/RequestAnimationFrame.js"></script>');
document.write('<script type="text/javascript" src="js/Stats.js"></script>');
document.write('<script type="text/javascript" src="js/cloneObj.js"></script>');
// document.write('<script type="text/javascript" src="js/RGBAColor.js"></script>');


var canvas,
    ctx,
    loaded = 0,
    loadTimer,
    tileData = new Array(),
    tilesInViewData = new Array(),
    CHEIGHT,
    CWIDTH,
    ctxMap,
    mapCanvas;

// Set as your tile pixel sizes, alter if you are using larger tiles.
var tileH = 15;
var tileW = 30;

// mapX and mapY are offsets to make sure we can position the map as we want.
var mapXOffset = 490;
var mapYOffset = 45;

//max height level
var maxLevel = 4;

// height increment
var level_step = tileH/2;

// var tileDict      = Array("img/default_water.png", "img/default_grass.png");

var tileColorDict = ['#4974da', '#1ac131', '#FF2424', '#FFFF91']; //water, grass, hover, selected
var sideColorDict = ['#001C9D', '#B75B00', '#FF2424', '#FFFF91']; //water, grass, hover, selected
var tileImg       = new Array();


var mapData, unitSize, mapDimension, mapData, mapType, movedDir;

var ymouse;
var xmouse;

var blockCount;
var xTile;
var yTile;
var offBlocksArray;

var viewDimension = 256;

var firstFrame = 1;
var mapStateChanged = 0;
var newFocus = 0;
var newMapGenerated = 0;
var mapXoff = 0,mapYoff = 0;

var clogOnce = 0;

var lastFocusedTileX = -1;
var lastFocusedTileY = -1;

var objSelectedTile;
var objFocusedTile;

function init() {
    mapCanvas         = document.getElementById('terrainCanvas'); //minimapcanvas + initial heightmap generation
    ctxMap            = mapCanvas.getContext("2d");
    canvas            = document.getElementById("gameCanvas");  //actual game canvas
    ctx               = canvas.getContext("2d");
    CHEIGHT           = canvas.height;
    CWIDTH            = canvas.width;

    //get GUI DOM Elements
    var buttonRotateLeft     = document.getElementById("rotateLeft");
    var buttonRotateRight    = document.getElementById("rotateRight");
    var buttonFlattenTerrain = document.getElementById("flattenTerrain");
    var buttonRiseTerrain    = document.getElementById("riseTerrain");
    var buttonMoveSouth      = document.getElementById("moveSouth");
    var buttonMoveNorth      = document.getElementById("moveNorth");
    var buttonMoveWest      = document.getElementById("moveWest");
    var buttonMoveEast      = document.getElementById("moveEast");

    //events - mouse
    canvas.addEventListener("mousedown", mouseClick, false);
    canvas.addEventListener("mousemove", mouseCheck, false);

    //event - hud
    buttonRotateLeft.addEventListener("mousedown", clickbuttonRotateLeft, false);
    buttonRotateRight.addEventListener("mousedown", clickbuttonRotateRight, false);
    
    buttonFlattenTerrain.addEventListener("mousedown", clickbuttonFlattenTerrain, false);
    buttonRiseTerrain.addEventListener("mousedown", clickbuttonRiseTerrain, false);

    buttonMoveSouth.addEventListener("mousedown", clickbuttonMoveSouth, false);
    buttonMoveNorth.addEventListener("mousedown", clickbuttonMoveNorth, false);
    buttonMoveWest.addEventListener("mousedown", clickbuttonMoveWest, false);
    buttonMoveEast.addEventListener("mousedown", clickbuttonMoveEast, false);
    //load images and set preload checking intervall
        // loadImg();
        // loadTimer = setInterval(gameLoaded,10);
    terrainGeneration();
    gameLoaded();
}

// function loadImg() {
//     for(var i=0;i<tileColorDict.length;i++) {
//         // tileImg[i] = new Image();
//         // tileImg[i].src = tileColorDict[i];
//         // tileImg[i].onload = function() {
//             loaded++;
//         // }
//     }
// }

function gameLoaded() {
    // if(loaded == tileColorDict.length) {
        clearInterval(loadTimer);  

        /* mrdoobs Stats*/
            var stats = new Stats();
            // Align top-left
            stats.getDomElement().style.position = 'absolute';
            stats.getDomElement().style.left = '0px';
            stats.getDomElement().style.bottom = '0px';
            document.body.appendChild( stats.getDomElement() );
            setInterval( function () {
                stats.update();
            }, 1000 / 60 );
        /*mrdoobs Stats End */      

        //fetch heightmap array and build tile array
        populateMapArray();

        //draw offscreen tiles, 1 for every possible iteration (level, color, ...) 
        offBlocksArray = getOffScreenTiles();

        //start gameLoop
        gameUpdate();
    // }
}


//GAME LOOP
function gameUpdate() {
    //call Drawing funcs
    draw();

    //loop
    requestAnimationFrame(gameUpdate);
}

//DRAW FUNCTION CALLED BY GAME LOOP EVERY FRAME
function draw() {
    //check if wee need to draw the map 
    if(mapStateChanged || firstFrame) { 
        // clear whole canvas every frame <<-- could be drastically improved i guess
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(newMapGenerated) {
            //fetch new heightmap array and build tile array
            populateMapArray();
            newMapGenerated = 0;
        }

        //if(mapRotate) {
            
        //}

        //fetch offscreen canvas and draw onscreen
        ctx.drawImage(renderToCanvas(CWIDTH, CHEIGHT, drawOffScreenMap), 0, 0);

        //reset switch
        if(firstFrame){firstFrame = 0;}
        if(mapStateChanged){mapStateChanged = 0;}
    }


    if(movedDir || firstFrame) {
        switch(movedDir) 
        {
            case 'n':
                mapXoff--;
                mapYoff--;
                break;
            case 'e':
                mapXoff++;
                mapYoff--;
                break;
            case 'w':
                mapXoff--;
                mapYoff++;
                break;
            case 's':
                mapXoff++;
                mapYoff++;
                break;
            default:
                break;
        }

        //crazy minimap rectangle to see where on earth we are
        ctxMap.clearRect(0,0, mapCanvas.width, mapCanvas.height);
        drawMap(mapDimension, "terrainCanvas", mapData, mapType);
    }


    movedDir = 0;
    var miniMapRectSize = 64;
    ctxMap.strokeStyle  = "rgba(250,0,0,0.9)";
    ctxMap.strokeRect (mapXoff, mapYoff, miniMapRectSize, miniMapRectSize);

    mouseRollOver();
}