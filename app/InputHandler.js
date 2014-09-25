var InputHandler = function() {
    this.yMouse = 0;
    this.xMouse = 0;

    this.setup();
};

InputHandler.prototype = {
    setup: function() {
        this.register(document.querySelector('canvas#world'), "mousemove", this._mouseCoordsToTileCoords);
    },
    register: function(element, event, fn) {
        element.params = {
            canvasOffsetTop: 150,
            canvasOffsetLeft: 150,
            mapOffsetY: 150,
            mapOffsetX: 150,
            tileWidth: 48,
            tileHeight: 48
        };

        element.addEventListener(event, fn, false);
    },
    _mouseCoordsToTileCoords: function(e) {
        var x = e.pageX;
        var y = e.pageY;

        //todo: replace with call to new lib/coordinates functions?
        var yMouse = (2 * (y - e.target.params.canvasOffsetTop - e.target.params.mapOffsetY) -  + e.target.params.canvasOffsetLeft + e.target.params.mapOffsetX) / 2;
        var xMouse = x + yMouse - e.target.params.mapOffsetX - (e.target.params.tileWidth + 2) - e.target.params.canvasOffsetLeft;

        xMouse = xMouse + e.target.params.tileHeight / 2;
        // ymouse = ymouse - tileH/2;

        this.yMouse = Math.round(yMouse / e.target.params.tileWidth);
        this.xMouse = Math.round(xMouse / e.target.params.tileHeight);
        console.log('mouseX', this.xMouse, 'mouseY', this.yMouse);
    }
};
