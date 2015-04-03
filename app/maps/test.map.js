var MapStorage = function() {
    return this;
};

MapStorage.prototype.testMap = function() {
    return [
        [
            new Tile(0, 0, 0, new TileElevateParam(1, 0, 0, 0)),
            new Tile(0, 1, 0),
            new Tile(0, 2, 0),
            new Tile(0, 3, 0)
        ],[
            new Tile(1, 0, 0),
            new Tile(1, 1, 0),
            new Tile(1, 2, 0),
            new Tile(1, 3, 0)
        ],[
            new Tile(2, 0, 0),
            new Tile(2, 1, 0),
            new Tile(2, 2, 0),
            new Tile(2, 3, 0)
        ],[
            new Tile(3, 0, 0),
            new Tile(3, 1, 0),
            new Tile(3, 2, 0),
            new Tile(3, 3, 0)
        ]
    ]
};
