describe('Renderer', function() {
    var viewport,
        map,
        canvasSpy,
        canvasStub = {
            getContext: function() {
                return {translate: function() {}};
            }
        },
        contextStub = {
            clearRect: function() {},
            translate: function() {},
            beginPath: function() {},
            moveTo: function() {},
            lineTo: function() {},
            fill: function() {},
            stroke: function() {},
            closePath: function() {},
            fillText: function() {}
        };

    beforeEach(function() {
        var presetMap = [[
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
        map = new Map(10, presetMap);
        viewport = new Viewport(5, map);

        // spies
        spyOn(canvasStub, 'getContext')
            .and.callThrough()
            .and.returnValue(contextStub);
    });

    describe('configuration', function() {
        it('sets up a 2d renderer', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "2d",
                offset: 0
            };

            var renderer = new Renderer(canvasStub, rendererConfig);

            expect(canvasStub.getContext).toHaveBeenCalled();
        });

        it('sets up an iso renderer', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "iso",
                offset: 0
            };

            var renderer = new Renderer(canvasStub, rendererConfig);
            expect(canvasStub.getContext).toHaveBeenCalled();
        });

        it('throws exception when passing unsupported renderMode', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "unsupported",
                offset: 0
            };

            //@todo: figure out how to properly expect specific exceptions with jasmine2.x
            //expect(function() { new Renderer(canvasStub, rendererConfig)}).toThrow(new InvalidArgumentException("Unknown render mode: " + rendererConfig.renderMode));
            expect(function() { new Renderer(canvasStub, rendererConfig)}).toThrow();
            expect(canvasStub.getContext).toHaveBeenCalled();
        });
    });

    describe('execution', function() {
        it('iso: draws viewport to canvas', function() {
            var rendererConfig = {
                    tileWidth: 20,
                    tileHeight: 20,
                    renderMode: "iso",
                    offset: 0
                };

            var renderer = new Renderer(canvasStub, rendererConfig);

            expect(canvasStub.getContext).toHaveBeenCalled();

            renderer.execute(viewport);
        });

        it('2d: draws viewport to canvas', function() {
            var rendererConfig = {
                    tileWidth: 20,
                    tileHeight: 20,
                    renderMode: "2d",
                    offset: 0
                };

            var renderer = new Renderer(canvasStub, rendererConfig);

            expect(canvasStub.getContext).toHaveBeenCalled();

            renderer.execute(viewport);
        });

        it('test: draws viewport to canvas', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "test",
                offset: 0
            };

            var renderer = new Renderer(canvasStub, rendererConfig);

            expect(canvasStub.getContext).toHaveBeenCalled();

            renderer.execute(viewport);
        });

        it('iso: returns default top fill style when tile is not focused', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "iso",
                offset: 0
            };
            var renderer = new Renderer(canvasStub, rendererConfig);

            spyOn(renderer, '_getTileTopFillStyle').and.returnValue('#bbb');

            renderer.execute(viewport);

            expect(renderer._getTileTopFillStyle).toHaveBeenCalled();
        });

        it('iso: returns highlight top fill style when tile is focused', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "iso",
                offset: 0
            };
            var renderer = new Renderer(canvasStub, rendererConfig);

            viewport = new Viewport(2, new Map(2));
            var tile = new Tile(0,0,1);
            tile.hasFocus = true;

            spyOn(renderer, '_getTileTopFillStyle').and.returnValue('#bbb');
            spyOn(viewport, 'getTileAt').and.returnValue(tile);

            renderer.execute(viewport);

            expect(viewport.getTileAt).toHaveBeenCalledWith(0, 1);
            expect(renderer._getTileTopFillStyle).toHaveBeenCalled();
        });

        it('2d: returns default top fill style when tile is not focused', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "2d",
                offset: 0
            };
            var renderer = new Renderer(canvasStub, rendererConfig);

            spyOn(renderer, '_getTileTopFillStyle').and.returnValue('#bbb');

            renderer.execute(viewport);

            expect(renderer._getTileTopFillStyle).toHaveBeenCalled();
        });

        it('2d: returns highlight top fill style when tile is focused', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "2d",
                offset: 0
            };
            var renderer = new Renderer(canvasStub, rendererConfig);

            viewport = new Viewport(2, new Map(2));
            var tile = new Tile(0,0,1);
            tile.hasFocus = true;

            spyOn(renderer, '_getTileTopFillStyle').and.returnValue('#bbb');
            spyOn(viewport, 'getTileAt').and.returnValue(tile);

            renderer.execute(viewport);

            expect(viewport.getTileAt).toHaveBeenCalledWith(0, 1);
            expect(renderer._getTileTopFillStyle).toHaveBeenCalled();
        });
    });
});
