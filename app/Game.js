var Game = function() {
    this.config = {
        worldCanvas: document.querySelector('#world'),
        mapCanvas: document.querySelector('#map'),
        testCanvas: document.querySelector('#test'),
        offscreenCanvas: document.querySelector('#offscreen'),
        worldCanvasSize: 400,
        mapCanvasSize: 200,
        offscreenCanvasDim: {
            height: 22200, //@todo: find out why antialiasing seems to fail starting at heigth > 13982
            width: 2400
        },
        worldSize: 4,
        worldViewportSize: 4,
        worldTileSize: 96,
        mapTileSize: 64,
        testTileSize: 96,
        mapZoomLevel: 2
    };

    this.mapZoomLevel = this.config.mapZoomLevel;

    this.worldCanvas = this.config.worldCanvas;
    this.mapCanvas = this.config.mapCanvas;
    this.testCanvas = this.config.testCanvas;
    this.offscreenCanvas = this.config.offscreenCanvas;
    this.redrawableCanvases = [];
};

Game.prototype = {
    /**
     * Initialize required game object
     * @returns {Game}
     */
    setup: function() {
        this.ui = new UI();

        this.offscreenRenderer = this.createOffscreenRenderer();
        this.offscreenRenderer.execute();

        this.testRenderer = this.createTestRenderer();
        this.testRenderer.execute();

        this.worldRenderer = this.createWorldRenderer(this.offscreenRenderer);
        this.mapRenderer = this.createMapRenderer(); //@todo: the map will be rendered every frame => should definitely use offscreen buffer too

        var mapStorage = new MapStorage();
        this.presetMap = mapStorage.testPoolLevel2();
        this.worldTileMap = new Map(this.config.worldSize, this.presetMap);

        this.worldViewport = new Viewport(this.config.worldViewportSize, this.worldTileMap);
        this._addRenderLoopCanvas(this.worldRenderer, this.worldViewport);

        this.mapViewport = new Viewport(this.config.worldSize, this.worldTileMap);
        this._addRenderLoopCanvas(this.mapRenderer, this.mapViewport);

        this.inputHandler = new InputHandler(this.config, this.ui);

        return this;
    },
    _getRenderLoopCanvases: function() {
        return this.redrawableCanvases;
    },
    _addRenderLoopCanvas: function(renderer, viewport) {
        this.redrawableCanvases.push({'renderer': renderer, 'viewport': viewport});
    },
    /**
     * run the game loop
     */
    run: function() {
        var self = this;

        //@todo input handling implementation details sitting in here is messy shiat
        (function renderLoop(){
            // execute renderer
            self._getRenderLoopCanvases().forEach(function(canvas) {
                canvas.viewport.update(self.inputHandler);
                canvas.renderer.execute(canvas.viewport);
            });

            // loop
            requestAnimationFrame(renderLoop);
        })();
    },
    /**
     * Create World renderer
     * @param {Renderer} offscreenRenderer
     * @returns {Renderer}
     */
    createWorldRenderer: function(offscreenRenderer) {
        var rendererConfig = {
            maxLevel: 8,
            tileWidth: this.config.worldTileSize,
            tileHeight: this.config.worldTileSize,
            renderMode: "iso",
            offset: {
                top: 150,
                left: 150
            },
            canvasDim: {
                width: this.config.worldCanvasSize,
                height: this.config.worldCanvasSize
            }
        };

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
            canvasDim: {
                width: this.config.mapCanvasSize,
                height: this.config.mapCanvasSize
            },
            zoomLevel: this.mapZoomLevel
        };

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
            maxLevel: 8,
            tileWidth: this.config.testTileSize,
            tileHeight: this.config.testTileSize,
            renderMode: "test",
            drawTileLabels: true,
            offset: {
                //top: 175,
                //left: 48
                //@todo: should be tileheight x maxLevel or something...
                top: 350,
                left: this.config.worldTileSize
            },
            canvasDim: {
                width: this.config.offscreenCanvasDim.width,
                height: this.config.offscreenCanvasDim.height
            }
        };

        return new Renderer(this.testCanvas, rendererConfig, new ColorLuminance);
    },
    /**
     *
     * @returns {Renderer}
     */
    createOffscreenRenderer: function() {
        var rendererConfig = {
            maxLevel: 8,
            tileWidth: this.config.worldTileSize,
            tileHeight: this.config.worldTileSize,
            renderMode: "offscreen",
            offset: {
                //@todo: should be tileheight x maxLevel or something...
                top: 350,
                left: this.config.worldTileSize
            },
            canvasDim: {
                width: this.config.offscreenCanvasDim.width,
                height: this.config.offscreenCanvasDim.height
            }
        };
        
        return new Renderer(
            createBufferCanvas(this.config.offscreenCanvasDim.width, this.config.offscreenCanvasDim.height),
            rendererConfig,
            new ColorLuminance
        );
    }
};
