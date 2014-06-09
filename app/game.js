var Game = function() {

};

Game.prototype = {
    run: function() {
        var presetMap = [[

            {
                x: 1,
                y: 0,
                level: 1
            },
            {
                x: 2,
                y: 0,
                level: 1
            },
            {
                x: 3,
                y: 0,
                level: 2
            }
        ]];


        var map = new Map(10, presetMap),
            viewport = new Viewport(map, 4),
            renderer = new Renderer(document.querySelector('#world')),
            rendererIso = new Renderer(document.querySelector('#worldIso'));

        renderer.configure(32, 32);
        renderer.execute(viewport, false);

        rendererIso.configure(48, 24);
        rendererIso.execute(viewport, true);
    }
};