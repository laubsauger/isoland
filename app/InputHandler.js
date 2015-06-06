var InputHandler = function(config) {
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
        var self = this;

        this.register(
            document.querySelector('canvas#world'),
            "mousemove",
            (function() {
                var params = self._getDefaultParameters();
                return function(evt) { $.throttle(16, function(evt) { return params.instance._mouseCoordsToTileCoords(evt, params)})(evt)};
            })()
        );

        this.register(
            document.querySelector('canvas#world'),
            "mousedown",
            (function() {
                var params = self._getDefaultParameters();
                params.debug = true;

                return function(evt) { $.throttle(16, function(evt) {return params.instance._mouseCoordsToTileCoords(evt, params)})(evt)};
            })()
        );
    },
    _getDefaultParameters: function() {
        return {
            instance: this,
            canvasOffsetTop: 150,
            canvasOffsetLeft: 150,
            tileWidth: this.config.worldTileSize,
            tileHeight: this.config.worldTileSize,
            worldSize: this.config.worldSize,
            canvasSize: this.config.worldCanvasSize,
            debug: false
        };
    },
    /**
     * Creates event listeners, optional data object is passed through
     * @param element
     * @param eventName
     * @param fn
     */
    register: function(element, eventName, fn) {
        element.addEventListener(eventName, fn, false);
    },
    /**
     * Converts current mouse coordinates to absolute 2D tile grid position / array indices
     * @param evt
     * @private
     * @param params
     */
    _mouseCoordsToTileCoords: function(evt, params) {
        var yMouse = evt.offsetY - params.canvasOffsetTop;
        var xMouse = evt.offsetX - params.canvasOffsetLeft;

        params.instance.selectedTile = {
            x: Math.round(xMouse / params.tileWidth + yMouse / (params.tileHeight/2))-1,
            y: Math.round(yMouse / (params.tileHeight/2) - xMouse / params.tileWidth)
        };

        if (params.debug === true) {
            console.log('viewportX', xMouse, 'viewportY', yMouse);
            console.log(typeof params.debug);
            console.log(params.debug);
            console.log(params.debug || false);
        }
    }
};
