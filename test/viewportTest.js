describe('Viewport', function() {
    var viewport,
        map;

    beforeEach(function() {
        map = new Map(10);
        viewport = new Viewport(map, 5);
    });

    describe('initialization', function() {
        it('creates an 2d-array with the provided dimensions containing Tiles', function() {
            expect(viewport.tiles[0][0] instanceof Tile).toBeTruthy();
            expect(viewport.tiles.length).toEqual(5);
            expect(viewport.tiles.length * viewport.edgeLength).toEqual(25);
        });

    });

    describe('rotation', function() {
        it('rotates the array of tiles in view clockwise', function() {
            var rotatingViewport = new Viewport(map, 3);

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
            var rotatingViewport = new Viewport(map, 3);

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
            var rotatingViewport = new Viewport(map, 3);

            rotatingViewport.rotateClockwise();
            expect(rotatingViewport.getOrientation()).toEqual(90);

            rotatingViewport.rotateClockwise();
            expect(rotatingViewport.getOrientation()).toEqual(180);

            rotatingViewport.rotateClockwise();
            expect(rotatingViewport.getOrientation()).toEqual(270);

            // stepping over or on 360deg, so we expect a reset to 0
            rotatingViewport.rotateClockwise();
            expect(rotatingViewport.getOrientation()).toEqual(0);

            rotatingViewport.rotateCounterClockwise();
            expect(rotatingViewport.getOrientation()).toEqual(-90);

            rotatingViewport.rotateCounterClockwise();
            expect(rotatingViewport.getOrientation()).toEqual(-180);

            rotatingViewport.rotateCounterClockwise();
            expect(rotatingViewport.getOrientation()).toEqual(-270);

            // stepping over or on 360deg, so we expect a reset to 0
            rotatingViewport.rotateCounterClockwise();
            expect(rotatingViewport.getOrientation()).toEqual(0);
        });
    });

    describe('movement', function() {
        it('returns the expected tile at the provided coordinates when not passing position', function() {
            var smallMap = new Map(4),
                viewport = new Viewport(map, 3);

            expect(viewport.getTileAt(2,2)).toEqual(smallMap.getTileAt(2,2));
        });

        it('returns the expected tiles when creating the viewport with passed position', function() {
            var smallMap = new Map(4),
                expectedTilePosition = {x: 2, y: 2},
                expectedTile = smallMap.getTileAt(expectedTilePosition.x, expectedTilePosition.y),
                viewportOffset = {x: 2, y: 2},
                viewport = new Viewport(map, 2, viewportOffset.x, viewportOffset.y);

            expect(viewport.getTileAt(0,0)).toEqual(expectedTile);
        });

        it('throws exception when trying to create a viewport that does not completely fit on the map', function() {
            var smallMap = new Map(4),
                viewportOffset = {x: 20, y: 0};

            //noinspection JSValidateTypes
            expect(function() { new Viewport(smallMap, 2, viewportOffset.x, viewportOffset.y); }).toThrow(new InvalidArgumentException([viewportOffset.x, viewportOffset.y], "Viewport", "construct", "this.offset.x/y"));
        });
    });
});