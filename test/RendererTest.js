describe('Renderer', function() {
    var viewport,
        map;

    beforeEach(function() {
        map = new Map(10);
        viewport = new Viewport(map, 5);
    });

    describe('configuration', function() {
        it('sets up the renderer', function() {
            var renderer = new Renderer();
        });
    });
});