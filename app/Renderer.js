/**
 *
 * @param {HTMLCanvasElement} $canvas
 * @param {Object} config
 * @param {ColorLuminance} colorLuminance
 * @param {HTMLCanvasElement} [offscreenCanvas]
 * @constructor
 */
var Renderer = function($canvas, config, colorLuminance, offscreenCanvas) {
    this.canvas = $canvas;
    this.context = this.canvas.getContext("2d");

    this.offscreenCanvas = offscreenCanvas ? offscreenCanvas : false;
    this.offscreenBufferContext = this.offscreenCanvas ? this.offscreenCanvas.getContext("2d") : false;

    // contains string representation of all possible combinations of elevated vertices
    this.bufferMap = [
        // positive
        '0,0,0,0',
        '1,0,0,0',
        '0,1,0,0',
        '0,0,1,0',

        '0,0,0,1',
        '1,1,0,0',
        '1,0,1,0',
        '1,0,0,1',

        '1,1,1,0',
        '1,1,0,1',
        '0,1,1,0',
        '0,1,0,1',

        '1,0,1,1',
        '0,0,1,1',
        '0,1,1,1',

        //negative
        '-1,0,0,0',
        '0,-1,0,0',
        '0,0,-1,0',

        '0,0,0,-1',
        '-1,-1,0,0',
        '-1,0,-1,0',
        '-1,0,0,-1',

        '-1,-1,-1,0',
        '-1,-1,0,-1',
        '0,-1,-1,0',
        '0,-1,0,-1',

        '-1,0,-1,-1',
        '0,0,-1,-1',
        '0,-1,-1,-1'
    ];

    this.supportedRenderModes = ["iso", "2d", "test", "offscreen"];

    this.colorLuminance = colorLuminance;

    //this.logonce = 0;

    this.configure(config);
};

