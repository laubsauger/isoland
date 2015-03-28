/**
 * Tile object
 * @param {Number} x
 * @param {Number} y
 * @param {Number} level
 * @param {TileElevateParam} [elevateParam]
 * @constructor
 */
var Tile = function(x, y, level, elevateParam) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.elevate = elevateParam || new TileElevateParam(0, 0, 0, 0);
    this.hasFocus = false;
};

/**
 * TileElevateParam object
 * @param {int} top
 * @param {int} right
 * @param {int} bottom
 * @param {int} left
 * @constructor
 */
var TileElevateParam = function(top, right, bottom, left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
};
