var Game = function() {
    this.config = {
        worldCanvas: document.querySelector('#world'),
        mapCanvas: document.querySelector('#map'),
        testCanvas: document.querySelector('#test'),
        offscreenCanvas: document.querySelector('#offscreen'),
        worldCanvasSize: 400,
        mapCanvasSize: 200,
        testCanvasSize: 1600,
        offscreenCanvasSize: 2900,
        worldSize: 4,
        worldViewportSize: 4,
        worldTileSize: 96,
        mapTileSize: 64,
        testTileSize: 48,
        mapZoomLevel: 2
    };

    this.mapZoomLevel = this.config.mapZoomLevel;

    this.worldCanvas = this.config.worldCanvas;
    this.mapCanvas = this.config.mapCanvas;
    this.testCanvas = this.config.testCanvas;
    this.offscreenCanvas = this.config.offscreenCanvas;
};

Game.prototype = {
    /**
     * Initialize required game object
     * @returns {Game}
     */
    setup: function() {
        this.offscreenRenderer = this.createOffscreenRenderer();
        this.offscreenRenderer.execute();

        this.worldRenderer = this.createWorldRenderer(this.offscreenRenderer);

        // if the map is to be rendered every frame it should definitely use offscreen rendering too
        this.mapRenderer = this.createMapRenderer();

        this.testRenderer = this.createTestRenderer();

        var mapStorage = new MapStorage();
        this.presetMap = mapStorage.testMap();

        this.worldTileMap = new Map(this.config.worldSize, this.presetMap);

        this.worldViewport = new Viewport(this.config.worldViewportSize, this.worldTileMap);
        this.mapViewport = new Viewport(this.config.worldSize, this.worldTileMap);

        this.inputHandler = new InputHandler(this.config);

        this.testRenderer.execute();

        return this;
    },
    /**
     * run the game loop
     */
    run: function() {
        //>> game loop
        // 1. register viewport and game state changes (e.g. ask inputHandler for inputs) .
        // 2. do stuff
        // 3. apply changes
        // 4. redraw
        //<< game loop

        var self = this;

        (function animationLoop(){
            var focusedTile = false;
            //console.log('rendering');

            if (self.inputHandler.selectedTile) {
                focusedTile = self.worldViewport.getTileAt(self.inputHandler.selectedTile.x, self.inputHandler.selectedTile.y);

                if (focusedTile instanceof Tile) {
                    //noinspection JSPrimitiveTypeWrapperUsage
                    focusedTile.hasFocus = true;
                }
            }

            self.worldRenderer.execute(self.worldViewport);
            self.mapRenderer.execute(self.mapViewport);

            // clean up
            if (focusedTile instanceof Tile) {
                //noinspection JSPrimitiveTypeWrapperUsage
                focusedTile.hasFocus = false;
            }

            // loop
            requestAnimationFrame(animationLoop);
        })();
    },
    /**
     * Create World renderer
     * @param {Renderer} offscreenRenderer
     * @returns {Renderer}
     */
    createWorldRenderer: function(offscreenRenderer) {
        var rendererConfig = {
            tileWidth: this.config.worldTileSize,
            tileHeight: this.config.worldTileSize,
            renderMode: "iso",
            offset: {
                top: 150,
                left: 150
            }
        };

        this.worldCanvas.width = this.worldCanvas.height = this.config.worldCanvasSize;

        return new Renderer(this.worldCanvas, rendererConfig, new ColorLuminance, offscreenRenderer.getCanvas());
    },
    /**
     * Create Overview Map renderer
     * @returns {Renderer}
     */
    createMapRenderer: function() {
        var rendererConfig = {
            tileWidth: this.config.mapTileSize,
            tileHeight: this.config.mapTileSize,
            renderMode: "2d",
            drawTileLabels: true,
            offset: {
                top: 20,
                left: 20
            },
            zoomLevel: this.mapZoomLevel
        };

        this.mapCanvas.width = this.mapCanvas.height = this.config.mapCanvasSize;

        return new Renderer(this.mapCanvas, rendererConfig, new ColorLuminance);
    },
    /**
     * Create Test renderer
     * draws every possible tile combination (types and levels) in a straight line
     * @todo Extract & extend functionality (see also Renderer._drawTestTiles) to create an offscreen renderer which replaces the JIT drawing for renderers of every type (except this one) <- massive performance boost!
     * @returns {Renderer}
     */
    createTestRenderer: function() {
        var rendererConfig = {
            tileWidth: this.config.testTileSize,
            tileHeight: this.config.testTileSize,
            renderMode: "test",
            drawTileLabels: true,
            offset: {
                top: 175,
                left: 48
            }
        };

        this.testCanvas.width = this.config.testCanvasSize/3.5;
        this.testCanvas.height = this.config.testCanvasSize*2;

        return new Renderer(this.testCanvas, rendererConfig, new ColorLuminance);
    },
    /**
     *
     * @returns {Renderer}
     */
    createOffscreenRenderer: function() {
        var rendererConfig = {
            tileWidth: this.config.worldTileSize,
            tileHeight: this.config.worldTileSize,
            renderMode: "offscreen",
            offset: {
                top: 175*(this.config.worldTileSize/this.config.testTileSize),
                left: 48*(this.config.worldTileSize/this.config.testTileSize)
            }
        };

        this.offscreenCanvas.width = this.config.offscreenCanvasSize/3.5;
        this.offscreenCanvas.height = this.config.offscreenCanvasSize*2;

        return new Renderer(this.offscreenCanvas, rendererConfig, new ColorLuminance);
    }
};
