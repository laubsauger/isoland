var Game = function() {
    this.config = {
        worldCanvas: document.querySelector('#world'),
        mapCanvas: document.querySelector('#map'),
        testCanvas: document.querySelector('#test'),
        worldCanvasSize: 400,
        mapCanvasSize: 400,
        testCanvasSize: 200,
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
};

Game.prototype = {
    /**
     * Initialize required game object
     * @returns {Game}
     */
    setup: function() {
        this.worldRenderer = this.createWorldRenderer();
        this.mapRenderer = this.createMapRenderer();
        this.testRenderer = this.createTestRenderer();

        this.presetMap = [
            //[
            //    {
            //        x: 0,
            //        y: 0,
            //        level: 1
            //    },
            //    {
            //        x: 0,
            //        y: 1,
            //        level: 2
            //    },
            //    {
            //        x: 0,
            //        y: 2,
            //        level: 3
            //    }
            //],[
            //    {
            //        x: 1,
            //        y: 0,
            //        level: 1
            //    }
            //],[
            //    {
            //        x: 2,
            //        y: 0,
            //        level: 2
            //    }
            //],[
            //    {
            //        x: 3,
            //        y: 0,
            //        level: 3
            //    }
            //]
        ];

        this.worldTileMap = new Map(this.config.worldSize, this.presetMap);

        this.worldViewport = new Viewport(this.config.worldViewportSize, this.worldTileMap);
        this.mapViewport = new Viewport(this.config.worldSize, this.worldTileMap);

        this.testViewport = new Viewport(4, new Map(4));

        this.inputHandler = new InputHandler(this.config);

        this.testRenderer.execute(this.testViewport);

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

        var self = this,
            canvasContainer = $('body:first-child')[0];

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
            requestAnimationFrame(animationLoop, canvasContainer);
        })();
    },
    /**
     * Create World renderer
     * @returns {Renderer}
     */
    createWorldRenderer: function() {
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

        return new Renderer(this.worldCanvas, rendererConfig);
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
            offset: {
                top: 20,
                left: 20
            },
            zoomLevel: this.mapZoomLevel
        };

        this.mapCanvas.width = this.mapCanvas.height = this.config.mapCanvasSize;

        return new Renderer(this.mapCanvas, rendererConfig);
    },
    /**
     * Create Test renderer
     * draws every possible tile combination (types and levels) in a straight line
     * @todo Extract this functionality to create an offscreen renderer which replaces the JIT drawing for renderers of every type (except this one) <- massive performance boost!
     * @returns {Renderer}
     */
    createTestRenderer: function() {
        var rendererConfig = {
            tileWidth: this.config.testTileSize,
            tileHeight: this.config.testTileSize,
            renderMode: "test",
            offset: {
                top: 30,
                left: 74
            }
        };

        this.testCanvas.width = this.config.testCanvasSize*2;
        this.testCanvas.height = this.config.testCanvasSize/2;

        return new Renderer(this.testCanvas, rendererConfig);
    }
};
