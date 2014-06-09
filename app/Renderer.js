/**
 *
 * @param {Object} $canvas DomElement
 * @constructor
 */
var Renderer = function($canvas) {
    this.context = $canvas.getContext("2d");
    this.width = $canvas.width;
    this.height = $canvas.height;
};

Renderer.prototype = {
    /**
     *
     * @param {Int} tileWidth
     * @param {Int} tileHeight
     */
    configure: function(tileWidth, tileHeight) {
        this.tileWidth = tileWidth || 20;
        this.tileHeight = tileHeight || 20;
        this.offset = 150;

        this.config = {
            drawTileLabels: true
        };
    },
    /**
     *
     * @param {Viewport} viewport
     * @param {Bool} useIsoCoords
     */
    execute: function(viewport, useIsoCoords) {
        for (var x=0; x<viewport.edgeLength; x++) {
            for (var y=0; y<viewport.edgeLength; y++) {
                var pos = {x: x, y: y};
                this._drawTile(pos, viewport.getTileAt(x, y), useIsoCoords);
            }
        }
    },
    /**
     *
     * @param pos
     * @param {Tile} tile
     * @param {Bool} useIsoCoords
     */
    _drawTile: function(pos, tile, useIsoCoords) {
        if (useIsoCoords === true) {
            this._drawIsoTile(pos, tile);
        } else {
            this._draw2DTile(pos);
        }
    },
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
    _drawTileFrame: function(pos, level) {
        this.context.fillStyle = "#00FF00";

        var tileHeightLevelOffset = (this.tileHeight/2 * (level-1));
        //draw tile framing according to height/level
        this.context.beginPath();
            this.context.moveTo(pos.x + this.offset, pos.y - tileHeightLevelOffset + this.offset);
            this.context.lineTo(pos.x + this.offset, (pos.y + this.tileHeight/2) + this.offset);
            this.context.lineTo((pos.x + this.tileWidth/2) + this.offset, pos.y + this.tileHeight + this.offset);
            this.context.lineTo(pos.x + this.tileWidth + this.offset, (pos.y + this.tileHeight/2) + this.offset);
            this.context.lineTo(pos.x + this.tileWidth + this.offset, pos.y - tileHeightLevelOffset + this.offset);
            this.context.moveTo((pos.x + this.tileWidth/2) + this.offset, pos.y - tileHeightLevelOffset + this.offset);
            this.context.lineTo((pos.x + this.tileWidth/2) + this.offset, pos.y + this.tileHeight + this.offset);
            this.context.fill();
            this.context.stroke();
        this.context.closePath();
    },
    _drawTileTopIso: function(pos, level) {
        this.context.fillStyle = "#7777FF";

        if(level > 0) {
            pos.y -= (this.tileHeight/2*level);
        }

        this.context.beginPath();
            this.context.moveTo(pos.x + this.offset, (pos.y+this.tileHeight/2) + this.offset);
            this.context.lineTo((pos.x + this.tileWidth/2) + this.offset, pos.y + this.offset);
            this.context.lineTo(pos.x+this.tileWidth + this.offset, (pos.y+this.tileHeight/2) + this.offset);
            this.context.lineTo((pos.x+this.tileWidth/2) + this.offset, pos.y+this.tileHeight + this.offset);
            this.context.lineTo(pos.x + this.offset, (pos.y+this.tileHeight/2) + this.offset);
            this.context.fill();
        this.context.stroke();
    },
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
    _drawTileTop2D: function(pos) {
        this.context.fillStyle = "#7777FF";
        this.context.beginPath();
            this.context.moveTo(pos.x + this.offset, (pos.y+this.tileHeight) + this.offset);
            this.context.lineTo(pos.x + this.offset, pos.y + this.offset);
            this.context.lineTo(pos.x+this.tileWidth + this.offset, pos.y + this.offset);
            this.context.lineTo(pos.x+this.tileWidth  + this.offset, pos.y+this.tileHeight + this.offset);
            this.context.lineTo(pos.x + this.offset, (pos.y+this.tileHeight) + this.offset);
            this.context.fill();
        this.context.stroke();
    },
    _drawTileLabel: function(text, color, pos) {
        this.context.font="10px Consolas";
        this.context.fillStyle = color;
        this.context.fillText(text, pos.x, pos.y);
    }
};