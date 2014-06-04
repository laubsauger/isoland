var Map = function() {
    this.tiles = [];
    this.orientation = 0;
};

var Tile = function(x,y) {
    this.x = x;
    this.y = y;
};

//var Viewport = function() {
//    this.tiles = [];
//}

//Viewport.prototype = {
//    setTiles: function(tiles) {
//        this.tiles = tiles;
//    }
//}

Map.prototype = {
    create: function(edgeLength) {
        this.edgeLength = edgeLength;

        for (var x=0; x<this.edgeLength; x++) {
            this.tiles[x] = [];

            for (var y=0; y<this.edgeLength; y++) {
                this.tiles[x][y] = new Tile(x,y);
            }
        }
    },
    getTileAt: function(x,y) {
        return this.tiles[x][y];
    },
    getOrientation: function() {
        return this.orientation;
    },
    rotateClockwise: function() {
        if ((this.orientation + 90) >= 360) {
            this.orientation = 0;
        } else {
            this.orientation += 90;
        }

        this.tiles = arrayRotate('r', this.tiles);
    },
    rotateCounterClockwise: function() {
        if ((this.orientation - 90) <= -360) {
            this.orientation = 0;
        } else {
            this.orientation -= 90;
        }

        this.tiles = arrayRotate('l', this.tiles);
    }
};