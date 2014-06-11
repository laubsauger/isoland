/**
 * Contains the handling of the currently visible part of the map
 * @param {Object} map
 * @param {Integer} edgeLength
 * @param {Integer} [offsetX] -optional
 * @param {Integer} [offsetY] -optional
 * @constructor
 */
var Viewport = function(map, edgeLength, offsetX, offsetY) {
    if (edgeLength <= 0) {
        throw new InvalidArgumentException(edgeLength, 'Viewport', '');
    }

    if (map instanceof Map === false) {
        throw new InvalidArgumentException(map, 'Viewport', '');
    }

    this.edgeLength = edgeLength;
    this.orientation = 0;
    this.tiles = [];

    this.offset = {
        x: offsetX || 0,
        y: offsetY || 0.
    };

    if (this.offset.x + edgeLength > map.edgeLength || this.offset.y + edgeLength > map.edgeLength) {
        throw new InvalidArgumentException([this.offset.x, this.offset.y], 'Viewport', '');
    }

    this._create(map);
};

Viewport.prototype = {
    /**
     * grabs a portion of the map array
     * @param {Object} map
     * @private
     */
    _create: function(map) {
        for (var x=0; x<this.edgeLength; x++) {
            this.tiles[x] = [];

            for (var y=0; y<this.edgeLength; y++) {
                this.tiles[x][y] = map.getTileAt(x + this.offset.x, y + this.offset.y);
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
