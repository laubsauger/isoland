var renderToBufferCanvas = function (width, height, renderFunction) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    renderFunction(buffer.getContext('2d'));
    return buffer;
};

/**
 * Creates and returns in-memory canvas
 * @param width
 * @param height
 * @returns {HTMLElement}
 */
var createBufferCanvas = function (width, height) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    return buffer;
};
