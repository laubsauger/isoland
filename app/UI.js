var UI = function(config) {
    this.config = config;
    this.buttons = [];

    this.init();

    return this;
};

UI.prototype = {
    /**
     * Attach Event listeners
     */
    init: function() {
        var controlsContainer = document.querySelector('.world-controls');
        //@todo: there is a weird confusion between cw and ccw somewhere, that's why it's inverted here
        this.createButton(controlsContainer, 'Rotate CW', 'rotate--ccw icon-clockwise', 'ccw');
        this.createButton(controlsContainer, 'Rotate CCW', 'rotate--cw icon-counterclockwise', 'cw');

        var mapStatsContainer =  document.querySelector('.map-data');
        this.createMapStatsText(mapStatsContainer, this.config.worldSize, this.config.metersPerTile);
    },

    createButton: function(parentElement, label, classes, value) {
        var button = document.createElement('button');

        button.setAttribute('class', classes);
        button.textContent = label;
        button.value = value;

        parentElement.appendChild(button);

        this.buttons.push(button);
    },

    createMapStatsText: function(parentElement, worldSize, metersPerTile) {
        var title = document.createElement('h4');
        var paragraph = document.createElement('div');

        title.textContent = 'Stats';

        var textSizeInTiles = document.createElement('div');
        textSizeInTiles.textContent = worldSize + ' x ' + worldSize + ' Tiles';
        paragraph.appendChild(textSizeInTiles);

        var textMetersPerTile = document.createElement('div');
        textMetersPerTile.textContent = metersPerTile + ' m per Tile';
        paragraph.appendChild(textMetersPerTile);

        var textSizeInMeters = document.createElement('div');
        var lengthInMeters = metersPerTile * worldSize;
        textSizeInMeters.textContent = lengthInMeters + ' x ' + lengthInMeters + ' m';
        paragraph.appendChild(textSizeInMeters);

        parentElement.appendChild(title);
        parentElement.appendChild(paragraph);
    }
};
