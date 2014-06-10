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
                level: 2
            },
            {
                x: 3,
                y: 0,
                level: 3
            }
        ]];


        var map = new Map(10, presetMap),
            viewport = new Viewport(map, 4),
            renderer = new Renderer(document.querySelector('#world')),
            rendererIso = new Renderer(document.querySelector('#worldIso')),
            render2dConfig = {
                tileWidth: 32,
                tileHeight: 32,
                renderMode: "2d"
            },
            renderIsoConfig = {
                tileWidth: 48,
                tileHeight: 48,
                renderMode: "iso"
            };

        renderer.configure(render2dConfig).execute(viewport);
        rendererIso.configure(renderIsoConfig).execute(viewport);
    }
};