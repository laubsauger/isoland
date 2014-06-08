var Renderer = function($canvas) {
    this.context = $canvas.getContext("2d");
    this.width = $canvas.width;
    this.height = $canvas.height;
};

Renderer.prototype = {
    configure: function(tileWidth, tileHeight) {
        this.tileWidth = tileWidth || 20;
        this.tileHeight = tileHeight || 20;
        this.offset = 150;
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

        this.context.font="10px Consolas";

        if (useIsoCoords === true) {
            canvasPosition = from2DtoIso(x * this.tileWidth/2, y * this.tileHeight);

            this.context.fillStyle = "#FF0000";
            this.context.beginPath();
                this.context.moveTo(canvasPosition.x + this.offset, (canvasPosition.y+this.tileHeight/2) + this.offset);
                this.context.lineTo((canvasPosition.x + this.tileWidth/2) + this.offset, canvasPosition.y + this.offset);
                this.context.lineTo(canvasPosition.x+this.tileWidth + this.offset, (canvasPosition.y+this.tileHeight/2) + this.offset);
                this.context.lineTo((canvasPosition.x+this.tileWidth/2) + this.offset, canvasPosition.y+this.tileHeight + this.offset);
                this.context.lineTo(canvasPosition.x + this.offset, (canvasPosition.y+this.tileHeight/2) + this.offset);
                this.context.fill();
            this.context.stroke();

            this.context.fillStyle = "#000000";
            this.context.fillText(x + "," + y, canvasPosition.x + this.offset + this.tileWidth/3, canvasPosition.y + this.offset + ((this.tileHeight / 2)));
        } else {
            canvasPosition = {x: x * this.tileWidth, y: y * this.tileHeight};
            this.context.fillStyle = "#FF0000";
            this.context.fillRect(canvasPosition.x + this.offset, canvasPosition.y + this.offset, this.tileWidth, this.tileHeight);

            this.context.fillStyle = "#000000";
            this.context.fillText(x + "," + y, canvasPosition.x + this.offset, (parseInt(canvasPosition.y) + this.offset) + (this.tileHeight / 2));
        }
    }
};