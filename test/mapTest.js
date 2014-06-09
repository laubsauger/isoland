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

            expect(map.getTileAt(2,2)).toEqual(tile);
        });
    });
});