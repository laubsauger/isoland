describe('Renderer', function() {
    var viewport,
        map,
        canvasMock = {
            getContext: function() {
                return {translate: function() {}};
            }
        },
        contextMock = {
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
            },
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

        canvasMock.getContext = jasmine.createSpy("getContext() spy").andReturn(contextMock);
    });

    describe('configuration', function() {
        it('sets up a 2d renderer', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "2d",
                offset: 0
            };

            var renderer = new Renderer(canvasMock, rendererConfig);

            expect(canvasMock.getContext).toHaveBeenCalled();
        });

        it('sets up an iso renderer', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "iso",
                offset: 0
            };

            var renderer = new Renderer(canvasMock, rendererConfig);
            expect(canvasMock.getContext).toHaveBeenCalled();
        });

        it('throws exception when passing unsupported renderMode', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "unsupported",
                offset: 0
            };

            expect(function() { new Renderer(canvasMock, rendererConfig)}).toThrow(new InvalidArgumentException(rendererConfig.renderMode, 'Renderer', 'configure', 'config.rendermode'));
            expect(canvasMock.getContext).toHaveBeenCalled();
        });
    });

    describe('execution', function() {
        it('draws viewport (iso) to canvas', function() {
            var rendererConfig = {
                    tileWidth: 20,
                    tileHeight: 20,
                    renderMode: "iso",
                    offset: 0
                };

            var renderer = new Renderer(canvasMock, rendererConfig);

            expect(canvasMock.getContext).toHaveBeenCalled();

            renderer.execute(viewport);
        });

        it('draws viewport (iso) to canvas', function() {
            var rendererConfig = {
                    tileWidth: 20,
                    tileHeight: 20,
                    renderMode: "2d",
                    offset: 0
                };

            canvasMock.getContext = jasmine.createSpy("getContext() spy").andReturn(contextMock);

            var renderer = new Renderer(canvasMock, rendererConfig);

            expect(canvasMock.getContext).toHaveBeenCalled();

            renderer.execute(viewport);
        });
    });
});