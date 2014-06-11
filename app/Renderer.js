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
    this.supportedRenderModes = ["iso", "2d"];

    this.configure(config);
};

Renderer.prototype = {
    configure: function(config) {
        this.config = {
            drawTileLabels: config.drawTileLabels || true,
            tileWidth: config.tileWidth,
            tileHeight: config.tileHeight,
            offset: config.offset,
            renderMode: config.renderMode
        };

        if (this.supportedRenderModes.indexOf(this.config.renderMode) === -1) {
            throw new InvalidArgumentException(this.config.renderMode, 'Renderer', 'configure', 'config.rendermode');
        }

        this.tileWidth = this.config.tileWidth;
        this.tileHeight = this.config.tileHeight;

        if (this.config.renderMode === "iso") {
            this.tileHeight = this.tileHeight/2;
        }

        this.offset = this.config.offset;

        return this;
    },
    /**
     * @param {Viewport} viewport
     */
    execute: function(viewport) {
        this.context.translate(0.5, 0.5);

        for (var x=0; x<viewport.edgeLength; x++) {
            for (var y=0; y<viewport.edgeLength; y++) {
                this._drawTile({x: x, y: y}, viewport.getTileAt(x, y));
            }
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
        var canvasPosition = from2DtoIso(pos.x * this.tileWidth/2, pos.y * this.tileHeight);

        if (tile.level > 0) {
            this._drawTileFrame(canvasPosition, tile.level);
        }

        this._drawTileTopIso(canvasPosition, tile.level);

        if (this.config.drawTileLabels) {
            var textPosition = {
                x: canvasPosition.x + this.offset + this.tileWidth/3,
                y: canvasPosition.y + this.offset + ((this.tileHeight / 1.7))
            };

            this._drawTileLabel(pos.x + "," + pos.y, "#000000", textPosition);
        }
    },
    /**
     * draws the tile frame for each height level at the given position - based on isometric coordinates
     * @param pos
     * @param level
     * @private
     */
    _drawTileFrame: function(pos, level) {
        var tileHeightLevelOffset = (pos.y - (this.tileHeight/2 * (level-1))) + this.offset,
            offsetPos = {
                x: (pos.x + this.tileWidth/2) + this.offset,
                y: (pos.y + this.tileHeight/2) + this.offset
            },
            fullOffsetPos = {
                x: pos.x + this.tileWidth + this.offset,
                y: pos.y + this.tileHeight + this.offset
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
            this.context.moveTo(pos.x + this.offset, tileHeightLevelOffset);
            this.context.lineTo(pos.x + this.offset, offsetPos.y);
            this.context.lineTo(offsetPos.x, fullOffsetPos.y);
            this.context.lineTo(offsetPos.x, tileHeightLevelOffset + this.tileHeight/2);
            this.context.lineTo(pos.x + this.offset, tileHeightLevelOffset);
            this.context.fill();
            this.context.stroke();
        this.context.closePath();
    },
    /**
     * draws top tile at the given position and level
     * @param pos
     * @param level
     * @private
     */
    _drawTileTopIso: function(pos, level) {
        if(level > 0) {
            pos.y -= (this.tileHeight/2*level);
        }

        var offsetPos = {
                x: (pos.x + this.tileWidth/2) + this.offset,
                y: (pos.y + this.tileHeight/2) + this.offset
            },
            fullOffsetPos = {
                x: pos.x + this.tileWidth + this.offset,
                y: pos.y + this.tileHeight + this.offset
            };

        this.context.lineWidth = .5;
        this.context.fillStyle = "#7777FF";
        this.context.strokeStyle = '#000';
        this.context.beginPath();
            this.context.moveTo(pos.x + this.offset, offsetPos.y);
            this.context.lineTo(offsetPos.x, pos.y + this.offset);
            this.context.lineTo(fullOffsetPos.x, offsetPos.y);
            this.context.lineTo(offsetPos.x, fullOffsetPos.y);
            this.context.lineTo(pos.x + this.offset, offsetPos.y);
            this.context.fill();
            this.context.stroke();
        this.context.closePath();
    },
    /**
     * draws a 2d tile at the given position
     * @param pos
     * @private
     */
    _draw2DTile: function(pos) {
        var canvasPosition = {x: pos.x * this.tileWidth, y: pos.y * this.tileHeight};
        this._drawTileTop2D(canvasPosition);

        if (this.config.drawTileLabels) {
            var textPosition = {
                x: canvasPosition.x + this.offset + (this.tileWidth / 4),
                y: (parseInt(canvasPosition.y) + this.offset) + (this.tileHeight / 2)
            };

            this._drawTileLabel(pos.x + "," + pos.y, "#000000", textPosition);
        }
    },
    /**
     * draws the 2d top tile for a given position
     * @param pos
     * @private
     */
    _drawTileTop2D: function(pos) {
        this.context.lineWidth = 1;
        this.context.fillStyle = "#7777FF";
        this.context.strokeStyle = '#000';
        this.context.beginPath();
            this.context.moveTo(pos.x + this.offset, (pos.y+this.tileHeight) + this.offset);
            this.context.lineTo(pos.x + this.offset, pos.y + this.offset);
            this.context.lineTo(pos.x+this.tileWidth + this.offset, pos.y + this.offset);
            this.context.lineTo(pos.x+this.tileWidth  + this.offset, pos.y+this.tileHeight + this.offset);
            this.context.lineTo(pos.x + this.offset, (pos.y+this.tileHeight) + this.offset);
            this.context.fill();
            this.context.stroke();
        this.context.closePath();
    },
    /**
     * draws a text label at the given position
     * @param text
     * @param color
     * @param pos
     * @private
     */
    _drawTileLabel: function(text, color, pos) {
        this.context.font="10px Consolas";
        this.context.fillStyle = color;
        this.context.fillText(text, pos.x, pos.y);
    }
};