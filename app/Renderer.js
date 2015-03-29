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
                fillTopBase: '#7777FF',
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

        this.offset = this.config.offset;

        return this;
    },
    /**
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
        this._drawIsoTile({x: 0, y: 3}, new Tile(0,0,0));
        this._drawIsoTile({x: 1, y: 2}, new Tile(0,0,1));
        this._drawIsoTile({x: 2, y: 1}, new Tile(0,0,2));
        this._drawIsoTile({x: 3, y: 0}, new Tile(0,0,3));
        this._drawIsoTile({x: 4, y: -1}, new Tile(0,0,4));

        // One raised tile surrounded by tiles one level deeper
        // -- sloped
        // 0 0 0
        // 0 1 0
        // 0 0 0
            this._drawIsoTile({x: 4, y: -5}, new Tile(0,0,1, new TileElevateParam(0,0,1,0)));
            this._drawIsoTile({x: 4, y: -4}, new Tile(0,0,1, new TileElevateParam(0,1,1,0)));
            this._drawIsoTile({x: 4, y: -3}, new Tile(0,0,1, new TileElevateParam(0,1,0,0)));
            this._drawIsoTile({x: 5, y: -5}, new Tile(0,0,1, new TileElevateParam(0,0,1,1)));

            // raised, influences all tiles around to line up
            this._drawIsoTile({x: 5, y: -4}, new Tile(0,0,2, new TileElevateParam(0,0,0,0)));

            this._drawIsoTile({x: 5, y: -3}, new Tile(0,0,1, new TileElevateParam(1,1,0,0)));
            this._drawIsoTile({x: 6, y: -5}, new Tile(0,0,1, new TileElevateParam(0,0,0,1)));
            this._drawIsoTile({x: 6, y: -4}, new Tile(0,0,1, new TileElevateParam(1,0,0,1)));
            this._drawIsoTile({x: 6, y: -3}, new Tile(0,0,1, new TileElevateParam(1,0,0,0)));

        // One lowered tile surrounded by tiles one level higher
        // -- sloped
        // 1 1 1
        // 1 0 1
        // 1 1 1
            this._drawIsoTile({x: 7, y: -5}, new Tile(0,0,1, new TileElevateParam(0,0,-1,0)));
            this._drawIsoTile({x: 7, y: -4}, new Tile(0,0,1, new TileElevateParam(0,-1,-1,0)));
            this._drawIsoTile({x: 7, y: -3}, new Tile(0,0,1, new TileElevateParam(0,-1,0,0)));
            this._drawIsoTile({x: 8, y: -5}, new Tile(0,0,1, new TileElevateParam(0,0,-1,-1)));

            // lowered, influences all tiles around to line up
            this._drawIsoTile({x: 8, y: -4}, new Tile(0,0,0, new TileElevateParam(0,0,0,0)));

            this._drawIsoTile({x: 8, y: -3}, new Tile(0,0,1, new TileElevateParam(-1,-1,0,0)));
            this._drawIsoTile({x: 9, y: -5}, new Tile(0,0,1, new TileElevateParam(0,0,0,-1)));
            this._drawIsoTile({x: 9, y: -4}, new Tile(0,0,1, new TileElevateParam(-1,0,0,-1)));
            this._drawIsoTile({x: 9, y: -3}, new Tile(0,0,1, new TileElevateParam(-1,0,0,0)));
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
     * @param pos
     * @param {Tile} tile
     */
    _drawIsoTile: function(pos, tile) {
        var canvasPosition = fromGridToIso(pos.x, pos.y, this.tileHeight, this.tileWidth);

        // Draw frame for tiles above sea level only
        // @todo: Make this configurable (allow tiles below sea level to be rendered with frame according to their (negative) height)
        if (tile.level > 0) {
            //this._drawTileSides(canvasPosition, tile);
        }

        this._drawIsoTileTop(canvasPosition, tile);

        if (this.config.drawTileLabels) {
            var textPosition = {
                x: canvasPosition.x + this.offset.left + this.tileWidth/3,
                y: canvasPosition.y + this.offset.top + ((this.tileHeight / 1.7))
            };

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
            pos.y -= (this.tileHeight/2*tile.level);
        }

        var tileVertices = this._getTileVertices(pos, tile);

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
        //        x: tileVertices.left.x+this.tileHeight/2,
        //        y: tileVertices.left.y
        //    };
        //
        //    gradientStop = {
        //        x: tileVertices.top.x,
        //        y: tileVertices.top.y
        //    };
        //}

        //if (tile.elevate.top !== 0 && tile.elevate.left !== 0) {
        //    linearGradient1 = this.context.createLinearGradient(tileVertices.left.x+this.tileHeight/2, tileVertices.left.y, tileVertices.top.x, tileVertices.top.y);
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
            this.context.moveTo(tileVertices.left.x, tileVertices.left.y);
            this.context.lineTo(tileVertices.top.x, tileVertices.top.y);
            this.context.lineTo(tileVertices.right.x, tileVertices.right.y);
            this.context.lineTo(tileVertices.bottom.x, tileVertices.bottom.y);

        this.context.fill();
        this.context.stroke();
        this.context.closePath();
    },
    /**
     * draws the tile frame for each height level at the given position - based on isometric coordinates
     * @todo add a config option to switch between sloped and non-sloped terrain -> sloped doesn't need tile sides IN MOST SITUATIONS (e.g. tiles should always have 'meat' underneath them near to the edge of the map) because all tiles fit seamlessly anyway
     * @todo >>> exception: if the viewport will stay like it is (cutoff at the edges) this should stay to give a sense of 'thickness' to the terrain
     * @param pos
     * @param {Tile} tile
     */
    _drawTileSides: function(pos, tile) {
        var tileHeightLevelOffset = (pos.y - (this.tileHeight/2 * (tile.level-1))) + this.offset.top;

        // @todo: extract base position calculations to calling function so we don't do them twice (top drawing + sides drawing) see _drawIsoTileTop
        var offsetPos = {
                x: (pos.x + this.tileWidth/2) + this.offset.left,
                y: (pos.y + this.tileHeight/2) + this.offset.top
            },
            fullOffsetPos = {
                x: pos.x + this.tileWidth + this.offset.left,
                y: pos.y + this.tileHeight + this.offset.top
            };

        // @todo: clear the haze with the magic of a vertices object as in _drawIsoTileTop @ 174 ff -- and see TODO above :D
        this.context.lineWidth = 1;
        // right side
        this.context.fillStyle = "#00FF00";
        this.context.strokeStyle = '#000';
        this.context.beginPath();
            this.context.moveTo(offsetPos.x, fullOffsetPos.y);
            this.context.lineTo(fullOffsetPos.x, offsetPos.y);
            this.context.lineTo(fullOffsetPos.x, tileHeightLevelOffset);
            this.context.lineTo(offsetPos.x, tileHeightLevelOffset + this.tileHeight/2);
            this.context.fill();
            this.context.stroke();
        this.context.closePath();

        // left side
        this.context.fillStyle = "#00AA00";
        this.context.strokeStyle = '#000';
        this.context.beginPath();
            this.context.moveTo(pos.x + this.offset.left, tileHeightLevelOffset);
            this.context.lineTo(pos.x + this.offset.left, offsetPos.y);
            this.context.lineTo(offsetPos.x, fullOffsetPos.y);
            this.context.lineTo(offsetPos.x, tileHeightLevelOffset + this.tileHeight/2);
            this.context.lineTo(pos.x + this.offset.left, tileHeightLevelOffset);
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
    _getTileVertices: function(pos, tile) {
        var offsetPos = new Pos((pos.x + this.tileWidth/2) + this.offset.left, (pos.y + this.tileHeight/2) + this.offset.top),
            fullOffsetPos = new Pos(pos.x + this.tileWidth + this.offset.left, pos.y + this.tileHeight + this.offset.top);

        var tileVertices = new TileVertices(
            new Pos(offsetPos.x, pos.y + this.offset.top),
            new Pos(fullOffsetPos.x, offsetPos.y),
            new Pos(offsetPos.x, fullOffsetPos.y),
            new Pos(pos.x + this.offset.left, offsetPos.y)
        );

        return this._adjustVertexPositionByTileElevationSetting(tileVertices, tile.elevate);
    },
    /**
     * Lowers or raises each vertex depending on the tiles current elevateParam
     * @param tileVertices
     * @param {TileElevateParam} elevateParam
     * @private
     */
    _adjustVertexPositionByTileElevationSetting: function(tileVertices, elevateParam) {
        // pull corners/vertices up or down if necessary
        if(elevateParam.top > 0) {
            tileVertices.top.y -= this.tileHeight/2;
        } else if(elevateParam.top < 0) {
            tileVertices.top.y += this.tileHeight/2;
        }

        if(elevateParam.right > 0) {
            tileVertices.right.y -= this.tileHeight/2;
        } else if(elevateParam.right < 0) {
            tileVertices.right.y += this.tileHeight/2;
        }

        if(elevateParam.bottom > 0) {
            tileVertices.bottom.y -= this.tileHeight/2;
        } else if(elevateParam.bottom < 0) {
            tileVertices.bottom.y += this.tileHeight/2;
        }

        if(elevateParam.left > 0) {
            tileVertices.left.y -= this.tileHeight/2;
        } else if(elevateParam.left < 0) {
            tileVertices.left.y += this.tileHeight/2;
        }

        return tileVertices;
    }
};
