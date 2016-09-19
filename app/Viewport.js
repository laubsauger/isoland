/**
 * Contains the handling of the currently visible part of the map
 * @param {Number} edgeLength
 * @param {Map} map
 * @constructor
 */
var Viewport = function(edgeLength, map) {
    if (edgeLength <= 0) {
        throw new InvalidArgumentException(edgeLength, 'Viewport', 'construct', 'edgeLength');
    }

    if (map instanceof Map === false) {
        throw new InvalidArgumentException(map, 'Viewport', 'construct', 'map');
    }

    this.hoveredTile = {};
    this.hoveredTile = {};
    this.selectedTiles = [];
    this.edgeLength = edgeLength;
    this.orientation = 0;
    this.orientationChangeDirection = false;
    this.orientationChanged = false;
    this.tiles = [];
    this.map = map;
};

Viewport.prototype = {
    /**
     * grabs a portion of the map array
     * @param {Number} offsetX
     * @param {Number} offsetY
     */
    init: function(offsetX, offsetY) {
        this.offset = this._createNewOffsetPosition(offsetX,offsetY);
        this.tiles = this.getTilesInViewFromMap(this.offset);
    },

    /**
     * @param {Number} offsetX
     * @param {Number} offsetY
     */
    _createNewOffsetPosition: function(offsetX, offsetY) {
        if (offsetX && typeof offsetX !== "number" || offsetY && typeof offsetY !== "number") {
            throw new InvalidArgumentException([offsetX, offsetY], 'Viewport', 'construct', 'offsetX/offsetY');
        }

        if (offsetX + this.edgeLength > this.map.edgeLength || offsetY + this.edgeLength > this.map.edgeLength) {
            throw new InvalidArgumentException([offsetX, offsetY], 'Viewport', 'setOffset', 'offsetX/offsetY');
        }

        return new Pos(offsetX, offsetY);
    },

    /**
     * @param {Pos} offsetPos
     * @returns {Array}
     */
    getTilesInViewFromMap: function(offsetPos) {
        var tiles = [];

        for (var x=0; x<this.edgeLength; x++) {
            tiles[x] = [];

            for (var y=0; y<this.edgeLength; y++) {
                tiles[x][y] = this.map.getTileAt(new Pos(x + offsetPos.x, y + offsetPos.y));
            }
        }

        return tiles;
    },

    /**
     *
     * @param inputHandler
     */
    update: function(inputHandler) {
        this._updateWithInputHandlerChanges(inputHandler);
    },
    /**
     *
     * @param inputHandler
     * @private
     */
    _updateWithInputHandlerChanges: function(inputHandler) {
        if (inputHandler.viewportOrientationChangeDirection) {
            this.rotate(inputHandler.viewportOrientationChangeDirection);
            inputHandler.viewportOrientationChangeDirection = false;
        }

        if (inputHandler.selectedTilePos) {
            this.setSelectedTile(inputHandler.selectedTilePos, inputHandler.activeKeys.shift);
            inputHandler.selectedTilePos = false;
        }

        if (inputHandler.hoveredTilePos) {
            this.setHoveredTile(inputHandler.hoveredTilePos);
        }

        inputHandler.cleanup();
    },
    /**
     * Get Tile object by its 2D grid coords/array indices
     * @param {Pos} pos
     * @returns Tile|{}
     */
    //@todo figure out a way to perform visibility checks (z-buffer style) to prevent interaction with tiles that are hidden behind/below others
    getTileAt: function(pos) {
        return (this.tiles[pos.x] && this.tiles[pos.x][pos.y]) ? this.tiles[pos.x][pos.y] : null;
    },
    /**
     *
     * @param {string} direction
     */
    rotate: function(direction) {
        if ('ccw' === direction) {
            this.rotateCounterClockwise();
        } else {
            this.rotateClockwise();
        }

        this.orientationChanged = true;
        this.orientationChangeDirection = direction;
    },
    /**
     * clockwise arrayRotate the tile array
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
    * counterclockwise arrayRotate the tile array
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
    },
    /**
     * @param {Pos} selectedTilePos
     * @param {boolean} shiftKeyActive
     */
    setSelectedTile: function(selectedTilePos, shiftKeyActive) {
        if (!shiftKeyActive) {
            this.clearSelection();
        }

        this.addToSelection(this.getTileAt(selectedTilePos));
    },
    /**
     * @param {Pos} hoveredTilePos
     */
    setHoveredTile: function(hoveredTilePos) {
        var tile = this.getTileAt(hoveredTilePos);

        if (tile instanceof Tile) {
            this.hoveredTile = tile;
            this.hoveredTile.hovered = true;
        }
    },
    /**
     * @param tile
     */
    addToSelection: function(tile) {
        if (tile instanceof Tile && this.selectedTiles.indexOf(tile) === -1) {
            tile.selected = true;
            this.selectedTiles.push(tile);
            console.log('selected', tile);
        }
    },

    clearSelection: function() {
        this.selectedTiles.forEach(function(tile) {
            tile.selected = false;
        });
        this.selectedTiles = [];
    },

    /**
     * perform cleanup operations
     */
    cleanup: function() {
        if (this.hoveredTile) {
            this.hoveredTile.hovered = false;
        }

        this.orientationChangeDirection = false;
        this.orientationChanged = false;
    },

    hasOrientationChanged: function() {
        return this.orientationChanged;
    }
};
