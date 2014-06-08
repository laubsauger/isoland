var Game = function() {

};

Game.prototype = {
    run: function() {
        var map = new Map(10),
            viewport = new Viewport(map, 4),
            renderer = new Renderer(document.querySelector('#world')),
            rendererIso = new Renderer(document.querySelector('#worldIso'));

        renderer.configure(32, 32);
        renderer.execute(viewport, false);

        rendererIso.configure(48, 24);
        rendererIso.execute(viewport, true);
    }
};