var Game = function() {
    this.config = {
        worldCanvas: document.querySelector('#worldIso'),
        mapCanvas: document.querySelector('#world'),
        worldCanvasSize: 400,
        mapCanvasSize: 400,
        worldSize: 10,
        worldViewportSize: 4,
        worldTileSize: 48,
        mapTileSize: 32,
        mapZoomLevel: 2
    };

    this.mapZoomLevel = this.config.mapZoomLevel;

    this.worldCanvas = this.config.worldCanvas;
    this.mapCanvas = this.config.mapCanvas;
};

Game.prototype = {
    setup: function() {
        this.worldRenderer = this.createWorldRenderer();
        this.mapRenderer = this.createMapRenderer();

        this.presetMap = [[
            {
                x: 0,
                y: 0,
                level: 1
            },
            {
                x: 0,
                y: 1,
                level: 2
            },
            {
                x: 0,
                y: 2,
                level: 3
            }
        ],[
            {
                x: 1,
                y: 0,
                level: 1
            }
        ],[
            {
                x: 2,
                y: 0,
                level: 2
            }
        ],[
            {
                x: 3,
                y: 0,
                level: 3
            }
        ]];

        this.worldTileMap = new Map(this.config.worldSize, this.presetMap);

        this.worldViewport = new Viewport(this.config.worldViewportSize, this.worldTileMap);
        this.mapViewport = new Viewport(this.config.worldSize, this.worldTileMap);

        return this;
    },
    run: function() {
        //>> game loop
        // 1. register viewport and game state changes
        // 2. do stuff
        // 3. apply changes
        // 4. redraw
        //<< game loop
        this.worldRenderer.execute(this.worldViewport);
        this.mapRenderer.execute(this.mapViewport);
    },
    createWorldRenderer: function() {
        var worldRendererConfig = {
            tileWidth: this.config.worldTileSize,
            tileHeight: this.config.worldTileSize,
            renderMode: "iso",
            offset: 150
        };

        this.worldCanvas.width = this.worldCanvas.height = this.config.worldCanvasSize;

        return new Renderer(this.worldCanvas, worldRendererConfig);
    },
    createMapRenderer: function() {
        var mapRendererConfig = {
            tileWidth: this.config.mapTileSize,
            tileHeight: this.config.mapTileSize,
            renderMode: "2d",
            offset: 20,
            zoomLevel: this.mapZoomLevel
        };

        this.mapCanvas.width = this.mapCanvas.height = this.config.mapCanvasSize;

        return new Renderer(this.mapCanvas, mapRendererConfig);
    }
};