Renderer.prototype = {
    /**
     * @param {Object} config
     * @returns {Renderer}
     */
    configure: function(config) {
        this.config = {
            drawTileLabels: config.drawTileLabels,
            tileWidth: config.tileWidth,
            tileHeight: config.tileHeight,
            offset: config.offset,
            renderMode: config.renderMode,
            zoomLevel: config.zoomLevel,
            tileColors: {
                fillTopBase: '#5F5FCC',
                fillTopSelected: '#E23131',
                fillTopHovered: '#FF9802',
                fillSideLeftBase: '#00AA00',
                fillSideRightBase: '#00FF00',
                lightenByLevelMultiplier: 0.2
            },
            canvasDim: config.canvasDim,
            maxLevel: config.maxLevel || 0
        };

        //@todo: abstract perspective dimension adjustments
        if (this.supportedRenderModes.indexOf(this.config.renderMode) === -1) {
            throw new InvalidArgumentException("Unknown render mode: " + this.config.renderMode);
        }

        if (this.config.renderMode === "iso" && !this.offscreenBufferContext) {
            throw new InvalidArgumentException("Render mode " + this.config.renderMode + " - needs offscreenBuffer");
        }

        this.tileWidth = this.config.tileWidth;
        this.tileHeight = this.config.tileHeight;

        if (this.config.renderMode === "iso" || this.config.renderMode === "test" || this.config.renderMode === "offscreen" ) {
            this.tileHeight = this.tileHeight/2;
        }

        if (this.config.renderMode !== "offscreen") {
            this.canvas.width = this.config.canvasDim.width;
            this.canvas.height = this.config.canvasDim.height;
        }

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // translate half pixel to avoid blurry lines
        if (this.config.renderMode !== "iso") {
            this.context.translate(0.5, 0.5);
        }

        this.tileHeightHalf = this.tileHeight/2;

        this.offset = this.config.offset;

        return this;
    },
    /**
     * @returns {*|CanvasRenderingContext2D}
     */
    getContext: function() {
        return this.context;
    },
    /**
     * @returns {*|HTMLCanvasElement}
     */
    getCanvas: function() {
        return this.canvas;
    },
    /**
     * Iterates over all tiles in viewport and draws them to canvas
     * @param {Viewport} [viewport]
     */
    execute: function(viewport) {
        this.context.clearRect(0, 0, this.height, this.width);

        if (this.config.renderMode === "offscreen" || this.config.renderMode === "test") {
            this._createOffscreenTileBuffer();
            return;
        }

        for (var x=0; x<viewport.edgeLength; x++) {
            for (var y=0; y<viewport.edgeLength; y++) {
                var tile = viewport.getTileAt(new Pos(x, y));

                if (tile instanceof Tile) {
                    this._drawTile(new Pos(x, y), tile);
                }
            }
        }
    },
    /**
     * draws all possible tile variations
     * @private
     */
    _createOffscreenTileBuffer: function() {
        var tileElevateParamCollection = [],
            self = this;

        var index = 0;
        for (var y = 0; y < this.bufferMap.length*2; y++) {
            var bufferMapItem = this.bufferMap[index].split(',');
            //console.log(bufferMapItem[0], bufferMapItem[1], bufferMapItem[2], bufferMapItem[3]);
            tileElevateParamCollection.push(new TileElevateParam(bufferMapItem[0], bufferMapItem[1], bufferMapItem[2], bufferMapItem[3]));

            index++;
            
            if (index >= this.bufferMap.length) {
                index = 0;
            }
        }

        var types = [
            {'name': 'default', 'startOffset': new Pos(-5, -1)},
            {'name': 'hover', 'startOffset': new Pos(3, -9)},
            {'name': 'selected', 'startOffset': new Pos(11, -17)}
        ];

        types.forEach(function(type) {
            var config = {
                'maxLevel': self.config.maxLevel,
                'type': type.name,
                'startOffset': type.startOffset
            };

            for (var i = 0; i < tileElevateParamCollection.length; i++) {
                self._drawIsoTileCollection(type.startOffset, config, tileElevateParamCollection[i]);
                // increment height offset by twice the maxheight
                type.startOffset.y += config.maxLevel * 2;
            }
        });
    },
    /**
     *
     * @param startOffset
     * @param config
     * @param elevateParam
     * @private
     */
    _drawIsoTileCollection: function(startOffset, config, elevateParam) {
        for(var x=0; x < config.maxLevel; x++) {
            var tile = new Tile(startOffset.x++, startOffset.y--, x, elevateParam);

            switch(config.type) {
                case 'hover':
                    tile.hovered = true;
                    break;
                case 'selected':
                    tile.selected = true;
                    break;
                default: break;
            }

            this._drawIsoTile(startOffset, tile);
        }
    },
    /**
     * handles tile drawing using different draw modes
     * @param {Pos} pos
     * @param {Tile} tile
     */
    _drawTile: function(pos, tile) {
        switch(this.config.renderMode) {
            case "iso":
                this._drawTileImageDataFromBuffer(pos, tile);
                break;
            case "2d":
                this._draw2DTile(pos, tile);
                break;
            case "test":
                this._drawIsoTile(pos, tile);
                break;
            default:
                throw new InvalidArgumentException('_drawTile: renderMode not found');
        }
    },
    /**
     * fetches a tile in iso mode from offscreenbuffer
     * @param {Pos} pos
     * @param {Tile} tile
     */
    _drawTileImageDataFromBuffer: function(pos, tile) {
        var bufferViewportDim = {width: this.tileWidth, height: 256},
            canvasPosition = fromGridIndexToIsoPos(pos, this.tileHeight, this.tileWidth),
            bufferMapIndex = this.bufferMap.indexOf(tile.elevate.toString());

        var elevationVariationSpacing = bufferMapIndex > 0 ? bufferViewportDim.height/2 : 0,
            bufferBaseOffset = new Pos((this.tileWidth * tile.level), bufferViewportDim.height * (bufferMapIndex + 1));

        if (tile.isHovered()) {
            bufferBaseOffset.x += (this.tileWidth * this.config.maxLevel);
        }

        // @todo: put this into a dedicated function to make it somewhat understandable
        // @todo: figure out a decent way to get the position besides dividing by a fiddled out number: 3 :D
        this.context.drawImage(
            this.offscreenCanvas,
            bufferBaseOffset.x, bufferMapIndex * (bufferViewportDim.height + elevationVariationSpacing), bufferViewportDim.width, bufferViewportDim.height,
            canvasPosition.x + this.offset.left, canvasPosition.y - this.tileHeight - (this.tileHeightHalf/3), bufferViewportDim.width, bufferViewportDim.height
        );

        //if (this.logonce < 4) {
        //    console.log(bufferBaseOffset.x, bufferMapIndex * (bufferViewportDim.height + elevationVariationSpacing), elevationVariationSpacing);
        //    this.logonce++;
        //}
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

        this.context.lineWidth = .5;
        this.context.fillStyle = this._getTileTopFillStyle(tile);

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
        this.context.fillStyle = this.config.tileColors.fillSideRightBase;
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
        this.context.fillStyle = this.config.tileColors.fillSideLeftBase;
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
        var color = this._getTileTopFillColor(tile);

        if (tile.level > 0) {
            return this.colorLuminance.calculate(color, this.config.tileColors.lightenByLevelMultiplier * tile.level);
        }

        return color;
    },
    /**
     * Calculates color based on tile level
     * @param {Tile} tile
     * @returns {string}
     * @private
     */
    _getTileTopFillColor: function(tile) {
        if (tile.isHovered()) {
            return this.config.tileColors.fillTopHovered;
        }

        if (tile.isSelected()) {
            return this.config.tileColors.fillTopSelected;
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
