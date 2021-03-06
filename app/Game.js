var Game = function() {
    this.config = {
        worldCanvas: document.querySelector('#world'),
        mapCanvas: document.querySelector('#map'),
        testCanvas: document.querySelector('#test'),
        offscreenCanvas: document.querySelector('#offscreen'),
        worldCanvasSize: 400,
        mapCanvasSize: 300,
        offscreenCanvasDim: {
            height: 22200, //@todo: find out why antialiasing seems to fail starting at heigth > 13982
            width: 3600
        },
        worldSize: 8,
        worldViewportSize: 4,
        worldTileSize: 96,
        mapTileSize: 64,
        testTileSize: 96,
        mapZoomLevel: 2,
        metersPerTile: 15.625
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
        this.offscreenRenderer = this.createOffscreenRenderer();
        this.offscreenRenderer.execute();

        this.testRenderer = this.createTestRenderer();
        this.testRenderer.execute();

        this.worldRenderer = this.createWorldRenderer(this.offscreenRenderer);
        //@todo: the map will be rendered every frame => should definitely use offscreen buffer too
        this.mapRenderer = this.createMapRenderer();

        var mapStorage = new MapStorage();
        this.mapData = mapStorage.flatMap(this.config.worldSize);
        this.worldTileMap = new Map(this.config.worldSize, this.mapData);

        this.worldViewport = new Viewport(this.config.worldViewportSize, this.worldTileMap);
        this._addRenderLoopCanvas(this.worldRenderer, this.worldViewport);

        this.mapViewport = new Viewport(this.config.worldSize, this.worldTileMap);
        this._addRenderLoopCanvas(this.mapRenderer, this.mapViewport);

        this.ui = new UI({
            worldSize: this.config.worldSize,
            metersPerTile: this.config.metersPerTile
        });

        this.inputHandler = new InputHandler(this.config, this.ui);

        return this;
    },
    _getRenderLoopCanvases: function() {
        return this.redrawableCanvases;
    },
    _addRenderLoopCanvas: function(renderer, viewport) {
        viewport.init(0,0);
        this.redrawableCanvases.push({'renderer': renderer, 'viewport': viewport});
    },
    /**
     * run the game loop
     */
    run: function() {
        var self = this;

        var stats = this.initStats();

        (function renderLoop(){
            stats.begin();

            // execute renderer
            self._getRenderLoopCanvases().forEach(function(canvas) {
                canvas.viewport.update(self.inputHandler, canvas.renderer.config.renderMode === 'map');
                canvas.renderer.execute(canvas.viewport);
            });
            stats.end();

            requestAnimationFrame(renderLoop);
        })();
    },

    initStats: function() {
        var stats = new Stats();
        stats.dom.style.top = 'initial';
        stats.dom.style.left = 'initial';
        stats.dom.className = 'stats';
        document.body.appendChild( stats.dom );

        var statsElements = document.querySelectorAll('.stats canvas');
        statsElements.forEach(function(statsEl) {
            statsEl.style.display = 'block';
        });

        return stats;
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
            renderMode: "map",
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
