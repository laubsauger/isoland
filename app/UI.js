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
        //@todo: there is a weird confusion somewhere between cw and ccw that's why it's inverted here
        this.createButton('.world', 'Rotate CCW', 'rotate--cw', 'cw');
        this.createButton('.world', 'Rotate CW', 'rotate--ccw', 'ccw');
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
