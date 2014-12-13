/**
 *
 * @param {Object} $canvas DomElement
 * @param {Object} config
 * @constructor
 */
var Renderer = function($canvas, config) {
    this.context = $canvas.getContext("2d");
    this.width = $canvas.width;
    this.height = $canvas.height;
    this.supportedRenderModes = ["iso", "2d", "test"];

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
            zoomLevel: config.zoomLevel
        };

        if (this.supportedRenderModes.indexOf(this.config.renderMode) === -1) {
            throw new InvalidArgumentException(this.config.renderMode, 'Renderer', 'configure', 'config.rendermode');
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
                this._drawTile({x: x, y: y}, viewport.getTileAt(x, y));
            }
        }
    },
    _drawTestTiles: function() {
        //foreach tile variant
        // draw variant one a horizontal line
        // (0,3) (1,2) (2,1) (3,0)
        this._drawIsoTile({x: 0, y: 3}, new Tile(0,3,0));
        this._drawIsoTile({x: 1, y: 2}, new Tile(1,2,1));
        this._drawIsoTile({x: 2, y: 1}, new Tile(2,1,2));
        this._drawIsoTile({x: 3, y: 0}, new Tile(3,0,3));
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
            this._draw2DTile(pos);
        }
    },
    /**
     * draws a tile in iso mode
     * @param pos
     * @param {Tile} tile
     * @private
     */
    _drawIsoTile: function(pos, tile) {
        var canvasPosition = fromGridToIso(pos.x, pos.y, this.tileHeight, this.tileWidth);

        if (tile.level > 0) {
            this._drawTileFrame(canvasPosition, tile.level);
        }

        this._drawIsoTileTop(canvasPosition, tile.level);

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
     * @param level
     * @private
     */
    _drawIsoTileTop: function (pos, level) {
        if(level > 0) {
            pos.y -= (this.tileHeight/2*level);
        }

        var offsetPos = {
                x: (pos.x + this.tileWidth/2) + this.offset.left,
                y: (pos.y + this.tileHeight/2) + this.offset.top
            },
            fullOffsetPos = {
                x: pos.x + this.tileWidth + this.offset.left,
                y: pos.y + this.tileHeight + this.offset.top
            };

        this.context.lineWidth = .5;
        this.context.fillStyle = "#7777FF";
        this.context.strokeStyle = '#000';
        this.context.beginPath();
        this.context.moveTo(pos.x + this.offset.left, offsetPos.y);
        this.context.lineTo(offsetPos.x, pos.y + this.offset.top);
        this.context.lineTo(fullOffsetPos.x, offsetPos.y);
        this.context.lineTo(offsetPos.x, fullOffsetPos.y);
        this.context.lineTo(pos.x + this.offset.left, offsetPos.y);
        this.context.fill();
        this.context.stroke();
        this.context.closePath();
    },
    /**
     * draws the tile frame for each height level at the given position - based on isometric coordinates
     * @param pos
     * @param level
     * @private
     */
    _drawTileFrame: function(pos, level) {
        var tileHeightLevelOffset = (pos.y - (this.tileHeight/2 * (level-1))) + this.offset.top,
            offsetPos = {
                x: (pos.x + this.tileWidth/2) + this.offset.left,
                y: (pos.y + this.tileHeight/2) + this.offset.top
            },
            fullOffsetPos = {
                x: pos.x + this.tileWidth + this.offset.left,
                y: pos.y + this.tileHeight + this.offset.top
            };

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
     * @private
     */
    _draw2DTile: function(pos) {
        var width = this.tileWidth / this.config.zoomLevel;
        var height = this.tileHeight / this.config.zoomLevel;

        var canvasPosition = {x: pos.x * width, y: pos.y * height};
        this._draw2DTileTop(canvasPosition, width, height);

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
     * @private
     */
    _draw2DTileTop: function(pos, width, height) {
        this.context.lineWidth = 1;
        this.context.fillStyle = "#7777FF";
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
    }
};
