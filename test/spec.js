var map;
beforeEach(function() {
    map = new Map();
});

describe('MapController', function() {

    describe('initialization', function() {
        it('creates an 2d-array of tiles with the provided dimensions', function() {
            map.create(5);

            expect(map.tiles.length).toEqual(5);
            expect(map.tiles.length * map.edgeLength).toEqual(25);
        });

        it('returns the tile at the provided coordinates', function() {
            map.create(5);

            var tile = new Tile(2,2);

            expect(map.getTileAt(2,2)).toEqual(tile);
        });
    });

    describe('rotation', function() {
        it('rotates the tile array clockwise', function() {
            map.create(3);

            var oldTopRightTile = map.getTileAt(0,2),
                oldBottomLeftTile = map.getTileAt(2,0);

            map.rotateClockwise();

            var newTopRightTile = map.getTileAt(0,2),
                newBottomLeftTile = map.getTileAt(2,0);

            expect(newTopRightTile).not.toEqual(oldTopRightTile);
            expect(newBottomLeftTile).not.toEqual(oldBottomLeftTile);

            expect(map.getTileAt(2,2)).toEqual(oldTopRightTile);
            expect(map.getTileAt(0,0)).toEqual(oldBottomLeftTile);
        });

        it('rotates the tile array counterclockwise', function() {
            map.create(3);

            var oldTopRightTile = map.getTileAt(0,2),
                oldBottomLeftTile = map.getTileAt(2,0);

            map.rotateCounterClockwise();

            var newTopRightTile = map.getTileAt(0,2),
                newBottomLeftTile = map.getTileAt(2,0);

            expect(newTopRightTile).not.toEqual(oldTopRightTile);
            expect(newBottomLeftTile).not.toEqual(oldBottomLeftTile);

            expect(map.getTileAt(0,0)).toEqual(oldTopRightTile);
            expect(map.getTileAt(2,2)).toEqual(oldBottomLeftTile);
        });

        it('modifies the map orientation when rotating the tile array', function() {
            map.create(3);

            map.rotateClockwise();
            expect(map.getOrientation()).toEqual(90);

            map.rotateClockwise();
            expect(map.getOrientation()).toEqual(180);

            map.rotateClockwise();
            expect(map.getOrientation()).toEqual(270);

            // stepping over or on 360deg, so we expect a reset to 0
            map.rotateClockwise();
            expect(map.getOrientation()).toEqual(0);

            map.rotateCounterClockwise();
            expect(map.getOrientation()).toEqual(-90);

            map.rotateCounterClockwise();
            expect(map.getOrientation()).toEqual(-180);

            map.rotateCounterClockwise();
            expect(map.getOrientation()).toEqual(-270);

            // stepping over or on 360deg, so we expect a reset to 0
            map.rotateCounterClockwise();
            expect(map.getOrientation()).toEqual(0);
        });
    });
});