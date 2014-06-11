describe('Renderer', function() {
    var viewport,
        map;

    beforeEach(function() {
        map = new Map(10);
        viewport = new Viewport(map, 5);
    });

    describe('configuration', function() {
        it('sets up a 2d renderer', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "2d",
                offset: 0
            };

            var renderer = new Renderer({getContext: function(){}}, rendererConfig);
        });

        it('sets up an iso renderer', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "iso",
                offset: 0
            };

            var renderer = new Renderer({getContext: function(){}}, rendererConfig);
        });

        it('throws exception when passing unsupported renderMode', function() {
            var rendererConfig = {
                tileWidth: 20,
                tileHeight: 20,
                renderMode: "unsupported",
                offset: 0
            };

            expect(function() { new Renderer({getContext: function(){}}, rendererConfig)}).toThrow(new InvalidArgumentException(rendererConfig.renderMode, 'Renderer', 'configure', 'config.rendermode'));
        });
    });

    describe('execution', function() {
        it('draws viewport to canvas', function() {
            var rendererConfig = {
                    tileWidth: 20,
                    tileHeight: 20,
                    renderMode: "iso",
                    offset: 0
                },
                canvasMock = {
                    getContext: function() {}
                },
                contextMock = {
                    translate: function() {},
                    beginPath: function() {},
                    moveTo: function() {},
                    lineTo: function() {},
                    fill: function() {},
                    stroke: function() {},
                    closePath: function() {},
                    fillText: function() {}
                };

            canvasMock.getContext = jasmine.createSpy("getContext() spy").andReturn(contextMock);

            var renderer = new Renderer(canvasMock, rendererConfig);

            expect(canvasMock.getContext).toHaveBeenCalled();

            renderer.execute(viewport);
        });
    });
});