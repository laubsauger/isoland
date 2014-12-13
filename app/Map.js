/**
 * Holds tile data
 * @param {Number} edgeLength
 * @param {Array} [tileMap]
 * @constructor
 */
var Map = function(edgeLength, tileMap) {
    this.tiles = [];
    if(typeof edgeLength !== "number" || edgeLength <= 0) {
        throw new InvalidArgumentException(edgeLength, 'Map', 'create');
    }
    this.edgeLength = edgeLength;
    this.tileMap = tileMap || [[]];

    this._create();
};

Map.prototype = {
    /**
     * creates a 2d array of tiles, optionally based on passed tileMap
     * @private
     */
    _create: function() {
        for (var x=0; x<this.edgeLength; x++) {
            this.tiles[x] = [];

            for (var y=0; y<this.edgeLength; y++) {
                // create a level 0 tile if there is no data at the provided map indices
                if (typeof this.tileMap[x] !== "undefined" && typeof this.tileMap[x][y] !== "undefined") {
                    this.tiles[x][y] = this.tileMap[x][y];
                } else {
                    this.tiles[x][y] = new Tile(x, y, 0);
                }
            }
        }
    },
    /**
     * Returns tile object at the provided map indices
     * @param x
     * @param y
     * @returns {Tile}
     */
    getTileAt: function(x, y) {
        return this.tiles[x][y];
    }
};
