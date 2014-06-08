var Game = function() {

};

Game.prototype = {
    run: function() {
        var map = new Map(4),
            viewport = new Viewport(map, 2),
            renderer = new Renderer();

        renderer.configure(document.querySelector('#world'));
        renderer.execute(viewport, false);
    }
};

var gameRunner = new Game();

gameRunner.run();