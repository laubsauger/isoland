function convertMouseCoordsToTileCoords(e){
    var x = e.pageX;
    var y = e.pageY;

    var yMouse = (2*(y-canvas.offsetTop-mapYOffset)-x+canvas.offsetLeft+mapXOffset)/2;
    var xMouse = x+yMouse-mapXOffset-(tileW+2)-canvas.offsetLeft;

    xMouse = xMouse + tileH/2;
    // ymouse = ymouse - tileH/2;

    yMouse = Math.round(yMouse/tileH);
    xMouse = Math.round(xMouse/tileH);
    // console.log('mouseX',xmouse,'mouseY', ymouse);
}

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
    /**
     * Initialize required game object
     * @returns {Game}
     */
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

        this.config.inputMap = {
            highlightTileOnMouseOver: {
                domElement: this.config.worldCanvas,
                event: "mousemove"
            }
        };

        this.inputHandler = new InputHandler();

        return this;
    },
    /**
     * run the game loop
     */
    run: function() {
        //>> game loop
        // 1. register viewport and game state changes .
        // 2. do stuff
        // 3. apply changes
        // 4. redraw
        //<< game loop
        this.worldRenderer.execute(this.worldViewport);
        this.mapRenderer.execute(this.mapViewport);
    },
    /**
     * Create World renderer
     * @returns {Renderer}
     */
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
    /**
     * Create Overview Map renderer
     * @returns {Renderer}
     */
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
