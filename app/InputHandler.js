var InputHandler = function(config) {
    this.selectedTilePos = false;
    this.viewportOrientationChange = false;
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
            'mousemove',
            (function() {
                var params = self.getDefaultParameters();
                return function(evt) { $.throttle(16, function(evt) { return params._this.handleMouseMoveEvent(evt, params)})(evt)};
            })()
        );

        this.register(
            document.querySelector('canvas#world'),
            'mousedown',
            (function() {
                var params = self.getDefaultParameters();
                params.debug = true;

                return function(evt) { $.throttle(16, function(evt) {return params._this.handleMouseDownEvent(evt, params)})(evt)};
            })()
        );

        this.register(
            document.querySelector('.rotate--cw'),
            'click',
            (function() {
                var params = self.getDefaultParameters();
                params.debug = true;

                return function(evt) { $.throttle(16, function(evt) {return params._this.handleRotateButtonClickEvent(evt, params)})(evt)};
            })()
        );
    },
    /**
     * Handles mouse move event; sets currently hovered tile
     * @param evt
     * @param params
     */
    handleMouseMoveEvent: function(evt, params) {
        params._this.hoveredTilePos = params._this.mouseCoordsToTileCoords(evt, params);
    },
    /**
     * Handles mouse down event; sets currently selected tile
     * @param evt
     * @param params
     */
    handleMouseDownEvent: function(evt, params) {
        params._this.selectedTilePos = params._this.mouseCoordsToTileCoords(evt, params);
    },
    /**
     * Handles mouse down event; sets currently selected tile
     * @param evt
     * @param params
     */
    handleRotateButtonClickEvent: function(evt, params) {
        params._this.viewportOrientationChange = evt.target.value;
    },
    /**
     * Creates event listeners, optional data object is passed through
     * @param element
     * @param eventName
     * @param fn
     */
    register: function(element, eventName, fn) {
        try {
            element.addEventListener(eventName, fn, false);
        } catch (e) {
            console.error(e, 'Could not register event listener: ' + eventName);
        }
    },
    /**
     * Converts current mouse coordinates to absolute 2D tile grid position / array indices
     * @param evt
     * @param params
     */
    mouseCoordsToTileCoords: function(evt, params) {
        var yMouse = evt.offsetY - params.canvasOffsetTop;
        var xMouse = evt.offsetX - params.canvasOffsetLeft;

        if (params.debug === true) {
            console.log('viewportX', xMouse, 'viewportY', yMouse);
        }

        if (params.debug === true) {
            console.log(new Pos(
                Math.round(xMouse / params.tileWidth + yMouse / (params.tileHeight/2))-1,
                Math.round(yMouse / (params.tileHeight/2) - xMouse / params.tileWidth)
            ));
        }

        return new Pos(
            Math.round(xMouse / params.tileWidth + yMouse / (params.tileHeight/2))-1,
            Math.round(yMouse / (params.tileHeight/2) - xMouse / params.tileWidth)
        );
    },
    /**
     * Returns default params
     * @returns {{}}
     */
    getDefaultParameters: function() {
        return {
            _this: this,
            canvasOffsetTop: 150,
            canvasOffsetLeft: 150,
            tileWidth: this.config.worldTileSize,
            tileHeight: this.config.worldTileSize,
            worldSize: this.config.worldSize,
            canvasSize: this.config.worldCanvasSize,
            debug: false
        };
    }
};
