describe('Viewport', function() {
    var viewport,
        map;

    beforeEach(function() {
        map = new Map(10);
        viewport = new Viewport(map.tiles, 5);
    });

    describe('initialization', function() {
        it('creates an 2d-array with the provided dimensions containing Tiles', function() {
            expect(viewport.tiles[0][0] instanceof Tile).toBeTruthy();
            expect(viewport.tiles.length).toEqual(5);
            expect(viewport.tiles.length * viewport.edgeLength).toEqual(25);
        });

        it('returns the tile at the provided coordinates', function() {
            var tile = new Tile(2,2);

            expect(viewport.getTileAt(2,2)).toEqual(tile);
        });
    });

    describe('rotation', function() {
        it('rotates the array of tiles in view clockwise', function() {
            var rotatingViewport = new Viewport(map.tiles, 3);

            var oldTopRightTile = rotatingViewport.getTileAt(0,2),
                oldBottomLeftTile = rotatingViewport.getTileAt(2,0);

            rotatingViewport.rotateClockwise();

            var newTopRightTile = rotatingViewport.getTileAt(0,2),
                newBottomLeftTile = rotatingViewport.getTileAt(2,0);

            expect(newTopRightTile).not.toEqual(oldTopRightTile);
            expect(newBottomLeftTile).not.toEqual(oldBottomLeftTile);

            expect(rotatingViewport.getTileAt(2,2)).toEqual(oldTopRightTile);
            expect(rotatingViewport.getTileAt(0,0)).toEqual(oldBottomLeftTile);
        });

        it('rotates the array of tiles in view counterclockwise', function() {
            var rotatingViewport = new Viewport(map.tiles, 3);

            var oldTopRightTile = rotatingViewport.getTileAt(0,2),
                oldBottomLeftTile = rotatingViewport.getTileAt(2,0);

            rotatingViewport.rotateCounterClockwise();

            var newTopRightTile = rotatingViewport.getTileAt(0,2),
                newBottomLeftTile = rotatingViewport.getTileAt(2,0);

            expect(newTopRightTile).not.toEqual(oldTopRightTile);
            expect(newBottomLeftTile).not.toEqual(oldBottomLeftTile);

            expect(rotatingViewport.getTileAt(0,0)).toEqual(oldTopRightTile);
            expect(rotatingViewport.getTileAt(2,2)).toEqual(oldBottomLeftTile);
        });

        it('modifies the viewport orientation when rotating the array of tiles in view', function() {
            viewport.create(map.tiles, 3);

            viewport.rotateClockwise();
            expect(viewport.getOrientation()).toEqual(90);

            viewport.rotateClockwise();
            expect(viewport.getOrientation()).toEqual(180);

            viewport.rotateClockwise();
            expect(viewport.getOrientation()).toEqual(270);

            // stepping over or on 360deg, so we expect a reset to 0
            viewport.rotateClockwise();
            expect(viewport.getOrientation()).toEqual(0);

            viewport.rotateCounterClockwise();
            expect(viewport.getOrientation()).toEqual(-90);

            viewport.rotateCounterClockwise();
            expect(viewport.getOrientation()).toEqual(-180);

            viewport.rotateCounterClockwise();
            expect(viewport.getOrientation()).toEqual(-270);

            // stepping over or on 360deg, so we expect a reset to 0
            viewport.rotateCounterClockwise();
            expect(viewport.getOrientation()).toEqual(0);
        });
    });
});