var MapStorage = function() {
    return this;
};

MapStorage.prototype.testElevationsLevel0 = function() {
    return [
        [
            new Tile(0, 0, 0, new TileElevateParam(0, 0, 0, 0)),
            new Tile(0, 1, 0, new TileElevateParam(1, 0, 0, 0)),
            new Tile(0, 2, 0, new TileElevateParam(0, 1, 0, 0)),
            new Tile(0, 3, 0, new TileElevateParam(0, 0, 1, 0))
        ],[
            new Tile(1, 0, 0, new TileElevateParam(0, 0, 0, 1)),
            new Tile(1, 1, 0, new TileElevateParam(1, 1, 0, 0)),
            new Tile(1, 2, 0, new TileElevateParam(1, 0, 1, 0)),
            new Tile(1, 3, 0, new TileElevateParam(1, 0, 0, 1))
        ],[
            new Tile(2, 0, 0, new TileElevateParam(1, 1, 1, 0)),
            new Tile(2, 1, 0, new TileElevateParam(1, 1, 0, 1)),
            new Tile(2, 2, 0, new TileElevateParam(0, 1, 1, 0)),
            new Tile(2, 3, 0, new TileElevateParam(0, 1, 0, 1))
        ],[
            new Tile(3, 0, 0, new TileElevateParam(1, 0, 1, 1)),
            new Tile(3, 1, 0, new TileElevateParam(0, 0, 1, 1)),
            new Tile(3, 2, 0, new TileElevateParam(0, 1, 1, 1)),
            new Tile(3, 3, 0)
        ]
    ]
};

MapStorage.prototype.testPoolLevel2 = function() {
    return [
        [
            new Tile(0, 0, 2, new TileElevateParam(0, 0, -1, 0)),
            new Tile(0, 1, 2, new TileElevateParam(0, -1, -1, 0)),
            new Tile(0, 2, 2, new TileElevateParam(0, -1, -1, 0)),
            new Tile(0, 3, 2, new TileElevateParam(0, -1, 0, 0))
        ],[
            new Tile(1, 0, 2, new TileElevateParam(0, 0, -1, -1)),
            new Tile(1, 1, 1, new TileElevateParam(0, 0, 0, 0)),
            new Tile(1, 2, 1, new TileElevateParam(0, 0, 0, 0)),
            new Tile(1, 3, 2, new TileElevateParam(-1, -1, 0, 0))
        ],[
            new Tile(2, 0, 2, new TileElevateParam(0, 0, -1, -1)),
            new Tile(2, 1, 1, new TileElevateParam(0, 0, 0, 0)),
            new Tile(2, 2, 1, new TileElevateParam(0, 0, 0, 0)),
            new Tile(2, 3, 2, new TileElevateParam(-1, -1, 0, 0))
        ],[
            new Tile(3, 0, 2, new TileElevateParam(0, 0, 0, -1)),
            new Tile(3, 1, 2, new TileElevateParam(-1, 0, 0, -1)),
            new Tile(3, 2, 2, new TileElevateParam(-1, 0, 0, -1)),
            new Tile(3, 3, 2, new TileElevateParam(-1, 0, 0, 0))
        ]
    ]
};
