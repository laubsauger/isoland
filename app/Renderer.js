/**
 *
 * @param {Object} $canvas DomElement
 * @param {Object} config
 * @param {ColorLuminance} colorLuminance
 * @constructor
 */
var Renderer = function($canvas, config, colorLuminance) {
    this.context = $canvas.getContext("2d");
    this.width = $canvas.width;
    this.height = $canvas.height;
    this.supportedRenderModes = ["iso", "2d", "test"];

    this.colorLuminance = colorLuminance;

    this.context.translate(0.5, 0.5);

    this.configure(config);
};

Renderer.prototype = {
    /**
     * @param {Object} config
     * @returns {Renderer}
     */
    configure: function(config) {
        this.config = {
            drawTileLabels: config.drawTileLabels || true,
            tileWidth: config.tileWidth,
            tileHeight: config.tileHeight,
            offset: config.offset,
            renderMode: config.renderMode,
            zoomLevel: config.zoomLevel,
            tileColors: {
                fillTopBase: '#5f5fcc',
                fillLeftBase: '#00AA00',
                fillRightBase: '#00FF00',
                lightenByLevelMultiplier: 0.2
            }
        };

        if (this.supportedRenderModes.indexOf(this.config.renderMode) === -1) {
            throw new InvalidArgumentException("Unknown render mode: " + this.config.renderMode);
        }

        this.tileWidth = this.config.tileWidth;
        this.tileHeight = this.config.tileHeight;

        if (this.config.renderMode === "iso" || this.config.renderMode === "test") {
            this.tileHeight = this.tileHeight/2;
        }

        this.tileHeightHalf = this.tileHeight/2;

        this.offset = this.config.offset;

        return this;
    },
    /**
     * Iterates over all tiles in viewport and draws them to canvas
     * @param {Viewport} viewport
     */
    execute: function(viewport) {
        this.context.clearRect(0, 0, this.height, this.width);

        if (this.config.renderMode === "test") {
            this._drawTestTiles();
            return;
        }

        for (var x=0; x<viewport.edgeLength; x++) {
            for (var y=0; y<viewport.edgeLength; y++) {
                var tile = viewport.getTileAt(x, y);

                if (tile instanceof Tile) {
                    this._drawTile({x: x, y: y}, tile);
                }
            }
        }
    },
    /**
     * Draw Test Tiles in a horizontal line
     * @todo add json file loader
     */
    _drawTestTiles: function() {
        var maxLevel = 8,
            tileElevateParamCollection = [
                new TileElevateParam(0, 0, 0, 0),
                new TileElevateParam(0, 0, 0, 1),
                new TileElevateParam(0, 0, 1, 0),
                new TileElevateParam(0, 0, 1, 1),
                new TileElevateParam(0, 1, 0, 0),
                new TileElevateParam(0, 1, 0, 1),
                new TileElevateParam(0, 1, 1, 0),
                new TileElevateParam(0, 1, 1, 1),
                new TileElevateParam(1, 0, 0, 0),
                new TileElevateParam(1, 0, 0, 1),
                new TileElevateParam(1, 0, 1, 0),
                new TileElevateParam(1, 0, 1, 1),
                new TileElevateParam(1, 1, 0, 0),
                new TileElevateParam(1, 1, 0, 1),
                new TileElevateParam(1, 1, 1, 0)
            ],
            startOffset = new Pos(-5, -1);

        for(var i=0; i < tileElevateParamCollection.length; i++) {
            for(var x=0; x < maxLevel; x++) {
                console.log(startOffset, tileElevateParamCollection[i]);
                this._drawIsoTile(startOffset, new Tile(startOffset.x++, startOffset.y--, x, tileElevateParamCollection[i]));
            }
            startOffset.y += maxLevel*2;
        }
    },
    /**
     * handles tile drawing using different draw modes
     * @param pos
     * @param {Tile} tile
     */
    _drawTile: function(pos, tile) {
        if (this.config.renderMode === "iso") {
            this._drawIsoTile(pos, tile);
        } else if (this.config.renderMode === "2d") {
            this._draw2DTile(pos, tile);
        }
    },
    /**
     * draws a tile in iso mode
     * @param {Pos} pos
     * @param {Tile} tile
     */
    _drawIsoTile: function(pos, tile) {
        var canvasPosition = fromGridIndexToIsoPos(pos, this.tileHeight, this.tileWidth);

        // Draw frame for tiles above sea level only
        // @todo: Make this configurable (allow tiles below sea level to be rendered with frame according to their (negative) height)
        if (tile.level > 0) {
            this._drawTileSides(canvasPosition, tile);
        }

        this._drawIsoTileTop(canvasPosition, tile);

        if (this.config.drawTileLabels) {
            var textPosition = new Pos(
                canvasPosition.x + this.offset.left + this.tileWidth/4,
                canvasPosition.y + this.offset.top + ((this.tileHeight / 1.7))
            );

            this._drawTileLabel(pos.x + "," + pos.y, "#000000", textPosition);
        }
    },
    /**
     * draws top tile at the given position and level
     * @param pos
     * @param {Tile} tile
     */
    _drawIsoTileTop: function (pos, tile) {
        // adjust height according to level
        // @todo: allow negative values
        if(tile.level > 0) {
            pos.y -= ((this.tileHeight/2)*tile.level);
        }

        var tileTopVertices = this._getTileTopVertices(pos, tile);

        var gradient;

        this.context.lineWidth = .5;
        this.context.fillStyle = this._getTileTopFillStyle(tile);

        // right corner
        //var linearGradient1 = this.context.createLinearGradient(tileVertices.left.x, tileVertices.left.y, tileVertices.right.x, tileVertices.right.y);
        // left corner
        //var linearGradient1 = this.context.createLinearGradient(tileVertices.right.x, tileVertices.right.y, tileVertices.left.x, tileVertices.left.y);

        var gradientStart = false,
            gradientStop = false;

        //if (tile.elevate.top !== 0) {
        //    gradientStart = {
        //        x: tileVertices.bottom.x,
        //        y: tileVertices.bottom.y
        //    };
        //
        //    gradientStop = {
        //        x: tileVertices.top.x,
        //        y: tileVertices.top.y
        //    };
        //}
        //
        //if (tile.elevate.bottom !== 0) {
        //    gradientStart = {
        //        x: tileVertices.top.x,
        //        y: tileVertices.top.y
        //    };
        //
        //    gradientStop = {
        //        x: tileVertices.bottom.x,
        //        y: tileVertices.bottom.y
        //    };
        //}

        //if (tile.elevate.top !== 0 && tile.elevate.right !== 0) {
        //    gradientStart = {
        //        x: tileVertices.left.x+this.tileHeightHalf,
        //        y: tileVertices.left.y
        //    };
        //
        //    gradientStop = {
        //        x: tileVertices.top.x,
        //        y: tileVertices.top.y
        //    };
        //}

        //if (tile.elevate.top !== 0 && tile.elevate.left !== 0) {
        //    linearGradient1 = this.context.createLinearGradient(tileVertices.left.x+this.tileHeightHalf, tileVertices.left.y, tileVertices.top.x, tileVertices.top.y);
        //}

        if (gradientStart !== false && gradientStop !== false) {
            var linearGradient = this.context.createLinearGradient(gradientStart.x, gradientStart.y, gradientStop.x, gradientStop.y);
            linearGradient.addColorStop(0, 'red');
            linearGradient.addColorStop(0.35, 'red');
            linearGradient.addColorStop(0.35, 'yellow');
            linearGradient.addColorStop(1, 'yellow');
            this.context.fillStyle = linearGradient;
        }

        this.context.strokeStyle = "#000";
        this.context.beginPath();
            this.context.moveTo(tileTopVertices.left.x, tileTopVertices.left.y);
            this.context.lineTo(tileTopVertices.top.x, tileTopVertices.top.y);
            this.context.lineTo(tileTopVertices.right.x, tileTopVertices.right.y);
            this.context.lineTo(tileTopVertices.bottom.x, tileTopVertices.bottom.y);

        this.context.fill();
        this.context.stroke();
        this.context.closePath();
    },
    /**
     * draws the tile frame for each height level at the given position - based on isometric coordinates
     * @param pos
     * @param {Tile} tile
     */
    _drawTileSides: function(pos, tile) {
        var tileHeightLevelOffset = (pos.y - (this.tileHeightHalf * (tile.level-1))) + this.offset.top;

        // @todo: call tileTopVertices only once and make the return value accessable by _drawTileSides and _drawTileTop
        var tileTopVertices = this._getTileTopVertices(pos, tile),
            tileRightSideVertices = this._getTileRightSideVertices(tileTopVertices, tileHeightLevelOffset, tile),
            tileLeftSideVertices = this._getTileLeftSideVertices(tileTopVertices, tileHeightLevelOffset, tile);

        this.context.lineWidth = 1;

        // right side
        this.context.fillStyle = this.config.tileColors.fillRightBase;
        this.context.strokeStyle = '#000';
        this.context.beginPath();
            this.context.moveTo(tileRightSideVertices.bottomLeft.x, tileRightSideVertices.bottomLeft.y);
            this.context.lineTo(tileRightSideVertices.bottomRight.x, tileRightSideVertices.bottomRight.y);
            this.context.lineTo(tileRightSideVertices.topRight.x, tileRightSideVertices.topRight.y);
            this.context.lineTo(tileRightSideVertices.topLeft.x, tileRightSideVertices.topLeft.y);
            this.context.fill();
            this.context.stroke();
        this.context.closePath();

        // left side
        this.context.fillStyle = this.config.tileColors.fillLeftBase;
        this.context.strokeStyle = '#000';
        this.context.beginPath();
            this.context.moveTo(tileLeftSideVertices.topLeft.x, tileLeftSideVertices.topLeft.y);
            this.context.lineTo(tileLeftSideVertices.bottomLeft.x, tileLeftSideVertices.bottomLeft.y);
            this.context.lineTo(tileLeftSideVertices.bottomRight.x, tileLeftSideVertices.bottomRight.y);
            this.context.lineTo(tileLeftSideVertices.topRight.x, tileLeftSideVertices.topRight.y);
            this.context.lineTo(tileLeftSideVertices.topLeft.x, tileLeftSideVertices.topLeft.y);
            this.context.fill();
            this.context.stroke();
        this.context.closePath();
    },
    /**
     * draws a 2d tile at the given position
     * @param {Object} pos
     * @param {Tile} tile
     * @private
     */
    _draw2DTile: function(pos, tile) {
        var width = this.tileWidth / this.config.zoomLevel;
        var height = this.tileHeight / this.config.zoomLevel;

        var canvasPosition = {x: pos.x * width, y: pos.y * height};
        this._draw2DTileTop(canvasPosition, width, height, tile);

        if (this.config.drawTileLabels) {
            var textPosition = {
                x: canvasPosition.x + this.offset.left + (height / 4),
                y: (parseInt(canvasPosition.y) + this.offset.top) + (height / 2)
            };

            this._drawTileLabel(pos.x + "," + pos.y, "#000000", textPosition);
        }
    },
    /**
     * draws the 2d top tile for a given position
     * @param {Object} pos
     * @param {Number} width
     * @param {Number} height
     * @param {Tile} tile
     * @private
     */
    _draw2DTileTop: function(pos, width, height, tile) {
        this.context.lineWidth = 1;
        this.context.fillStyle = this._getTileTopFillStyle(tile);
        this.context.strokeStyle = '#000';
        this.context.beginPath();
            this.context.moveTo(pos.x + this.offset.left, (pos.y+height) + this.offset.top);
            this.context.lineTo(pos.x + this.offset.left, pos.y + this.offset.top);
            this.context.lineTo(pos.x+width + this.offset.left, pos.y + this.offset.top);
            this.context.lineTo(pos.x+width  + this.offset.left, pos.y+height + this.offset.top);
            this.context.lineTo(pos.x + this.offset.left, (pos.y+height) + this.offset.top);
            this.context.fill();
            this.context.stroke();
        this.context.closePath();
    },
    /**
     * draws a text label at the given position
     * @param {String} text
     * @param {String} color
     * @param {Object} pos
     * @private
     */
    _drawTileLabel: function(text, color, pos) {
        this.context.font="10px Consolas";
        this.context.fillStyle = color;
        this.context.fillText(text, pos.x, pos.y);
    },
    /**
     * Returns fill style depending on tile state
     * @param {Tile} tile
     */
    _getTileTopFillStyle: function(tile) {
        if (tile.hasFocus) {
            return "#ff9802";
        }

        return this._getTileTopFillColor(tile);
    },
    /**
     * Calculates color based on tile level
     * @param {Tile} tile
     * @returns {string}
     * @private
     */
    _getTileTopFillColor: function(tile) {
        if (tile.level > 0) {
            return this.colorLuminance.calculate(this.config.tileColors.fillTopBase, this.config.tileColors.lightenByLevelMultiplier * tile.level);
        }

        return this.config.tileColors.fillTopBase;
    },
    /**
     * Returns an object containing a position object for each vertice of the tile
     * @parameter {Pos} pos
     * @parameter {Pos} pos
     * @private
     */
    _getTileTopVertices: function(pos, tile) {
        var offsetPos = new Pos((pos.x + this.tileWidth/2) + this.offset.left, (pos.y + this.tileHeightHalf) + this.offset.top),
            fullOffsetPos = new Pos(pos.x + this.tileWidth + this.offset.left, pos.y + this.tileHeight + this.offset.top);

        var tileVertices = new TileTopVertices(
            new Pos(offsetPos.x, pos.y + this.offset.top),
            new Pos(fullOffsetPos.x, offsetPos.y),
            new Pos(offsetPos.x, fullOffsetPos.y),
            new Pos(pos.x + this.offset.left, offsetPos.y)
        );

        return this._getTileVerticesModifiedByTileElevationParam(tileVertices, tile.elevate);
    },
    /**
     * @param tileTopVertices
     * @param tileHeightLevelOffset
     * @param {Tile} tile
     * @returns {TileRightSideVertices}
     * @private
     */
    _getTileRightSideVertices: function(tileTopVertices, tileHeightLevelOffset, tile) {
        var tileVertices = new TileRightSideVertices(
            new Pos(tileTopVertices.top.x, tileHeightLevelOffset + this.tileHeightHalf),
            new Pos(tileTopVertices.right.x, tileHeightLevelOffset),
            new Pos(tileTopVertices.right.x,  tileTopVertices.right.y),
            new Pos(tileTopVertices.bottom.x, tileTopVertices.bottom.y)
        );

        return this._getTileVerticesModifiedByTileElevationParam(tileVertices, tile.elevate);
    },
    /**
     * @param tileTopVertices
     * @param tileHeightLevelOffset
     * @param {Tile} tile
     * @returns {TileLeftSideVertices}
     * @private
     */
    _getTileLeftSideVertices: function(tileTopVertices, tileHeightLevelOffset, tile) {
        var tileVertices = new TileLeftSideVertices(
            new Pos(tileTopVertices.left.x, tileHeightLevelOffset),
            new Pos(tileTopVertices.top.x, tileHeightLevelOffset + this.tileHeightHalf),
            new Pos(tileTopVertices.bottom.x, tileTopVertices.bottom.y),
            new Pos(tileTopVertices.left.x, tileTopVertices.left.y)
        );

        return this._getTileVerticesModifiedByTileElevationParam(tileVertices, tile.elevate);
    },
    /**
     * Lowers or raises each vertex depending on the tiles current elevateParam
     * @param tileVertices
     * @param {TileElevateParam} elevateParam
     * @private
     */
    _getTileVerticesModifiedByTileElevationParam: function(tileVertices, elevateParam) {
        // pull corners/vertices up or down if necessary
        if(elevateParam.top > 0) {
            if (tileVertices instanceof TileTopVertices) {
                tileVertices.top.y -= this.tileHeightHalf;
            }
        } else if(elevateParam.top < 0) {
            if (tileVertices instanceof TileTopVertices) {
                tileVertices.top.y += this.tileHeightHalf;
            }
        }

        if(elevateParam.right > 0) {
            if (tileVertices instanceof TileTopVertices) {
                tileVertices.right.y -= this.tileHeightHalf;
            }

            if (tileVertices instanceof TileRightSideVertices) {
                tileVertices.topRight.y -= this.tileHeightHalf;
                tileVertices.bottomRight.y += this.tileHeightHalf;
            }
        } else if(elevateParam.right < 0) {
            if (tileVertices instanceof TileTopVertices) {
                tileVertices.right.y += this.tileHeightHalf;
            }

            if (tileVertices instanceof TileRightSideVertices) {
                tileVertices.topRight.y += this.tileHeightHalf;
            }
        }

        if(elevateParam.bottom > 0) {
            if (tileVertices instanceof TileTopVertices) {
                tileVertices.bottom.y -= this.tileHeightHalf;
            }

            if (tileVertices instanceof TileRightSideVertices) {
                tileVertices.topLeft.y -= this.tileHeightHalf;
                tileVertices.bottomLeft.y += this.tileHeightHalf;
            }

            if (tileVertices instanceof TileLeftSideVertices) {
                tileVertices.topRight.y -= this.tileHeightHalf;
                tileVertices.bottomRight.y += this.tileHeightHalf;
            }
        } else if(elevateParam.bottom < 0) {
            if (tileVertices instanceof TileTopVertices) {
                tileVertices.bottom.y += this.tileHeightHalf;
            }

            if (tileVertices instanceof TileRightSideVertices) {
                tileVertices.topLeft.y += this.tileHeightHalf;
                tileVertices.bottomRight.y += this.tileHeightHalf;
            }

            if (tileVertices instanceof TileLeftSideVertices) {
                tileVertices.topRight.y += this.tileHeightHalf;
                tileVertices.bottomLeft.y += this.tileHeightHalf;
            }
        }

        if(elevateParam.left > 0) {
            if (tileVertices instanceof TileTopVertices) {
                tileVertices.left.y -= this.tileHeightHalf;
            }

            if (tileVertices instanceof TileLeftSideVertices) {
                tileVertices.topLeft.y -= this.tileHeightHalf;
                tileVertices.bottomLeft.y += this.tileHeightHalf;
            }
        } else if(elevateParam.left < 0) {
            if (tileVertices instanceof TileTopVertices) {
                tileVertices.left.y += this.tileHeightHalf;
            }

            if (tileVertices instanceof TileLeftSideVertices) {
                tileVertices.topLeft.y += this.tileHeightHalf;
            }
        }

        return tileVertices;
    }
};
