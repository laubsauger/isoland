describe('Renderer', function() {
    var viewport,
        map,
        canvasStub = {
            getContext: function() {
                return {translate: function() {}};
            }
        },
        offscreenCanvasStub = {
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
            fillText: function() {},
            drawImage: function() {}
        },
        colorLuminanceStub = {calculate: function() {}};

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

        spyOn(colorLuminanceStub, 'calculate');
        // spies
        spyOn(canvasStub, 'getContext')
            .and.callThrough()
            .and.returnValue(contextStub);

        // spies
        spyOn(offscreenCanvasStub, 'getContext')
            .and.callThrough()
            .and.returnValue(contextStub);
    });

    describe('configuration', function() {
        it('sets up a 2d renderer', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "2d",
                offset: 0,
                canvasDim: {width:0,height:0}
            };

            var renderer = new Renderer(canvasStub, rendererConfig, colorLuminanceStub);

            expect(canvasStub.getContext).toHaveBeenCalled();
        });

        it('sets up an iso renderer', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "iso",
                offset: 0,
                canvasDim: {width:0,height:0}
            };

            var renderer = new Renderer(canvasStub, rendererConfig, colorLuminanceStub, offscreenCanvasStub);
            expect(canvasStub.getContext).toHaveBeenCalled();
        });

        it('throws exception when passing unsupported renderMode', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "unsupported",
                offset: 0,
                canvasDim: {width:0,height:0}
            };

            //@todo: figure out how to properly expect specific exceptions with jasmine2.x
            //expect(function() { new Renderer(canvasStub, rendererConfig)}).toThrow(new InvalidArgumentException("Unknown render mode: " + rendererConfig.renderMode));
            expect(function() { new Renderer(canvasStub, rendererConfig, colorLuminanceStub)}).toThrow();
            expect(canvasStub.getContext).toHaveBeenCalled();
        });
    });

    describe('execution', function() {
        it('iso: draws viewport to canvas', function() {
            var rendererConfig = {
                    tileWidth: 20,
                    tileHeight: 20,
                    renderMode: "iso",
                    offset: 0,
                    canvasDim: {width:0,height:0}
                };

            var renderer = new Renderer(canvasStub, rendererConfig, colorLuminanceStub, offscreenCanvasStub);

            expect(canvasStub.getContext).toHaveBeenCalled();
            expect(offscreenCanvasStub.getContext).toHaveBeenCalled();

            renderer.execute(viewport);
        });

        it('2d: draws viewport to canvas', function() {
            var rendererConfig = {
                    tileWidth: 20,
                    tileHeight: 20,
                    renderMode: "2d",
                    offset: 0,
                    canvasDim: {width:0,height:0}
                };

            var renderer = new Renderer(canvasStub, rendererConfig, colorLuminanceStub);

            expect(canvasStub.getContext).toHaveBeenCalled();

            renderer.execute(viewport);
        });

        it('test: draws viewport to canvas', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "test",
                offset: 0,
                canvasDim: {width:0,height:0}
            };

            var renderer = new Renderer(canvasStub, rendererConfig, colorLuminanceStub);

            renderer.execute(viewport);

            expect(canvasStub.getContext).toHaveBeenCalled();
            expect(colorLuminanceStub.calculate).toHaveBeenCalled();
        });

        // @todo: fix this up to test offscreen rendering
        it('iso: returns default top fill style when tile is not focused', function() {
            pending();

            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "iso",
                offset: 0,
		        canvasDim: {width:0,height:0}
            };
            var renderer = new Renderer(canvasStub, rendererConfig, colorLuminanceStub, offscreenCanvasStub);

            spyOn(renderer, '_getTileTopFillStyle').and.returnValue('#bbb');

            renderer.execute(viewport);

            expect(offscreenCanvasStub.getContext).toHaveBeenCalled();
            expect(renderer._getTileTopFillStyle).toHaveBeenCalled();
        });

        // @todo: fix this up to test offscreen rendering
        it('iso: returns highlight top fill style when tile is focused', function() {
            pending();

            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "iso",
                offset: 0,
		        canvasDim: {width:0,height:0}
            };
            var renderer = new Renderer(canvasStub, rendererConfig, colorLuminanceStub, offscreenCanvasStub);

            viewport = new Viewport(2, new Map(2));
            var tile = new Tile(0,0,1);
            tile.isHovered = true;

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
                offset: 0,
		        canvasDim: {width:0,height:0}
            };
            var renderer = new Renderer(canvasStub, rendererConfig, colorLuminanceStub);

            spyOn(renderer, '_getTileTopFillStyle').and.returnValue('#bbb');

            renderer.execute(viewport);

            expect(renderer._getTileTopFillStyle).toHaveBeenCalled();
        });

        it('2d: returns highlight top fill style when tile is focused', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "2d",
                offset: 0,
		        canvasDim: {width:0,height:0}
            };
            var renderer = new Renderer(canvasStub, rendererConfig, colorLuminanceStub);

            viewport = new Viewport(2, new Map(2));
            var tile = new Tile(0,0,1);
            tile.isHovered = true;

            spyOn(renderer, '_getTileTopFillStyle').and.returnValue('#bbb');
            spyOn(viewport, 'getTileAt').and.returnValue(tile);

            renderer.execute(viewport);

            expect(viewport.getTileAt).toHaveBeenCalledWith(new Pos(0, 1));
            expect(renderer._getTileTopFillStyle).toHaveBeenCalled();
        });
    });
});
