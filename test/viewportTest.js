describe('Viewport', function() {
    var viewport,
        map;

    beforeEach(function() {
        map = new Map(8);
        viewport = new Viewport(4, map);
    });

    describe('initialization', function() {
        it('creates an 2d-array with the provided dimensions containing Tiles', function() {
            viewport.init(0,0);
            expect(viewport.tiles[0][0] instanceof Tile).toBeTruthy();
            expect(viewport.tiles.length).toEqual(4);
            expect(viewport.tiles.length * viewport.edgeLength).toEqual(16);
        });

        it('throws exception when trying to create a viewport with edgelength <= 0', function() {
            var smallMap = new Map(4),
                viewportOffset = {x: 20, y: 0};
            var viewport =  new Viewport(2, smallMap);
            //@todo: figure out how to properly expect specific exceptions with jasmine2.x
            //noinspection JSValidateTypes
            //expect(function() { new Viewport(0, smallMap, viewportOffset.x, viewportOffset.y); }).toThrow(new InvalidArgumentException(0, 'Viewport', 'construct', 'edgeLength'));
            expect(function() { viewport.init(viewportOffset.x, viewportOffset.y); }).toThrow();
        });

        it('throws exception when trying to create a viewport while not passing a Map object', function() {
            var smallMap = new Array(4);
            //@todo: figure out how to properly expect specific exceptions with jasmine2.x
            //noinspection JSValidateTypes
            //expect(function() { new Viewport(2, smallMap, viewportOffset.x, viewportOffset.y); }).toThrow(new InvalidArgumentException(smallMap, 'Viewport', 'construct', 'map'));
            expect(function() { new Viewport(2, smallMap); }).toThrow();
        });

        it('throws exception when trying to create a viewport with non-numeric offsets', function() {
            var smallMap = new Map(4),
                viewportOffset = {x: "0,1", y: "ab"};

            var viewport =  new Viewport(2, smallMap);
            //@todo: figure out how to properly expect specific exceptions with jasmine2.x
            //noinspection JSValidateTypes
            //expect(function() { new Viewport(2, smallMap, viewportOffset.x, viewportOffset.y); }).toThrow(new InvalidArgumentException([viewportOffset.x, viewportOffset.y], 'Viewport', 'construct', 'offsetX/offsetY'));
            expect(function() { viewport.init(viewportOffset.x, viewportOffset.y); }).toThrow();
        });
    });

    describe('rotation', function() {
        it('rotates the array of tiles in view clockwise', function() {
            var rotatingViewport = new Viewport(3, map);
            rotatingViewport.init(0, 0);

            var oldTopRightTile = rotatingViewport.getTileAt(new Pos(0,2)),
                oldBottomLeftTile = rotatingViewport.getTileAt(new Pos(2,0));

            rotatingViewport.rotateClockwise();

            var newTopRightTile = rotatingViewport.getTileAt(new Pos(0,2)),
                newBottomLeftTile = rotatingViewport.getTileAt(new Pos(2,0));

            expect(newTopRightTile).not.toEqual(oldTopRightTile);
            expect(newBottomLeftTile).not.toEqual(oldBottomLeftTile);

            expect(rotatingViewport.getTileAt(new Pos(2,2))).toEqual(oldTopRightTile);
            expect(rotatingViewport.getTileAt(new Pos(0,0))).toEqual(oldBottomLeftTile);
        });

        it('rotates the array of tiles in view counterclockwise', function() {
            var rotatingViewport = new Viewport(3, map);
            rotatingViewport.init(0, 0);

            var oldTopRightTile = rotatingViewport.getTileAt(new Pos(0,2)),
                oldBottomLeftTile = rotatingViewport.getTileAt(new Pos(2,0));

            rotatingViewport.rotateCounterClockwise();

            var newTopRightTile = rotatingViewport.getTileAt(new Pos(0,2)),
                newBottomLeftTile = rotatingViewport.getTileAt(new Pos(2,0));

            expect(newTopRightTile).not.toEqual(oldTopRightTile);
            expect(newBottomLeftTile).not.toEqual(oldBottomLeftTile);

            expect(rotatingViewport.getTileAt(new Pos(0,0))).toEqual(oldTopRightTile);
            expect(rotatingViewport.getTileAt(new Pos(2,2))).toEqual(oldBottomLeftTile);
        });

        it('modifies the viewport orientation when rotating the array of tiles in view', function() {
            var rotatingViewport = new Viewport(3, map);
            rotatingViewport.init(0, 0);

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
        it('returns the expected tile at the provided coordinates when not passing offset position (= viewport created at the top left)', function() {
            var smallMap = new Map(4),
                viewport = new Viewport(3, map);

            viewport.init(0, 0);
            expect(viewport.getTileAt(new Pos(2,2))).toEqual(smallMap.getTileAt(new Pos(2,2)));
        });

        it('returns the expected tiles when creating the viewport with passed offset position (= viewport was moved)', function() {
            var smallMap = new Map(4),
                expectedTilePosition = {x: 2, y: 2},
                expectedTile = smallMap.getTileAt(new Pos(expectedTilePosition.x, expectedTilePosition.y)),
                viewportOffset = {x: 2, y: 2},
                viewport = new Viewport(2, map);

            viewport.init(viewportOffset.x, viewportOffset.y);
            expect(viewport.getTileAt(new Pos(0, 0))).toEqual(expectedTile);
        });

        it('throws exception when trying to create a viewport with offsets that are out of bounds (= moved too far, no map left to render)', function() {
            var smallMap = new Map(4),
                viewportOffset = {x: 20, y: 0};
            var viewport = new Viewport(2, smallMap);

            //@todo: figure out how to properly expect specific exceptions with jasmine2.x
            //noinspection JSValidateTypes
            //expect(function() { new Viewport(2, smallMap, viewportOffset.x, viewportOffset.y); }).toThrow(new InvalidArgumentException([viewportOffset.x, viewportOffset.y], "Viewport", "construct", "this.offset.x/y"));
            expect(function() { viewport.init(viewportOffset.x, viewportOffset.y); }).toThrow();
        });
    });
});
