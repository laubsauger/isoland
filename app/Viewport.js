/**
 * Contains the handling of the currently visible part of the map
 * @param {Number} edgeLength
 * @param {Map} map
 * @param {Number} [offsetX] -optional
 * @param {Number} [offsetY] -optional
 * @constructor
 */
var Viewport = function(edgeLength, map, offsetX, offsetY) {
    if (edgeLength <= 0) {
        throw new InvalidArgumentException(edgeLength, 'Viewport', 'construct', 'edgeLength');
    }

    if (map instanceof Map === false) {
        throw new InvalidArgumentException(map, 'Viewport', 'construct', 'map');
    }

    if (offsetX && typeof offsetX !== "number" || offsetY && typeof offsetY !== "number") {
        throw new InvalidArgumentException([offsetX, offsetY], 'Viewport', 'construct', 'offsetX/offsetY');
    }

    this.edgeLength = edgeLength;
    this.orientation = 0;
    this.tiles = [];

    this.offset = {
        x: offsetX || 0,
        y: offsetY || 0
    };

    if (this.offset.x + edgeLength > map.edgeLength || this.offset.y + edgeLength > map.edgeLength) {
        throw new InvalidArgumentException([this.offset.x, this.offset.y], 'Viewport', 'construct', 'this.offset.x/y');
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
    /**
     * Get Tile object by its 2D grid coords/array indices
     * @todo: add function getTileAtGridIndex({x: x,y: y}) that takes a position object - which every tile object should use instead of this.x this.y
     * @param x
     * @param y
     * @returns {Tile}
     */
    getTileAt: function(x,y) {
        return (this.tiles[x] && this.tiles[x][y]) ? this.tiles[x][y] : null;
    },
    /**
     * Performs clockwise arrayRotate on the tile array
     */
    rotateClockwise: function() {
        if ((this.orientation + 90) >= 360) {
            this.orientation = 0;
        } else {
            this.orientation += 90;
        }

        this.tiles = arrayRotate('r', this.tiles);
    },
    /**
     * Performs counterclockwise arrayRotate on the tile array
     */
    rotateCounterClockwise: function() {
        if ((this.orientation - 90) <= -360) {
            this.orientation = 0;
        } else {
            this.orientation -= 90;
        }

        this.tiles = arrayRotate('l', this.tiles);
    },
    /**
     * Return current Viewport orientation
     * @returns {number}
     */
    getOrientation: function() {
        return this.orientation;
    }
};
