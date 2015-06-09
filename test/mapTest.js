describe('Map', function() {
    var map;
    beforeEach(function() {
        map = new Map(5);
    });

    describe('initialization', function() {
        it('creates an 2d-array with the provided dimensions containing Tiles', function() {
            expect(map.tiles[0][0] instanceof Tile).toBeTruthy();
            expect(map.tiles.length).toEqual(5);
            expect(map.tiles.length * map.edgeLength).toEqual(25);
        });

        it('returns the tile at the provided coordinates', function() {
            var tile = new Tile(2, 2, 0);

            expect(map.getTileAt(new Pos(2,2))).toEqual(tile);
        });

        it('throws exception when passed edgeLength is out of range', function() {
            var nonIntegerLength = "a",
                negativeLength = -15,
                zero = 0;

            //@todo: figure out how to properly expect specific exceptions with jasmine2.x
            //expect(function() { new Map(nonIntegerLength); }).toThrow(new InvalidArgumentException(nonIntegerLength, 'Map', 'create'));
            //expect(function() { new Map(negativeLength); }).toThrow(new InvalidArgumentException(negativeLength, 'Map', 'create'));
            //expect(function() { new Map(zero); }).toThrow(new InvalidArgumentException(zero, 'Map', 'create'));
            expect(function() { new Map(nonIntegerLength); }).toThrow();
            expect(function() { new Map(negativeLength); }).toThrow();
            expect(function() { new Map(zero); }).toThrow();
        });
    });
});
