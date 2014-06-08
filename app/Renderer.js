var Renderer = function() {};

Renderer.prototype = {
    configure: function($canvas) {
        this.tileWidth = 10;
        this.tileHeight = 10;
        console.log($canvas);
        this.context = $canvas.getContext("2d");
    },
    execute: function(viewport, useIsoCoords) {
        for (var x=0; x<viewport.edgeLength; x++) {
            for (var y=0; y<viewport.edgeLength; y++) {
                this.drawTile(x, y, viewport.getTileAt(x, y), useIsoCoords);
            }
        }
    },
    drawTile: function(x, y, tile, useIsoCoords) {
        var canvasPosition;
        this.context.fillStyle = "#FF0000";

        if (useIsoCoords === true) {
            canvasPosition = from2DtoIso(x * this.tileWidth, y * this.tileHeight);
            this.context.fillRect(canvasPosition.x, canvasPosition.y, this.tileWidth, this.tileHeight / 2);
        } else {
            canvasPosition = {x: x * this.tileWidth, y: y * this.tileHeight};
            this.context.fillRect(canvasPosition.x, canvasPosition.y, this.tileWidth, this.tileHeight);
        }
    }
};