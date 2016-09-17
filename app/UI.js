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
        //@todo: there is a weird confusion between cw and ccw somewhere, that's why it's inverted here
        this.createButton('.world-controls', 'Rotate CW', 'rotate--ccw icon-clockwise', 'ccw');
        this.createButton('.world-controls', 'Rotate CCW', 'rotate--cw icon-counterclockwise', 'cw');
    },

    createButton: function(parentSelector, label, classes, value) {
        var parent = document.querySelector(parentSelector);
        var button = document.createElement('button');

        button.setAttribute('class', classes);
        button.textContent = label;
        button.value = value;

        parent.appendChild(button);

        this.buttons.push(button);
    }
};
