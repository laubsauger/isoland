var Game = function() {
    this.config = {
        worldCanvas: document.querySelector('#world'),
        mapCanvas: document.querySelector('#map'),
        testCanvas: document.querySelector('#test'),
        offscreenCanvas: document.querySelector('#offscreen'),
        worldCanvasSize: 400,
        mapCanvasSize: 200,
        offscreenCanvasDim: {
            height: 13982, //@todo: find out why antialiasing seems to fail starting at heigth > 13982
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
        this.presetMap = mapStorage.testPoolLevel2();

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
        var self = this,
            currentTileSelection = [],
            canvasCollection = [
                    {
                        'renderer': this.worldRenderer,
                        'viewport': this.worldViewport
                    },{
                        'renderer': this.mapRenderer,
                        'viewport': this.mapViewport
                    }
            ];

        //@todo input handling implementation details sitting in here is messy shiat
        (function renderLoop(){
            // execute renderer
            canvasCollection.forEach(function(canvas) {
                var hoveredTile = {};

                if (self.inputHandler.selectedTilePos) {
                    canvasCollection.forEach(function(canvas) {
                        //@todo figure out a way to perform visibility (z-buffer style) checks to prevent interaction with tiles that are hidden behind/below others
                        var selectedTile = canvas.viewport.getTileAt(self.inputHandler.selectedTilePos) || {};

                        if (selectedTile instanceof Tile && currentTileSelection.indexOf(selectedTile) === -1) {
                            selectedTile.selected = true;
                            currentTileSelection.push(selectedTile);
                            console.log(selectedTile);
                        }
                    });
                }

                if (self.inputHandler.hoveredTilePos) {
                    canvasCollection.forEach(function(canvas) {
                        //@todo figure out a way to perform visibility (z-buffer style) checks to prevent interaction with tiles that are hidden behind/below others
                        hoveredTile = canvas.viewport.getTileAt(self.inputHandler.hoveredTilePos) || {};

                        if (hoveredTile instanceof Tile) {
                            hoveredTile.hovered = true;
                        }
                    });
                }

                canvas.renderer.execute(canvas.viewport);

                // clean up one-off stuff
                hoveredTile.hovered = false;
            });

            //@todo replace length check for selection clearing with an interaction; e.g. mouserightdown or something
            if (currentTileSelection.length > 4) {
                currentTileSelection.forEach(function(tile) {
                    tile.selected = false;
                });

                currentTileSelection = [];
            }

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
        
        console.log(this.config.worldTileSize/this.config.testTileSize);
        
        console.log(rendererConfig.offset);

        return new Renderer(
            createBufferCanvas(this.config.offscreenCanvasDim.width, this.config.offscreenCanvasDim.height),
            rendererConfig,
            new ColorLuminance
        );
    }
};
