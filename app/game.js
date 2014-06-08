var Map = function(edgeLength) {
    this.tiles = [];
    if(edgeLength <= 0) {
        throw new InvalidArgumentException(edgeLength, 'Map', 'create');
    }
    this.edgeLength = edgeLength;

    this.create();
};

var Tile = function(x,y) {
    this.x = x;
    this.y = y;
};

var Viewport = function(mapTiles, edgeLength, offsetX, offsetY) {
    if(mapTiles.length <= 0) {
        throw new InvalidArgumentException(mapTiles, 'Viewport', 'create');
    }

    if(edgeLength <= 0) {
        throw new InvalidArgumentException(edgeLength, 'Viewport', 'create');
    }

    this.edgeLength = edgeLength;
    this.orientation = 0;
    this.tiles = [];

    this.offset = {
        x: offsetX || 0,
        y: offsetY || 0
    };

    this.create(mapTiles);
};

Viewport.prototype = {
    create: function(mapTiles) {
        for (var x=0; x<this.edgeLength; x++) {
            this.tiles[x] = [];

            for (var y=0; y<this.edgeLength; y++) {
                this.tiles[x][y] = mapTiles[x][y];
            }
        }
    },
    getTileAt: function(x,y) {
        return this.tiles[x][y];
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
    },
    getOrientation: function() {
        return this.orientation;
    }
};

Map.prototype = {
    create: function() {
        for (var x=0; x<this.edgeLength; x++) {
            this.tiles[x] = [];

            for (var y=0; y<this.edgeLength; y++) {
                this.tiles[x][y] = new Tile(x,y);
            }
        }
    },
    getTileAt: function(x,y) {
        return this.tiles[x][y];
    }
};

function InvalidArgumentException(value, object, method) {
    this.value = value;
    this.message = " - provided for " + object + '.' + method;
    this.toString = function() {
        return 'InvalidArgumentException: ' + this.value + this.message
    };
}