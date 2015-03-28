var InputHandler = function(config) {
    this.yMouse = 0;
    this.xMouse = 0;
    this.selectedTile = false;
    this.config = config;

    this.setup();

    return this;
};

InputHandler.prototype = {
    /**
     * Attach Event listeners
     */
    setup: function() {
        this.register(document.querySelector('canvas#world'), "mousemove", this._mouseCoordsToTileCoords);
    },
    /**
     * Creates event listeners, optional data object is passed through
     * @param element
     * @param event
     * @param fn
     */
    register: function(element, event, fn) {
        element.params = {
            instance: this,
            canvasOffsetTop: 150,
            canvasOffsetLeft: 150,
            tileWidth: this.config.worldTileSize,
            tileHeight: this.config.worldTileSize,
            worldSize: this.config.worldSize,
            canvasSize: this.config.worldCanvasSize
        };

        element.addEventListener(event, $.throttle(16, fn), false);
    },
    /**
     * Converts current mouse coordinates to absolute 2D tile grid position / array indices
     * @param e
     * @private
     */
    _mouseCoordsToTileCoords: function(e) {
        var yMouse = e.offsetY - e.target.params.canvasOffsetTop;
        var xMouse = e.offsetX - e.target.params.canvasOffsetLeft;

        e.target.params.instance.selectedTile = {
            x: Math.round(xMouse / e.target.params.tileWidth + yMouse / (e.target.params.tileHeight/2))-1,
            y: Math.round(yMouse / (e.target.params.tileHeight/2) - xMouse / e.target.params.tileWidth)
        };

        //console.log('viewportX', xMouse, 'viewportY', yMouse);
        //console.log(e.target.params.instance.selectedTile);
    }
};
