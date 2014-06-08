/**
 * Holds tile data
 * @param {Integer} edgeLength
 * @constructor
 */
var Map = function(edgeLength) {
    this.tiles = [];
    if(edgeLength <= 0) {
        throw new InvalidArgumentException(edgeLength, 'Map', 'create');
    }
    this.edgeLength = edgeLength;

    this.create();
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